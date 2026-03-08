const express = require('express');
const router = express.Router();
const resenaController = require('../controllers/resenaController');

// Crear reseña
router.post('/', resenaController.crearResena);

// Obtener reseñas de restaurante
router.get('/restaurante/:restauranteId', resenaController.obtenerResenasRestaurante);

// Obtener reseñas de usuario
router.get('/usuario/:usuarioId', resenaController.obtenerResenasUsuario);

// Obtener por ID
router.get('/:id', resenaController.obtenerResenaPorId);

// Estadísticas del restaurante
router.get('/restaurante/:restauranteId/estadisticas', resenaController.estadisticasRestaurante);

// Actualizar reseña
router.put('/:id', resenaController.actualizarResena);

// Eliminar reseña
router.delete('/:id', resenaController.eliminarResena);

module.exports = router;
