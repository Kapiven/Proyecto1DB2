const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

const Restaurante = require('./models/Restaurante');
const MenuItem = require('./models/MenuItem');
const Usuario = require('./models/Usuario');
const Orden = require('./models/Orden');
const Resena = require('./models/Resena');

// Menu item templates by cuisine type
const MENU_TEMPLATES = {
  'Italian': [
    { name: 'Pasta Carbonara', description: 'Classic Italian pasta with bacon and egg sauce', price: 14.99 },
    { name: 'Spaghetti Bolognese', description: 'Spaghetti with rich meat sauce', price: 13.99 },
    { name: 'Lasagna', description: 'Layered pasta with meat and béchamel sauce', price: 15.99 },
    { name: 'Ravioli', description: 'Filled pasta parcels', price: 12.99 },
    { name: 'Risotto', description: 'Creamy rice dish', price: 14.99 },
    { name: 'Pizza Margherita', description: 'Tomato, mozzarella, and basil', price: 12.99 },
    { name: 'Fettuccine Alfredo', description: 'Creamy parmesan sauce', price: 13.99 },
    { name: 'Tiramisu', description: 'Classic Italian dessert', price: 6.99 }
  ],
  'American': [
    { name: 'Classic Burger', description: 'Juicy beef burger with all toppings', price: 11.99 },
    { name: 'New York Style Pizza', description: 'Thin crust New York pizza', price: 10.99 },
    { name: 'Hot Dog', description: 'Classic American hot dog', price: 5.99 },
    { name: 'BBQ Ribs', description: 'Slow-cooked ribs with BBQ sauce', price: 16.99 },
    { name: 'Mac and Cheese', description: 'Creamy cheesy pasta', price: 9.99 },
    { name: 'Grilled Steak', description: 'Premium grilled steak', price: 19.99 },
    { name: 'Chicken Wings', description: 'Crispy chicken wings', price: 10.99 },
    { name: 'Apple Pie', description: 'Homemade apple pie', price: 5.99 }
  ],
  'Chinese': [
    { name: 'Fried Rice', description: 'Egg fried rice with vegetables', price: 8.99 },
    { name: 'Lo Mein', description: 'Stir-fried noodles', price: 9.99 },
    { name: 'Sweet and Sour Chicken', description: 'Chicken in sweet and sour sauce', price: 11.99 },
    { name: 'Kung Pao Chicken', description: 'Spicy chicken with peanuts', price: 12.99 },
    { name: 'Dumplings', description: 'Steamed or fried dumplings', price: 7.99 },
    { name: 'General Tso Chicken', description: 'Spicy chicken dish', price: 12.99 },
    { name: 'Mongolian Beef', description: 'Beef with vegetables', price: 13.99 },
    { name: 'Fortune Cookies', description: 'Crispy cookies with fortunes', price: 2.99 }
  ],
  'Japanese': [
    { name: 'California Roll', description: 'Crab, avocado, cucumber', price: 7.99 },
    { name: 'Spicy Tuna Roll', description: 'Tuna with spicy mayo', price: 8.99 },
    { name: 'Salmon Nigiri', description: 'Fresh salmon on rice', price: 9.99 },
    { name: 'Tempura', description: 'Battered and fried shrimp and vegetables', price: 10.99 },
    { name: 'Teriyaki Chicken', description: 'Chicken in teriyaki glaze', price: 11.99 },
    { name: 'Miso Soup', description: 'Traditional miso soup', price: 4.99 },
    { name: 'Ramen', description: 'Noodle soup with broth', price: 10.99 },
    { name: 'Edamame', description: 'Steamed soybeans', price: 4.99 }
  ],
  'Mexican': [
    { name: 'Tacos', description: 'Three soft corn tacos', price: 8.99 },
    { name: 'Burrito', description: 'Large flour tortilla with fillings', price: 10.99 },
    { name: 'Enchiladas', description: 'Rolled tortillas with sauce', price: 11.99 },
    { name: 'Quesadilla', description: 'Grilled cheese and fillings', price: 9.99 },
    { name: 'Chiles Rellenos', description: 'Stuffed poblano peppers', price: 12.99 },
    { name: 'Salsa and Chips', description: 'Fresh salsa with tortilla chips', price: 4.99 },
    { name: 'Fajitas', description: 'Grilled vegetables and protein', price: 13.99 },
    { name: 'Churros', description: 'Sweet fried pastries', price: 4.99 }
  ],
  'Thai': [
    { name: 'Pad Thai', description: 'Stir-fried noodles with shrimp', price: 11.99 },
    { name: 'Green Curry', description: 'Spicy green curry with vegetables', price: 12.99 },
    { name: 'Red Curry', description: 'Creamy red curry', price: 12.99 },
    { name: 'Tom Yum Soup', description: 'Hot and sour soup', price: 9.99 },
    { name: 'Satay Chicken', description: 'Grilled chicken with peanut sauce', price: 10.99 },
    { name: 'Spring Rolls', description: 'Crispy or fresh spring rolls', price: 6.99 },
    { name: 'Mango Sticky Rice', description: 'Sweet dessert with mango', price: 5.99 },
    { name: 'Thai Iced Tea', description: 'Sweet Thai tea', price: 3.99 }
  ],
  'Indian': [
    { name: 'Chicken Tikka Masala', description: 'Tender chicken in creamy tomato sauce', price: 13.99 },
    { name: 'Butter Chicken', description: 'Chicken in butter sauce', price: 13.99 },
    { name: 'Lamb Vindaloo', description: 'Spicy lamb curry', price: 14.99 },
    { name: 'Palak Paneer', description: 'Spinach with cottage cheese', price: 11.99 },
    { name: 'Biryani', description: 'Fragrant rice with meat', price: 12.99 },
    { name: 'Naan Bread', description: 'Traditional Indian flatbread', price: 3.99 },
    { name: 'Samosa', description: 'Fried triangular pastry', price: 4.99 },
    { name: 'Mango Kulfi', description: 'Indian ice cream', price: 3.99 }
  ],
  'Korean': [
    { name: 'Bibimbap', description: 'Mixed rice with vegetables', price: 10.99 },
    { name: 'Bulgogi', description: 'Marinated beef', price: 12.99 },
    { name: 'Kimchi Jjigae', description: 'Spicy kimchi stew', price: 10.99 },
    { name: 'Tteokbokki', description: 'Spicy rice cakes', price: 7.99 },
    { name: 'Korean BBQ', description: 'Grilled meat selection', price: 18.99 },
    { name: 'Gimbap', description: 'Seaweed rice rolls', price: 8.99 },
    { name: 'Jjajangmyeon', description: 'Noodles with black bean sauce', price: 9.99 },
    { name: 'Hotteok', description: 'Sweet Korean pancake', price: 4.99 }
  ],
  'Vietnamese': [
    { name: 'Pho', description: 'Traditional beef noodle soup', price: 10.99 },
    { name: 'Banh Mi', description: 'Vietnamese sandwich', price: 7.99 },
    { name: 'Spring Rolls', description: 'Fresh or fried spring rolls', price: 6.99 },
    { name: 'Vermicelli Bowl', description: 'Rice noodles with meat', price: 9.99 },
    { name: 'Com Tam', description: 'Broken rice with grilled pork', price: 8.99 },
    { name: 'Caramel Chicken', description: 'Chicken in caramel sauce', price: 11.99 },
    { name: 'Fish Cake Soup', description: 'Traditional fish cake soup', price: 9.99 },
    { name: 'Iced Coffee', description: 'Vietnamese iced coffee', price: 3.99 }
  ],
  'French': [
    { name: 'Coq au Vin', description: 'Chicken braised in wine', price: 16.99 },
    { name: 'Beef Bourguignon', description: 'Beef stew in red wine', price: 17.99 },
    { name: 'French Onion Soup', description: 'Caramelized onion soup', price: 8.99 },
    { name: 'Duck Confit', description: 'Slow-cooked duck', price: 18.99 },
    { name: 'Escargot', description: 'Snails in garlic butter', price: 12.99 },
    { name: 'Crepes', description: 'Sweet or savory crepes', price: 9.99 },
    { name: 'Croissant', description: 'Buttery pastry', price: 4.99 },
    { name: 'Crème Brûlée', description: 'Creamy custard dessert', price: 7.99 }
  ],
  'Spanish': [
    { name: 'Paella', description: 'Rice with seafood and saffron', price: 15.99 },
    { name: 'Tapas', description: 'Assorted small plates', price: 12.99 },
    { name: 'Gazpacho', description: 'Cold tomato soup', price: 6.99 },
    { name: 'Churros with Chocolate', description: 'Fried pastries with chocolate', price: 6.99 },
    { name: 'Empanada', description: 'Filled pastry', price: 5.99 },
    { name: 'Tortilla Española', description: 'Potato omelette', price: 7.99 },
    { name: 'Gambas al Ajillo', description: 'Shrimp in garlic', price: 12.99 },
    { name: 'Sangria', description: 'Fruity wine punch', price: 4.99 }
  ],
  'Default': [
    { name: 'Grilled Salmon', description: 'Fresh grilled salmon fillet', price: 15.99 },
    { name: 'Caesar Salad', description: 'Fresh salad with Caesar dressing', price: 8.99 },
    { name: 'Vegetable Stir Fry', description: 'Mixed vegetables', price: 9.99 },
    { name: 'Grilled Chicken Breast', description: 'Lean grilled chicken', price: 12.99 },
    { name: 'Ribeye Steak', description: 'Premium cut ribeye', price: 22.99 },
    { name: 'Seafood Pasta', description: 'Pasta with seafood', price: 14.99 },
    { name: 'Vegetarian Pizza', description: 'Pizza with vegetables', price: 11.99 },
    { name: 'Chocolate Cake', description: 'Rich chocolate cake', price: 5.99 }
  ]
};

// MongoDB collection name
const mongoDBCollectionName = 'sample_restaurants';

async function seedDatabase() {
  try {
    console.log('🚀 Starting database seeding...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // Get all restaurants from sample_restaurants collection
    console.log(`📦 Fetching restaurants from ${mongoDBCollectionName}...`);
    const restaurants = await db.collection(mongoDBCollectionName).find({}).toArray();
    console.log(`✓ Found ${restaurants.length} restaurants\n`);

    // Copy restaurants to Restaurante collection (if needed)
    console.log('📝 Syncing restaurants to Restaurante collection...');
    let restaurantCount = 0;
    let duplicateCount = 0;

    for (const sampleRestaurant of restaurants) {
      try {
        // Check if restaurant already exists
        const existing = await Restaurante.findOne({ restaurant_id: sampleRestaurant.restaurant_id });
        
        if (!existing) {
          const restaurante = new Restaurante({
            name: sampleRestaurant.name,
            cuisine: sampleRestaurant.cuisine,
            restaurant_id: sampleRestaurant.restaurant_id,
            address: {
              building: sampleRestaurant.address?.building || 'N/A',
              street: sampleRestaurant.address?.street || 'N/A',
              zipcode: sampleRestaurant.address?.zipcode || '10001',
              borough: sampleRestaurant.address?.borough || 'Manhattan',
              coord: sampleRestaurant.address?.coord || [-73.9857, 40.7580]
            }
          });

          await restaurante.save();
          restaurantCount++;
        } else {
          duplicateCount++;
        }
      } catch (error) {
        console.error(`Error processing restaurant ${sampleRestaurant.name}:`, error.message);
      }
    }
    
    console.log(`✓ Synced ${restaurantCount} restaurants (${duplicateCount} already existed)\n`);

    // Get all restaurants from Restaurante collection for menu item creation
    console.log('🍽️  Creating menu items for restaurants...');
    const restaurantesInDB = await Restaurante.find({});
    let menuItemsCreated = 0;
    let menuItemsSkipped = 0;

    for (const restaurant of restaurantesInDB) {
      try {
        // Check if menu items already exist for this restaurant
        const existingItems = await MenuItem.countDocuments({ restauranteId: restaurant._id });
        
        if (existingItems === 0) {
          // Get cuisine type to use appropriate menu templates
          const cuisine = restaurant.cuisine || 'Default';
          const template = MENU_TEMPLATES[cuisine] || MENU_TEMPLATES['Default'];
          
          // Generate 5-10 random menu items from template
          const itemCount = faker.number.int({ min: 5, max: 10 });
          const selectedItems = faker.helpers.arrayElements(template, itemCount);
          
          // Create menu items
          for (const item of selectedItems) {
            const menuItem = new MenuItem({
              restauranteId: restaurant._id,
              nombre: item.name,
              descripcion: item.description,
              precio: item.price + (faker.number.int({ min: -2, max: 2 }) * 0.99), // Vary price slightly
              categoria: faker.helpers.arrayElement([
                'Appetizer',
                'Main Course',
                'Dessert',
                'Beverage',
                'Side Dish'
              ]),
              disponible: Math.random() > 0.05  // 95% true
            });
            
            await menuItem.save();
            menuItemsCreated++;
          }
        } else {
          menuItemsSkipped++;
        }
      } catch (error) {
        console.error(`Error creating menu items for ${restaurant.name}:`, error.message);
      }

      // Progress indicator
      if ((restaurantesInDB.indexOf(restaurant) + 1) % 100 === 0) {
        console.log(`  ⏳ Processed ${restaurantesInDB.indexOf(restaurant) + 1}/${restaurantesInDB.length} restaurants...`);
      }
    }

    console.log(`✓ Created ${menuItemsCreated} menu items (${menuItemsSkipped} restaurants already had items)\n`);

    // Create sample users
    console.log('👥 Creating sample users...');
    const existingUsers = await Usuario.countDocuments({});
    let usersCreated = 0;

    if (existingUsers === 0) {
      const sampleUsers = [
        {
          nombre: 'Alice Johnson',
          email: 'alice@example.com',
          password: 'password123',
          address: {
            building: '123',
            street: 'Madison Avenue',
            zipcode: '10016',
            borough: 'Manhattan'
          },
          telefono: '555-0001'
        },
        {
          nombre: 'Bob Smith',
          email: 'bob@example.com',
          password: 'password123',
          address: {
            building: '456',
            street: 'Broadway',
            zipcode: '10012',
            borough: 'Manhattan'
          },
          telefono: '555-0002'
        },
        {
          nombre: 'Carol Davis',
          email: 'carol@example.com',
          password: 'password123',
          address: {
            building: '789',
            street: 'Atlantic Avenue',
            zipcode: '11201',
            borough: 'Brooklyn'
          },
          telefono: '555-0003'
        },
        {
          nombre: 'David Wilson',
          email: 'david@example.com',
          password: 'password123',
          address: {
            building: '321',
            street: 'Queens Boulevard',
            zipcode: '11375',
            borough: 'Queens'
          },
          telefono: '555-0004'
        },
        {
          nombre: 'Emma Brown',
          email: 'emma@example.com',
          password: 'password123',
          address: {
            building: '654',
            street: 'Grand Concourse',
            zipcode: '10451',
            borough: 'Bronx'
          },
          telefono: '555-0005'
        }
      ];

      for (const userData of sampleUsers) {
        try {
          const existingUser = await Usuario.findOne({ email: userData.email });
          
          if (!existingUser) {
            const crypto = require('crypto');
            const usuario = new Usuario({
              nombre: userData.nombre,
              email: userData.email,
              passwordHash: crypto.createHash('sha256').update(userData.password).digest('hex'),
              address: userData.address,
              telefono: userData.telefono,
              rol: 'cliente'
            });

            await usuario.save();
            usersCreated++;
          }
        } catch (error) {
          console.error(`Error creating user ${userData.nombre}:`, error.message);
        }
      }
    }

    console.log(`✓ Created ${usersCreated} sample users\n`);

    // Create sample orders and reviews
    console.log('📦 Creating sample orders...');
    const users = await Usuario.find({});
    const restaurantsForOrders = await Restaurante.find({}).limit(50);
    let ordersCreated = 0;

    if (users.length > 0 && restaurantsForOrders.length > 0) {
      const ordersToCreate = Math.min(10, users.length * 2);

      for (let i = 0; i < ordersToCreate; i++) {
        try {
          const user = faker.helpers.arrayElement(users);
          const restaurant = faker.helpers.arrayElement(restaurantsForOrders);
          const menuItems = await MenuItem.find({ restauranteId: restaurant._id }).limit(5);

          if (menuItems.length > 0) {
            const items = [];
            const selectedItems = faker.helpers.arrayElements(menuItems, faker.number.int({ min: 1, max: 3 }));

            let total = 0;
            for (const menuItem of selectedItems) {
              const cantidad = faker.number.int({ min: 1, max: 3 });
              const subtotal = menuItem.precio * cantidad;
              total += subtotal;

              items.push({
                menuItemId: menuItem._id,
                nombre: menuItem.nombre,
                precioUnitario: menuItem.precio,
                cantidad,
                subtotal
              });
            }

            const orden = new Orden({
              usuarioId: user._id,
              restauranteId: restaurant._id,
              items,
              total,
              estado: faker.helpers.arrayElement(['ENTREGADA', 'CONFIRMADA']),
              direccionEntrega: user.address,
              comentarios: Math.random() < 0.3 ? faker.lorem.sentence() : undefined
            });

            await orden.save();
            ordersCreated++;

            // Create review for delivered orders
            if (orden.estado === 'ENTREGADA') {
              const resena = new Resena({
                usuarioId: user._id,
                restauranteId: restaurant._id,
                ordenId: orden._id,
                rating: faker.number.int({ min: 3, max: 5 }),
                comentario: faker.lorem.sentence()
              });

              await resena.save();
            }
          }
        } catch (error) {
          console.error(`Error creating order:`, error.message);
        }
      }
    }

    console.log(`✓ Created ${ordersCreated} sample orders with reviews\n`);

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Restaurants synced: ${restaurantCount}`);
    console.log(`   - Menu items created: ${menuItemsCreated}`);
    console.log(`   - Sample users created: ${usersCreated}`);
    console.log(`   - Sample orders created: ${ordersCreated}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

// Run the seeding script
seedDatabase();
