/**
 * Rutas de Reseñas
 */

const express = require('express');
const router = express.Router();

const resenaController = require('../controllers/resenaController');

/**
 * Obtener todas las reseñas
 */
router.get('/', resenaController.obtenerTodasResenas);

/**
 * Crear reseña
 */
router.post('/', resenaController.crearResena);


/**
 * Obtener reseñas de restaurante
 */
router.get('/restaurante/:restauranteId', resenaController.obtenerResenasRestaurante);


/**
 * Obtener reseñas de usuario
 */
router.get('/usuario/:usuarioId', resenaController.obtenerResenasUsuario);


/**
 * Estadísticas del restaurante (aggregation)
 */
router.get('/restaurante/:restauranteId/estadisticas', resenaController.estadisticasRestaurante);


/**
 * Obtener reseña por ID
 */
router.get('/:id', resenaController.obtenerResenaPorId);


/**
 * Actualizar reseña
 */
router.put('/:id', resenaController.actualizarResena);


/**
 * Eliminar reseña
 */
router.delete('/:id', resenaController.eliminarResena);


/**
 * Top restaurantes (aggregation)
 */
router.get('/top/restaurantes', resenaController.topRestaurantes);


module.exports = router;