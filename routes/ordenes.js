/**
 * Rutas de Órdenes
 * Permite gestionar pedidos de usuarios
 */

const express = require('express');
const router = express.Router();

const ordenController = require('../controllers/ordenController');

/**
 * Obtener todas las órdenes
 */
router.get('/', ordenController.obtenerOrdenes);

/**
 * Crear orden
 * (usa transacción)
 */
router.post('/', ordenController.crearOrden);


/**
 * Obtener órdenes de usuario
 */
router.get('/usuario/:usuarioId', ordenController.obtenerOrdenesUsuario);


/**
 * Obtener órdenes de restaurante
 */
router.get('/restaurante/:restauranteId', ordenController.obtenerOrdenesRestaurante);


/**
 * Obtener órdenes por estado
 */
router.get('/estado/:estado', ordenController.obtenerOrdenesPorEstado);


/**
 * Obtener orden por ID
 */
router.get('/:id', ordenController.obtenerOrdenPorId);


/**
 * Actualizar estado de orden
 */
router.patch('/:id/estado', ordenController.actualizarEstadoOrden);


/**
 * Cancelar orden
 */
router.patch('/:id/cancelar', ordenController.cancelarOrden);


/**
 * Eliminar órdenes canceladas (deleteMany)
 */
router.delete('/canceladas/eliminar', ordenController.eliminarOrdenesCanceladas);


module.exports = router;