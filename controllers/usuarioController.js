const Usuario = require('../models/Usuario');
const crypto = require('crypto');

// Función para hashear contraseñas (simple, en producción usar bcrypt)
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Registrar usuario
exports.registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password, address, telefono } = req.body;

    // Verificar si el email ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      passwordHash: hashPassword(password),
      address: {
        building: address.building,
        street: address.street,
        zipcode: address.zipcode,
        borough: address.borough,
        coord: address.coord
      },
      telefono
    });

    const usuario = await nuevoUsuario.save();
    const usuarioSinPassword = usuario.toObject();
    delete usuarioSinPassword.passwordHash;
    
    res.status(201).json(usuarioSinPassword);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-passwordHash');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-passwordHash');
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
  try {
    const actualizacion = { ...req.body };
    
    // No permitir cambio de email desde este endpoint
    delete actualizacion.email;
    delete actualizacion.passwordHash;

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      actualizacion,
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener usuarios por borough
exports.obtenerUsuariosPorBorough = async (req, res) => {
  try {
    const { borough } = req.params;
    const usuarios = await Usuario.find({ 'address.borough': borough }).select('-passwordHash');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login usuario
exports.loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (usuario.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuarioSinPassword = usuario.toObject();
    delete usuarioSinPassword.passwordHash;

    res.json({ mensaje: 'Login exitoso', usuario: usuarioSinPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
