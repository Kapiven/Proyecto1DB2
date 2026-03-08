const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

const Usuario = require('./models/Usuario');
const Orden = require('./models/Orden');
const Resena = require('./models/Resena');
const Restaurante = require('./models/Restaurante');
const MenuItem = require('./models/MenuItem');

const BOROUGHS = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];

// Coherent review templates by cuisine and rating
const REVIEW_TEMPLATES = {
  Italian: {
    5: [
      'Absolutely perfect! The pasta was cooked to perfection, creamy sauce, and authentic Italian flavors. Highly recommend!',
      'Best Italian food I\'ve had in a long time. Everything tasted fresh and homemade. Will definitely order again!',
      'The carbonara was incredible - crispy guanciale, perfectly creamy, and the pasta texture was al dente. Chef knows what they\'re doing!',
      'Outstanding! Every dish was prepared with care and attention to detail. This is real Italian cuisine.',
      'Five stars all the way! The flavors were rich and authentic. Best pizza in the city!'
    ],
    4: [
      'Very good Italian restaurant. The pasta dishes are well-executed and the sauce was authentic. Minor issues with portion size.',
      'Great food overall. Loved the risotto, though it could have had more flavor.',
      'Solid Italian cooking. The presentation was nice and dishes tasted good. Service was friendly.',
      'Good quality ingredients and preparation. The tiramisu was exceptional.'
    ],
    3: [
      'Average Italian food. It was okay, nothing exceptional. Expected better flavor for the price.',
      'Decent pasta but the sauce lacked depth. Could improve seasoning.',
      'Standard Italian fare. Not bad, but nothing memorable about it.',
      'The pasta was cooked well, but the sauce needed more seasoning.'
    ],
    2: [
      'Disappointing. The pasta was overcooked and the sauce was too salty. Better options nearby.',
      'Not impressed. The dish lacked authentic Italian flavors.',
      'Below average. Food was bland and preparation seemed rushed.'
    ],
    1: [
      'Terrible experience. The food was cold and tasteless. Not worth the money.',
      'Very disappointed. This doesn\'t deserve to be called Italian food.'
    ]
  },
  American: {
    5: [
      'Amazing burger! Juicy, well-seasoned, and the toppings were fresh. Perfect comfort food!',
      'Best BBQ ribs I\'ve had in years! Tender, smoky, and the sauce was incredible.',
      'Outstanding wings! Crispy on the outside, tender inside, and perfectly sauced.',
      'The steak was cooked to perfection with a beautiful crust. Excellent cut of meat!',
      'Perfect American diner food. Everything was hot, fresh, and delicious!'
    ],
    4: [
      'Really good burger with quality beef and fresh toppings. Would order again.',
      'Great ribs - tender and flavorful. Small portion for the price, but delicious.',
      'Solid wings preparation. Could use a bit more sauce variety.',
      'Nice steak, cooked as requested. Sides were decent.'
    ],
    3: [
      'Decent burger. It was okay but nothing special.',
      'Average American food. Box was standard.',
      'The ribs were dry, could have used more sauce.'
    ],
    2: [
      'Disappointing burger - dry and overcooked. Not what I expected.',
      'Mediocre at best. Food was lukewarm when it arrived.'
    ],
    1: [
      'Terrible quality. The burger was cold and meat was tough.',
      'Complete waste of money. Food was not fresh.'
    ]
  },
  Chinese: {
    5: [
      'Authentic Chinese flavors! The fried rice was perfectly executed with great wok hei.',
      'Incredible lo mein - noodles were perfect texture and the sauce coating was ideal!',
      'The kung pao chicken was fantastic - spicy, aromatic, and perfectly balanced.',
      'Best Chinese food in the area. Fresh ingredients and expertly prepared.',
      'Wow! The dumplings were homemade fresh and the filling was delicious!'
    ],
    4: [
      'Very good Chinese food. Flavors were authentic and portions were generous.',
      'Great fried rice with good technique and balanced seasoning.',
      'Solid lo mein with fresh vegetables and good noodle texture.',
      'The sweet and sour chicken was well-prepared. Nice balance of flavors.'
    ],
    3: [
      'Decent Chinese food. Tastes good but nothing exceptional.',
      'Average fried rice - could use more seasoning and char.',
      'Standard lo mein. Okay but generic tasting.'
    ],
    2: [
      'Not impressed. The food tasted too oily and lacked flavor.',
      'Below average. MSG-heavy and not very fresh tasting.'
    ],
    1: [
      'Terrible Chinese food. Tastes nothing like authentic cuisine.',
      'Very disappointing. Food was greasy and flavorless.'
    ]
  },
  Japanese: {
    5: [
      'Sushi rolls were expertly made - fresh fish, perfect rice temperature, great presentation!',
      'The tempura was phenomenal! Crispy batter and tender, fresh ingredients.',
      'Authentic ramen with perfectly balanced broth and perfectly cooked noodles!',
      'Best sushi I\'ve had. The salmon was super fresh and the rice was perfectly seasoned.',
      'Outstanding teriyaki chicken - glazed beautifully and cooked perfectly!'
    ],
    4: [
      'Very good sushi quality. Fresh ingredients and well-prepared rolls.',
      'Nice tempura - crispy and not too greasy. Great vegetables.',
      'Good ramen with decent broth and well-cooked noodles.',
      'Quality Japanese preparation. Enjoyed the freshness of ingredients.'
    ],
    3: [
      'Okay sushi. The fish was fresh but rice could be better.',
      'Average tempura - a bit oily but still edible.',
      'Standard ramen broth, nothing special.'
    ],
    2: [
      'Not fresh enough. The sushi rolls seemed old.',
      'Tempura was too greasy and soggy in places.',
      'Mediocre ramen - thin broth without much flavor.'
    ],
    1: [
      'Very disappointing Japanese food. Fish quality was poor.',
      'Terrible experience - food was not fresh at all.'
    ]
  },
  Mexican: {
    5: [
      'Authentic Mexican tacos! Fresh ingredients, perfect salsas, and homemade tortillas!',
      'The burritos were huge and packed with flavor. Perfectly wrapped and delicious!',
      'Best enchiladas I\'ve had - tender tortillas and rich, authentic sauce!',
      'Fantastic quesadillas - crispy exterior, melted cheese, and perfect filling.',
      'Incredible fajitas! Perfectly seared vegetables and meat, amazing aroma!'
    ],
    4: [
      'Very good Mexican food. Fresh ingredients and authentic preparation.',
      'Great tacos with flavorful fillings and good salsa.',
      'Nice burritos - well-filled and good balance of flavors.',
      'Solid enchiladas with a good sauce and quality filling.'
    ],
    3: [
      'Decent Mexican food. Tastes okay but not very authentic.',
      'Standard tacos - okay but nothing special.',
      'Average burritos - could use more flavor.'
    ],
    2: [
      'Not very good Mexican food. Seemed generic and uninspired.',
      'Mediocre tacos - fillings were bland.'
    ],
    1: [
      'Terrible Mexican food. Not authentic at all.',
      'Very disappointed. Food was not fresh.'
    ]
  },
  Thai: {
    5: [
      'Perfect Pad Thai! Great balance of sweet, sour, spicy, and umami flavors!',
      'Outstanding green curry - creamy, aromatic, and perfectly spiced!',
      'The tom yum soup was incredible - complex flavors and perfect heat balance!',
      'Best Thai food in the city! Authentic recipes and fresh ingredients!',
      'Fantastic spring rolls - crispy and filled with fresh, flavorful ingredients!'
    ],
    4: [
      'Very good Pad Thai with well-balanced flavors and fresh ingredients.',
      'Great curry - aromatic and well-prepared.',
      'Good tom yum with nice broth and proper seasoning.',
      'Quality Thai cooking. Enjoyable dishes.'
    ],
    3: [
      'Okay Pad Thai. Flavors were present but could be more complex.',
      'Average curry - adequate spice level but generic.',
      'Standard tom yum - okay but not as flavorful as I hoped.'
    ],
    2: [
      'Below average Thai food. Curry lacked depth.',
      'Mediocre Pad Thai - too much oil, not enough flavor.'
    ],
    1: [
      'Terrible Thai food. Not authentic flavors.',
      'Very disappointing. Food was overcooked and bland.'
    ]
  },
  Indian: {
    5: [
      'Incredible tikka masala! Creamy sauce, tender chicken, and perfect spice balance!',
      'Outstanding butter chicken - rich sauce and perfectly cooked meat!',
      'Best biryani I\'ve tasted - fragrant rice, tender meat, aromatic spices!',
      'Authentic Indian cuisine! Every spice layer was perfectly executed!',
      'Fantastic palak paneer - creamy spinach sauce and soft paneer!'
    ],
    4: [
      'Very good tikka masala with quality chicken and rich sauce.',
      'Great butter chicken - creamy and well-spiced.',
      'Nice biryani with good flavor and texture.',
      'Good Indian cooking. Well-prepared and tasty.'
    ],
    3: [
      'Okay tikka masala. It was decent but spices could be bolder.',
      'Average butter chicken - a bit mild on spices.',
      'Standard biryani - okay but not as aromatic as expected.'
    ],
    2: [
      'Below average Indian food. Not enough spice and flavor.',
      'Mediocre tikka masala - sauce seemed watered down.'
    ],
    1: [
      'Terrible Indian food. Flavors were completely off.',
      'Very disappointing. Food was bland and overcooked.'
    ]
  },
  Korean: {
    5: [
      'Phenomenal bibimbap! Perfect rice with amazing sautéed vegetables and flavorful gochujang!',
      'Outstanding bulgogi - tender, marinated perfectly, with incredible depth of flavor!',
      'Best Korean BBQ experience! Perfectly marbled meat and excellent side dishes!',
      'Authentic Korean cuisine executed at the highest level!',
      'Fantastic tteokbokki - chewy rice cakes with spicy, addictive sauce!'
    ],
    4: [
      'Very good bibimbap with quality vegetables and nice spice level.',
      'Great bulgogi - tender and well-marinated.',
      'Nice Korean BBQ selection with fresh ingredients.',
      'Good Korean cooking. Well-prepared and flavorful.'
    ],
    3: [
      'Okay bibimbap. It was decent but nothing exceptional.',
      'Average bulgogi - texture was okay but could be more tender.',
      'Standard Korean food - okay but generic.'
    ],
    2: [
      'Below average Korean food. Flavors were weak.',
      'Mediocre bulgogi - didn\'t have complex flavors.'
    ],
    1: [
      'Terrible Korean food. Not authentic.',
      'Very disappointing experience.'
    ]
  },
  Vietnamese: {
    5: [
      'Perfect pho! Aromatic broth, tender meat, and fresh herbs - pure vietnamese magic!',
      'Outstanding banh mi! Crispy, flavorful, the perfect balance of textures and tastes!',
      'Best Vietnamese food! Fresh ingredients and authentic recipes!',
      'Incredible spring rolls - fresh, crispy, and perfectly filled!',
      'Phenomenal vermicelli bowl - fresh noodles and perfectly balanced toppings!'
    ],
    4: [
      'Very good pho with aromatic broth and quality meat.',
      'Great banh mi - crusty exterior and flavorful filling.',
      'Nice Vietnamese dishes. Fresh and well-prepared.',
      'Good quality spring rolls with fresh ingredients.'
    ],
    3: [
      'Okay pho. Broth was decent but could use more depth.',
      'Average banh mi - structure fell apart a bit.',
      'Standard Vietnamese fare - okay but not memorable.'
    ],
    2: [
      'Below average pho. Broth lacked flavor.',
      'Mediocre banh mi - bread was stale.'
    ],
    1: [
      'Terrible Vietnamese food. Not fresh.',
      'Very disappointing. Poor quality.'
    ]
  }
};

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(coord1, coord2) {
  if (!coord1 || !coord2 || !Array.isArray(coord1) || !Array.isArray(coord2)) {
    return Infinity; // Return infinity if coords are invalid
  }
  
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  
  if (lon1 === undefined || lat1 === undefined || lon2 === undefined || lat2 === undefined) {
    return Infinity;
  }
  
  const R = 6371; // Earth's radius in km

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Get nearest restaurants to user location
function getNearestRestaurants(userCoord, restaurants, limit = 10) {
  const withDistance = restaurants
    .map(r => {
      const doc = r.toObject ? r.toObject() : r; // Convert Mongoose doc to plain object
      return {
        ...doc,
        distance: calculateDistance(userCoord, doc.address?.coord || doc.addr?.coord)
      };
    })
    .filter(r => r.distance !== Infinity); // Filter out restaurants without valid coords
  
  return withDistance.sort((a, b) => a.distance - b.distance).slice(0, limit);
}

// Generate unique review comments based on cuisine and rating
function generateCoherentReview(cuisine, rating) {
  const templates = REVIEW_TEMPLATES[cuisine] || REVIEW_TEMPLATES.American;
  const ratingTemplates = templates[rating] || templates[3];
  return ratingTemplates[Math.floor(Math.random() * ratingTemplates.length)];
}

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/projectdb';
    console.log(`Connecting to MongoDB: ${mongoUri}`);
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing usuarios, ordenes, and reseñas...');
    await Promise.all([
      Usuario.deleteMany({}),
      Orden.deleteMany({}),
      Resena.deleteMany({})
    ]);

    // Fetch existing restaurants and menu items
    const restaurants = await Restaurante.find().select('_id cuisine address').limit(500);
    const menuItemsByRestaurant = {};

    console.log(`Found ${restaurants.length} restaurants`);

    for (const restaurant of restaurants) {
      const items = await MenuItem.find({ restauranteId: restaurant._id }).select('_id nombre precio');
      if (items.length > 0) {
        menuItemsByRestaurant[restaurant._id] = items;
      }
    }
    
    // Filter to only restaurants that have menu items
    const restaurantsWithItems = restaurants.filter(r => menuItemsByRestaurant[r._id] && menuItemsByRestaurant[r._id].length > 0);
    console.log(`Found ${restaurantsWithItems.length} restaurants with menu items`);

    if (restaurantsWithItems.length === 0) {
      console.error('No restaurants with menu items found. Please run the regular seed.js first to populate restaurants and menu items.');
      process.exit(1);
    }

    const NUM_USERS = 10000;
    console.log(`\nGenerating ${NUM_USERS} users with orders and reviews using bulkWrite...`);

    // Prepare bulk operations for usuarios
    const userBulkOps = [];
    const orderBulkOps = [];
    const reviewBulkOps = [];

    // Store created user IDs, coords, and registration dates for order and review generation
    const userIds = [];
    const usedEmails = new Set(); // Track used emails to prevent duplicates

    for (let i = 0; i < NUM_USERS; i++) {
      const userId = new mongoose.Types.ObjectId();
      const coord = [
        parseFloat(faker.location.longitude({ min: -74.05, max: -73.87 })),
        parseFloat(faker.location.latitude({ min: 40.57, max: 40.91 }))
      ];
      const createdAt = faker.date.past({ years: 2 });
      
      userIds.push({
        id: userId,
        coord: coord,
        createdAt: createdAt
      });

      // Generate unique email
      let email;
      let attempts = 0;
      do {
        email = faker.internet.email();
        attempts++;
      } while (usedEmails.has(email) && attempts < 10);
      usedEmails.add(email);

      // Create user document for bulk insert
      userBulkOps.push({
        insertOne: {
          document: {
            _id: userId,
            nombre: faker.person.fullName(),
            email: email,
            passwordHash: faker.string.hexadecimal({ length: 64 }),
            address: {
              building: faker.location.buildingNumber(),
              street: faker.location.street(),
              zipcode: faker.location.zipCode('####0'),
              borough: BOROUGHS[Math.floor(Math.random() * BOROUGHS.length)],
              coord: coord
            },
            telefono: faker.phone.number('+1 (###) ###-####'),
            fechaRegistro: createdAt
          }
        }
      });
    }

    // Execute user bulk writes in chunks
    const CHUNK_SIZE = 1000;
    console.log('Inserting usuarios using bulkWrite...');
    for (let i = 0; i < userBulkOps.length; i += CHUNK_SIZE) {
      const chunk = userBulkOps.slice(i, i + CHUNK_SIZE);
      const result = await Usuario.collection.bulkWrite(chunk);
      console.log(`  ✓ Inserted ${result.insertedCount} usuarios (${Math.min(i + CHUNK_SIZE, userBulkOps.length)}/${userBulkOps.length})`);
    }

    // Generate orders and reviews
    console.log('Generating ordenes and reseñas with geolocation-based restaurant selection...');
    for (let userIndex = 0; userIndex < userIds.length; userIndex++) {
      const userData = userIds[userIndex];
      const userId = userData.id;
      const userCoord = userData.coord;
      const ordersPerUser = Math.floor(Math.random() * 2) + 2; // 2-3 orders per user

      // Get nearest restaurants to user location
      const nearestRestaurants = getNearestRestaurants(userCoord, restaurantsWithItems, 10);
      
      if (nearestRestaurants.length === 0) {
        if ((userIndex + 1) % 1000 === 0) {
          console.log(`  ✓ Generated data for ${userIndex + 1}/${userIds.length} users`);
        }
        continue;
      }

      for (let orderIndex = 0; orderIndex < ordersPerUser; orderIndex++) {
        // Select from nearest restaurants (with bias towards closer ones)
        const restaurant = nearestRestaurants[Math.floor(Math.random() * Math.min(5, nearestRestaurants.length))];
        const menuItems = menuItemsByRestaurant[restaurant._id];

        if (!menuItems || menuItems.length === 0) {
          continue; // Skip if restaurant has no menu items
        }

        const orderId = new mongoose.Types.ObjectId();
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
              _id: orderId,
              usuarioId: userId,
              restauranteId: restaurant._id,
              items: orderItems,
              total: orderTotal,
              estado: orderStatus,
              fechaOrden: faker.date.between({
                from: userData.createdAt,
                to: new Date()
              }),
              horaEntrega: faker.date.future(),
              detalleEntrega: {
                direccion: faker.location.streetAddress(),
                instrucciones: Math.random() > 0.7 ? faker.lorem.sentence() : ''
              }
            }
          }
        });

        // Only generate review if order is delivered and random chance (0-1 per user approximately)
        if (orderStatus === 'ENTREGADA' && Math.random() > 0.5) {
          const rating = Math.floor(Math.random() * 5) + 1; // 1-5 stars
          const comment = generateCoherentReview(restaurant.cuisine, rating);

          reviewBulkOps.push({
            insertOne: {
              document: {
                usuarioId: userId,
                restauranteId: restaurant._id,
                ordenId: orderId,
                rating: rating,
                comentario: comment,
                fecha: faker.date.between({
                  from: userData.createdAt,
                  to: new Date()
                })
              }
            }
          });
        }
      }

      // Progress indicator
      if ((userIndex + 1) % 1000 === 0) {
        console.log(`  ✓ Generated data for ${userIndex + 1}/${userIds.length} users`);
      }
    }

    // Execute order bulk writes in chunks
    console.log(`Inserting ordenes using bulkWrite (${orderBulkOps.length} operations)...`);
    if (orderBulkOps.length > 0) {
      for (let i = 0; i < orderBulkOps.length; i += CHUNK_SIZE) {
        const chunk = orderBulkOps.slice(i, i + CHUNK_SIZE);
        const result = await Orden.collection.bulkWrite(chunk);
        console.log(`  ✓ Inserted ${result.insertedCount} ordenes (${Math.min(i + CHUNK_SIZE, orderBulkOps.length)}/${orderBulkOps.length})`);
      }
    }

    // Execute review bulk writes in chunks
    console.log(`Inserting reseñas using bulkWrite (${reviewBulkOps.length} operations)...`);
    if (reviewBulkOps.length > 0) {
      for (let i = 0; i < reviewBulkOps.length; i += CHUNK_SIZE) {
        const chunk = reviewBulkOps.slice(i, i + CHUNK_SIZE);
        const result = await Resena.collection.bulkWrite(chunk);
        console.log(`  ✓ Inserted ${result.insertedCount} reseñas (${Math.min(i + CHUNK_SIZE, reviewBulkOps.length)}/${reviewBulkOps.length})`);
      }
    }

    // Print final statistics
    const totalUsers = await Usuario.countDocuments();
    const totalOrders = await Orden.countDocuments();
    const totalReviews = await Resena.countDocuments();

    console.log('\n========== SEEDING COMPLETE ==========');
    console.log(`✓ Total Usuarios: ${totalUsers}`);
    console.log(`✓ Total Ordenes: ${totalOrders}`);
    console.log(`✓ Total Reseñas: ${totalReviews}`);
    console.log(`✓ Average orders per user: ${(totalOrders / totalUsers).toFixed(2)}`);
    console.log(`✓ Average reviews per user: ${(totalReviews / totalUsers).toFixed(2)}`);
    console.log('=====================================\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seedDatabase();
