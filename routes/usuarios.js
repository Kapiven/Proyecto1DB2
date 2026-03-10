/**
 * Rutas de Usuarios
 */

const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuarioController');


/**
 * Registrar usuario
 */
router.post('/registro', usuarioController.crearUsuario);


/**
 * Login usuario
 */
router.post('/login', usuarioController.loginUsuario);


/**
 * Obtener todos los usuarios
 */
router.get('/', usuarioController.obtenerUsuarios);


/**
 * Obtener usuarios por borough
 */
router.get('/borough/:borough', usuarioController.obtenerUsuariosPorBorough);


/**
 * Obtener usuario por ID
 */
router.get('/:id', usuarioController.obtenerUsuarioPorId);


/**
 * Actualizar usuario
 */
router.put('/:id', usuarioController.actualizarUsuario);


/**
 * Eliminar usuario
 */
router.delete('/:id', usuarioController.eliminarUsuario);


/**
 * Top usuarios (sort + limit)
 */
router.get('/top/gasto', usuarioController.topUsuarios);


module.exports = router;