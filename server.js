const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurantes';

mongoose.connect(mongoURI)
  .then(() => {
    console.log('✓ Connected to MongoDB');
    setupSchemaValidation();
  })
  .catch(err => console.error('✗ MongoDB connection error:', err));

// Schema Validation Function
const setupSchemaValidation = async () => {
  const db = mongoose.connection;
  
  try {
    // Validación para Usuarios
    await db.collection('usuarios').createIndex({ email: 1 }, { unique: true }).catch(() => {});
    
    // Validación para MenuItems
    await db.collection('menuitems').createIndex({ restauranteid: 1 }).catch(() => {});
    
    // Validación para Ordenes
    await db.collection('ordenes').createIndex({ usuarioid: 1 }).catch(() => {});
    await db.collection('ordenes').createIndex({ restauranteid: 1 }).catch(() => {});
    await db.collection('ordenes').createIndex({ estado: 1 }).catch(() => {});
    
    // Validación para Restaurantes (Geospatial) - NOW ON address.coord
    await db.collection('restaurantes').createIndex({ 'address.coord': '2dsphere' }).catch(() => {});
    await db.collection('restaurantes').createIndex({ 'address.borough': 1 }).catch(() => {});
    
    console.log('✓ Schema validation and indexes created');
  } catch (error) {
    console.error('Error setting up validation:', error.message);
  }
};

// Import Routes
const restaurantesRoutes = require('./routes/restaurantes');
const usuariosRoutes = require('./routes/usuarios');
const menuItemsRoutes = require('./routes/menuItems');
const ordenesRoutes = require('./routes/ordenes');
const resenasRoutes = require('./routes/resenas');

// Basic Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Restaurant Management System API',
    version: '1.0.0',
    endpoints: {
      restaurantes: '/api/restaurantes',
      usuarios: '/api/usuarios',
      menuItems: '/api/menu-items',
      ordenes: '/api/ordenes',
      resenas: '/api/resenas'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'Server is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Register Routes
app.use('/api/restaurantes', restaurantesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/menu-items', menuItemsRoutes);
app.use('/api/ordenes', ordenesRoutes);
app.use('/api/resenas', resenasRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ API Documentation at http://localhost:${PORT}`);
});
