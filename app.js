/**
 * app.js
 * Configuración principal de Express
 */

const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Importar rutas
 */
const restaurantesRoutes = require('./routes/restaurantes');
const usuariosRoutes = require('./routes/usuarios');
const menuItemsRoutes = require('./routes/menuItems');
const ordenesRoutes = require('./routes/ordenes');
const resenasRoutes = require('./routes/resenas');


/**
 * Ruta principal
 */
app.get('/', (req, res) => {

  res.json({
    message: 'Restaurant Management System API',
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


/**
 * Health check
 */
app.get('/health', (req, res) => {

  res.json({
    status: 'Server running'
  });

});


/**
 * Registrar rutas
 */

app.use('/api/restaurantes', restaurantesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/menu-items', menuItemsRoutes);
app.use('/api/ordenes', ordenesRoutes);
app.use('/api/resenas', resenasRoutes);


/**
 * Error handler
 */

app.use((err, req, res, next) => {

  console.error(err.stack);

  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });

});


/**
 * 404 handler
 */

app.use((req, res) => {

  res.status(404).json({
    error: 'Endpoint not found'
  });

});


module.exports = app;