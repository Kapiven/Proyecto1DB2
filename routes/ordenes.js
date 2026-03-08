const express = require('express');
const router = express.Router();
const ordenController = require('../controllers/ordenController');

// Crear orden
router.post('/', ordenController.crearOrden);

// Obtener órdenes de usuario
router.get('/usuario/:usuarioId', ordenController.obtenerOrdenesUsuario);

// Obtener órdenes de restaurante
router.get('/restaurante/:restauranteId', ordenController.obtenerOrdenesRestaurante);

// Obtener por ID
router.get('/:id', ordenController.obtenerOrdenPorId);

// Obtener órdenes por estado
router.get('/estado/:estado', ordenController.obtenerOrdenesPorEstado);

// Actualizar estado
router.patch('/:id/estado', ordenController.actualizarEstadoOrden);

// Cancelar orden
router.patch('/:id/cancelar', ordenController.cancelarOrden);

module.exports = router;
