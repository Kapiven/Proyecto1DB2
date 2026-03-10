/**
 * Rutas de Restaurantes
 */

const express = require('express')
const router = express.Router()

const restauranteController = require('../controllers/restauranteController')

/**
 * Crear restaurante
 */
router.post('/', restauranteController.crearRestaurante)

/**
 * Contar restaurantes
 */
router.get('/count', restauranteController.contarRestaurantes)

/**
 * Obtener todos los restaurantes
 */
router.get('/', restauranteController.obtenerRestaurantes)

/**
 * Buscar restaurantes por borough
 */
router.get('/borough/:borough', restauranteController.restaurantesPorBorough)

/**
 * Buscar por tipo de cocina
 */
router.get('/cuisine/:cuisine', restauranteController.restaurantesPorCuisine)

/**
 * Búsqueda geoespacial
 */
router.post('/buscar/cercanos', restauranteController.restaurantesCercanos)

/**
 * Obtener restaurante por ID
 */
router.get('/:id', restauranteController.obtenerRestaurantePorId)

/**
 * Actualizar restaurante
 */
router.put('/:id', restauranteController.actualizarRestaurante)

/**
 * Actualizar rating
 */
router.put('/:id/rating', restauranteController.actualizarRating)

/**
 * Eliminar restaurante
 */
router.delete('/:id', restauranteController.eliminarRestaurante)

module.exports = router