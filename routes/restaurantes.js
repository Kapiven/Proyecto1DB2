const express = require('express');
const router = express.Router();
const restauranteController = require('../controllers/restauranteController');

// Crear restaurante
router.post('/', restauranteController.crearRestaurante);

// Obtener todos
router.get('/', restauranteController.obtenerRestaurantes);

// Búsqueda por borough
router.get('/borough/:borough', restauranteController.restaurantesPorBorough);

// Búsqueda por cuisine
router.get('/cuisine/:cuisine', restauranteController.restaurantesPorCuisine);

// Obtener por ID
router.get('/:id', restauranteController.obtenerRestaurantePorId);

// Actualizar
router.put('/:id', restauranteController.actualizarRestaurante);

// Eliminar
router.delete('/:id', restauranteController.eliminarRestaurante);

// Búsqueda geoespacial
router.post('/buscar/cercanos', restauranteController.restaurantesCercanos);

// Actualizar rating
router.put('/:id/rating', restauranteController.actualizarRating);

module.exports = router;
