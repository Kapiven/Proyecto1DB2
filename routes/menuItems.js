/**
 * Rutas de Menu Items
 * Permite gestionar los platos del menú de los restaurantes
 */

const express = require('express');
const router = express.Router();

const menuItemController = require('../controllers/menuItemController');


/**
 * Crear item de menú
 * POST /menu-items
 */
router.post('/', menuItemController.crearMenuItem);


/**
 * Obtener todos los items de menú
 * GET /menu-items
 */
router.get('/', menuItemController.obtenerMenu);


/**
 * Obtener menú de un restaurante
 * GET /menu-items/restaurante/:restauranteId
 */
router.get('/restaurante/:restauranteId', menuItemController.obtenerMenuRestaurante);


/**
 * Obtener un item por ID
 * GET /menu-items/:id
 */
router.get('/:id', menuItemController.obtenerMenuItemPorId);


/**
 * Actualizar item
 * PUT /menu-items/:id
 */
router.put('/:id', menuItemController.actualizarMenuItem);


/**
 * Cambiar disponibilidad
 * PATCH /menu-items/:id/disponibilidad
 */
router.patch('/:id/disponibilidad', menuItemController.cambiarDisponibilidad);


/**
 * Actualizar precios por categoría (updateMany)
 * PATCH /menu-items/categoria/precio
 */
router.patch('/categoria/precio', menuItemController.actualizarPrecioCategoria);


/**
 * Eliminar item
 * DELETE /menu-items/:id
 */
router.delete('/:id', menuItemController.eliminarMenuItem);


module.exports = router;