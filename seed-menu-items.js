const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

const MenuItem = require('./models/MenuItem');
const Restaurante = require('./models/Restaurante');

// Menu item templates by cuisine type with realistic items
const MENU_TEMPLATES = {
  'Irish': [
    { name: 'Irish Stew', description: 'Traditional lamb and potato stew', price: 14.99 },
    { name: 'Fish and Chips', description: 'Battered cod with golden fries', price: 13.99 },
    { name: 'Colcannon', description: 'Mashed potatoes with cabbage and bacon', price: 11.99 },
    { name: 'Boxty', description: 'Potato pancakes with fillings', price: 12.99 },
    { name: 'Soda Bread', description: 'Traditional Irish brown bread', price: 5.99 },
    { name: 'Bangers and Mash', description: 'Irish sausages with mashed potatoes', price: 12.99 },
    { name: 'Shepherd\'s Pie', description: 'Ground meat with potato topping', price: 13.99 },
    { name: 'Black Pudding', description: 'Traditional blood sausage', price: 8.99 }
  ],
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

// Get menu items for a specific cuisine
function getMenuItemsForCuisine(cuisine) {
  // Try exact match first
  if (MENU_TEMPLATES[cuisine]) {
    return MENU_TEMPLATES[cuisine];
  }

  // Try partial matches for complex cuisine names
  for (const key of Object.keys(MENU_TEMPLATES)) {
    if (cuisine && cuisine.toLowerCase().includes(key.toLowerCase())) {
      return MENU_TEMPLATES[key];
    }
  }

  // Try reverse match
  for (const key of Object.keys(MENU_TEMPLATES)) {
    if (key.toLowerCase().includes(cuisine?.toLowerCase() || '')) {
      return MENU_TEMPLATES[key];
    }
  }

  // Default fallback
  return MENU_TEMPLATES['Default'];
}

// Generate random menu item with slight variations
function generateMenuItem(baseItem, restauranteId) {
  const variations = ['', ' Supreme', ' Deluxe', ' Special', ' Classic', ' Premium'];
  const variation = variations[Math.floor(Math.random() * variations.length)];

  return {
    restauranteId: restauranteId,
    nombre: baseItem.name + (Math.random() > 0.7 ? variation : ''),
    descripcion: baseItem.description,
    precio: parseFloat((baseItem.price * (0.85 + Math.random() * 0.35)).toFixed(2)), // Vary price by ±15%
    categoria: faker.word.words(1)[0].charAt(0).toUpperCase() + faker.word.words(1)[0].slice(1),
    disponible: Math.random() > 0.1, // 90% available
    fechaCreacion: faker.date.past({ years: 1 })
  };
}

async function seedMenuItems() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/projectdb';
    console.log(`Connecting to MongoDB: ${mongoUri}`);
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB\n');

    // Fetch all restaurants
    console.log('📦 Fetching all restaurants...');
    const restaurants = await Restaurante.find().select('_id cuisine').lean();
    console.log(`✓ Found ${restaurants.length} restaurants\n`);

    if (restaurants.length === 0) {
      console.error('No restaurants found!');
      process.exit(1);
    }

    const CHUNK_SIZE = 1000;
    let totalMenuItems = 0;

    // Process restaurants in chunks
    const RESTAURANT_CHUNK_SIZE = 100; // Process 100 restaurants at a time to avoid memory issues
    
    for (let rChunk = 0; rChunk < restaurants.length; rChunk += RESTAURANT_CHUNK_SIZE) {
      const restaurantChunk = restaurants.slice(rChunk, rChunk + RESTAURANT_CHUNK_SIZE);
      const bulkOps = [];

      // Generate menu items for each restaurant in this chunk
      for (const restaurant of restaurantChunk) {
        const cuisine = restaurant.cuisine || 'Default';
        const menuTemplate = getMenuItemsForCuisine(cuisine);
        
        // Generate 5-8 menu items per restaurant
        const itemsCount = Math.floor(Math.random() * 4) + 5; // 5-8 items

        for (let i = 0; i < itemsCount; i++) {
          // Randomly select a base item from the template
          const baseItem = menuTemplate[Math.floor(Math.random() * menuTemplate.length)];
          const menuItem = generateMenuItem(baseItem, restaurant._id);

          bulkOps.push({
            insertOne: {
              document: menuItem
            }
          });
        }
      }

      // Insert bulk operations for this chunk
      if (bulkOps.length > 0) {
        console.log(`Processing restaurants ${rChunk + 1} to ${Math.min(rChunk + RESTAURANT_CHUNK_SIZE, restaurants.length)}...`);
        
        for (let i = 0; i < bulkOps.length; i += CHUNK_SIZE) {
          const chunk = bulkOps.slice(i, i + CHUNK_SIZE);
          const result = await MenuItem.collection.bulkWrite(chunk);
          totalMenuItems += result.insertedCount;
          console.log(`  ✓ Inserted ${result.insertedCount} menu items (${totalMenuItems} total)`);
        }
      }
    }

    // Verify results
    const finalCount = await MenuItem.countDocuments();
    const restaurantCounts = await MenuItem.collection.aggregate([
      { $group: { _id: '$restauranteId', count: { $sum: 1 } } },
      { $group: { _id: null, total: { $sum: '$count' }, avg: { $avg: '$count' }, min: { $min: '$count' }, max: { $max: '$count' } } }
    ]).toArray();

    console.log('\n========== SEEDING COMPLETE ==========');
    console.log(`✓ Total Menu Items Created: ${finalCount}`);
    if (restaurantCounts.length > 0) {
      const stats = restaurantCounts[0];
      console.log(`✓ Average Items per Restaurant: ${stats.avg.toFixed(2)}`);
      console.log(`✓ Min Items in a Restaurant: ${stats.min}`);
      console.log(`✓ Max Items in a Restaurant: ${stats.max}`);
    }
    console.log(`✓ Total Restaurants: ${restaurants.length}`);
    console.log('=====================================\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seedMenuItems();
