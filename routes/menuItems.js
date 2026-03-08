const express = require('express');
const router = express.Router();
const menuItemController = require('../controllers/menuItemController');

// Crear item
router.post('/', menuItemController.crearMenuItem);

// Obtener menú de restaurante
router.get('/restaurante/:restauranteId', menuItemController.obtenerMenuRestaurante);

// Obtener por ID
router.get('/:id', menuItemController.obtenerMenuItemPorId);

// Actualizar
router.put('/:id', menuItemController.actualizarMenuItem);

// Cambiar disponibilidad
router.patch('/:id/disponibilidad', menuItemController.cambiarDisponibilidad);

// Eliminar
router.delete('/:id', menuItemController.eliminarMenuItem);

module.exports = router;
