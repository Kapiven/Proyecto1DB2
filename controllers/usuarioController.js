/**
 * Controller de Usuarios
 * Maneja todas las operaciones CRUD sobre la colección Usuarios
 */

const Usuario = require("../models/Usuario")

/**
 * Crear un usuario
 * Equivale a insertOne en MongoDB
 */
exports.crearUsuario = async (req, res) => {

  try {

    const usuario = new Usuario(req.body)

    const resultado = await usuario.save()

    res.status(201).json(resultado)

  } catch (error) {

    res.status(400).json({ error: error.message })

  }

}


/**
 * Obtener todos los usuarios
 * Uso de find()
 */
exports.obtenerUsuarios = async (req, res) => {

  try {

    const usuarios = await Usuario
      .find()
      .select("-passwordHash") // no mostrar contraseña

    res.json(usuarios)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}


/**
 * Obtener un usuario por ID
 * Uso de findById()
 */
exports.obtenerUsuarioPorId = async (req, res) => {

  try {

    const usuario = await Usuario.findById(req.params.id)

    if (!usuario) {

      return res.status(404).json({ error: "Usuario no encontrado" })

    }

    res.json(usuario)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}


/**
 * Actualizar usuario
 * Uso de updateOne()
 */
exports.actualizarUsuario = async (req, res) => {

  try {

    const resultado = await Usuario.updateOne(

      { _id: req.params.id },
      { $set: req.body }

    )

    res.json(resultado)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}


/**
 * Eliminar usuario
 * Uso de deleteOne()
 */
exports.eliminarUsuario = async (req, res) => {

  try {

    const resultado = await Usuario.deleteOne({ _id: req.params.id })

    res.json(resultado)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}


/**
 * Obtener los usuarios que más han gastado
 * Uso de sort + limit
 */
exports.topUsuarios = async (req, res) => {

  try {

    const usuarios = await Usuario
      .find()
      .sort({ totalGastado: -1 })
      .limit(5)

    res.json(usuarios)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}

/**
 * Obtener usuario por email
 */
exports.obtenerUsuarioPorEmail = async (req, res) => {

  try {

    const usuario = await Usuario.findOne({
      email: req.params.email
    })

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    res.json(usuario)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}

/**
 * Login de usuario
 */
exports.loginUsuario = async (req, res) => {

  try {

    const { email } = req.body

    const usuario = await Usuario.findOne({ email })

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    res.json(usuario)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}


/**
 * Obtener usuarios por borough
 */
exports.obtenerUsuariosPorBorough = async (req, res) => {

  try {

    const usuarios = await Usuario.find({
      borough: req.params.borough
    })

    res.json(usuarios)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}