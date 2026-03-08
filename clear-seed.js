const mongoose = require('mongoose');
require('dotenv').config();

const Usuario = require('./models/Usuario');
const Orden = require('./models/Orden');
const Resena = require('./models/Resena');

async function clearSeedData() {
  try {
    console.log(' Starting data cleanup...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Confirm deletion
    console.log('  This will delete:');
    console.log('   - All usuarios (users)');
    console.log('   - All ordenes (orders)');
    console.log('   - All reseñas (reviews)\n');
    console.log('  This will NOT delete:');
    console.log('   - Restaurantes (restaurants)');
    console.log('   - MenuItems (menu items)\n');

    // Clear collections
    console.log('Clearing collections...');
    
    const resenaCount = await Resena.deleteMany({});
    console.log(`   Deleted ${resenaCount.deletedCount} reviews`);

    const ordenCount = await Orden.deleteMany({});
    console.log(`   Deleted ${ordenCount.deletedCount} orders`);

    const usuarioCount = await Usuario.deleteMany({});
    console.log(`   Deleted ${usuarioCount.deletedCount} users`);

    console.log('\nData cleanup completed!');
    console.log('Restaurants and menu items are still intact.\n');
    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

clearSeedData();
