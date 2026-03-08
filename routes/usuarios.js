const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Registrar usuario
router.post('/registro', usuarioController.registrarUsuario);

// Login
router.post('/login', usuarioController.loginUsuario);

// Obtener todos (admin)
router.get('/', usuarioController.obtenerUsuarios);

// Obtener usuarios por borough
router.get('/borough/:borough', usuarioController.obtenerUsuariosPorBorough);

// Obtener por ID
router.get('/:id', usuarioController.obtenerUsuarioPorId);

// Actualizar
router.put('/:id', usuarioController.actualizarUsuario);

// Eliminar
router.delete('/:id', usuarioController.eliminarUsuario);

module.exports = router;
