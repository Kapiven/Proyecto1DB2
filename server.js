/**
 * server.js
 * Punto de inicio del servidor
 */

const mongoose = require('mongoose');
require('dotenv').config();

const app = require('./app');

/**
 * MongoDB Connection
 */

const mongoURI =
  process.env.MONGODB_URI ||
  'mongodb://localhost:27017/restaurantes';

mongoose.connect(mongoURI)
  .then(() => {

    console.log('✓ Connected to MongoDB');

    setupSchemaValidation();

  })
  .catch(err =>
    console.error('✗ MongoDB connection error:', err)
  );


/**
 * Crear índices en la base de datos
 */

const setupSchemaValidation = async () => {

  const db = mongoose.connection;

  try {

    await db.collection('usuarios')
      .createIndex({ email: 1 }, { unique: true })
      .catch(() => {});


    await db.collection('menuitems')
      .createIndex({ restauranteId: 1 })
      .catch(() => {});


    await db.collection('ordenes')
      .createIndex({ usuarioId: 1 })
      .catch(() => {});


    await db.collection('ordenes')
      .createIndex({ restauranteId: 1 })
      .catch(() => {});


    await db.collection('ordenes')
      .createIndex({ estado: 1 })
      .catch(() => {});


    await db.collection('restaurantes')
      .createIndex({ 'address.coord': '2dsphere' })
      .catch(() => {});


    await db.collection('restaurantes')
      .createIndex({ 'address.borough': 1 })
      .catch(() => {});


    console.log('✓ Database indexes created');

  }

  catch (error) {

    console.error('Index creation error:', error.message);

  }

};


/**
 * Start Server
 */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`✓ Server running at http://localhost:${PORT}`);
  console.log(`✓ API ready`);

});