/**
 * Script to seed 25,000 additional orders only
 * Uses existing users and restaurants from the database
 */

const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

const Usuario = require('./models/Usuario');
const Orden = require('./models/Orden');
const Restaurante = require('./models/Restaurante');
const MenuItem = require('./models/MenuItem');

// Helper function to get nearest restaurants to a user location
function getNearestRestaurants(userCoord, restaurants, limit = 10) {
  const withDistance = restaurants.map(r => ({
    ...r,
    distance: Math.hypot(
      (r.address?.coord?.[0] ?? 0) - userCoord[0],
      (r.address?.coord?.[1] ?? 0) - userCoord[1]
    )
  }));

  return withDistance.sort((a, b) => a.distance - b.distance).slice(0, limit);
}

async function seedAdditionalOrders() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/projectdb';
    console.log(`Connecting to MongoDB: ${mongoUri}`);
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Fetch existing users and restaurants
    console.log('Fetching existing users and restaurants...');
    const users = await Usuario.find().select('_id address.coord address.building address.street').lean();
    const restaurants = await Restaurante.find().select('_id cuisine address').limit(500).lean();

    console.log(`Found ${users.length} users and ${restaurants.length} restaurants`);

    if (users.length === 0 || restaurants.length === 0) {
      console.error('Not enough existing users or restaurants. Please run seed.js first.');
      process.exit(1);
    }

    // Build menu items by restaurant
    console.log('Fetching menu items by restaurant...');
    const menuItemsByRestaurant = {};

    for (const restaurant of restaurants) {
      const items = await MenuItem.find({ restauranteId: restaurant._id }).select('_id nombre precio').lean();
      if (items.length > 0) {
        menuItemsByRestaurant[restaurant._id] = items;
      }
    }

    const restaurantsWithItems = restaurants.filter(r => menuItemsByRestaurant[r._id] && menuItemsByRestaurant[r._id].length > 0);
    console.log(`Found ${restaurantsWithItems.length} restaurants with menu items`);

    if (restaurantsWithItems.length === 0) {
      console.error('No restaurants with menu items found.');
      process.exit(1);
    }

    // Generate 25,000 orders
    const NUM_ORDERS = 25000;
    console.log(`\nGenerating ${NUM_ORDERS} additional orders...`);

    const orderBulkOps = [];
    const CHUNK_SIZE = 1000;

    for (let i = 0; i < NUM_ORDERS; i++) {
      // Select random user
      const user = users[Math.floor(Math.random() * users.length)];
      const userCoord = user.address?.coord || [0, 0];

      // Get nearest restaurants to user location
      const nearestRestaurants = getNearestRestaurants(userCoord, restaurantsWithItems, 10);

      if (nearestRestaurants.length === 0) {
        continue;
      }

      // Select from nearest restaurants (with bias towards closer ones)
      const restaurant = nearestRestaurants[Math.floor(Math.random() * Math.min(5, nearestRestaurants.length))];
      const menuItems = menuItemsByRestaurant[restaurant._id];

      if (!menuItems || menuItems.length === 0) {
        continue;
      }

      // Generate order items
      const itemsInOrder = Math.floor(Math.random() * 3) + 1; // 1-3 items per order
      const orderItems = [];
      let orderTotal = 0;

      for (let itemIndex = 0; itemIndex < itemsInOrder; itemIndex++) {
        const menuItem = menuItems[Math.floor(Math.random() * menuItems.length)];
        const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
        const subtotal = menuItem.precio * quantity;
        orderTotal += subtotal;

        orderItems.push({
          menuItemId: menuItem._id,
          nombre: menuItem.nombre,
          precioUnitario: menuItem.precio,
          cantidad: quantity,
          subtotal: subtotal
        });
      }

      const orderStatus = ['ENTREGADA', 'CONFIRMADA', 'EN_PREPARACION', 'LISTA'][
        Math.floor(Math.random() * 4)
      ];

      // Create order for bulk insert
      orderBulkOps.push({
        insertOne: {
          document: {
            usuarioId: user._id,
            restauranteId: restaurant._id,
            items: orderItems,
            total: orderTotal,
            estado: orderStatus,
            fechaOrden: faker.date.past({ years: 2 }),
            fechaEntrega: faker.date.future(),
            direccionEntrega: {
              building: user.address?.building || faker.location.buildingNumber(),
              street: user.address?.street || faker.location.street(),
              zipcode: faker.location.zipCode('####0'),
              borough: ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'][Math.floor(Math.random() * 5)],
              coord: userCoord,
              instrucciones: Math.random() > 0.7 ? faker.lorem.sentence() : ''
            }
          }
        }
      });

      // Progress indicator
      if ((i + 1) % 5000 === 0) {
        console.log(`  ⏳ Generated ${i + 1}/${NUM_ORDERS} orders...`);
      }
    }

    // Execute bulk writes in chunks
    console.log(`\nInserting ${orderBulkOps.length} orders using bulkWrite...`);
    let totalInserted = 0;

    for (let i = 0; i < orderBulkOps.length; i += CHUNK_SIZE) {
      const chunk = orderBulkOps.slice(i, i + CHUNK_SIZE);
      const result = await Orden.collection.bulkWrite(chunk);
      totalInserted += result.insertedCount;
      console.log(`  ✓ Inserted ${result.insertedCount} orders (${Math.min(i + CHUNK_SIZE, orderBulkOps.length)}/${orderBulkOps.length})`);
    }

    // Verify results
    const totalOrders = await Orden.countDocuments();
    console.log(`\n✅ Seeding completed!`);
    console.log(`   Total orders in database: ${totalOrders}`);
    console.log(`   Orders inserted in this run: ${totalInserted}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

seedAdditionalOrders();
