/**
 * Controller de Restaurantes
 */

const Restaurante = require("../models/Restaurante")


/**
 * Crear restaurante
 */
exports.crearRestaurante = async (req, res) => {
  try {

    const restaurante = new Restaurante(req.body)
    const resultado = await restaurante.save()

    res.status(201).json(resultado)

  } catch (error) {

    res.status(400).json({ error: error.message })

  }
}


/**
 * Obtener todos los restaurantes
 */
exports.obtenerRestaurantes = async (req, res) => {

  try {
    const restaurantes = await Restaurante.find()
    res.json(restaurantes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


/**
 * Buscar restaurantes por borough
 */
exports.restaurantesPorBorough = async (req, res) => {

  try {

    const restaurantes = await Restaurante.find({
      "address.borough": req.params.borough
    })

    res.json(restaurantes)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}


/**
 * Buscar restaurantes por tipo de cocina
 */
exports.restaurantesPorCuisine = async (req, res) => {

  try {

    const restaurantes = await Restaurante.find({
      cuisine: req.params.cuisine
    })

    res.json(restaurantes)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}


/**
 * Buscar restaurantes cercanos
 */
exports.restaurantesCercanos = async (req, res) => {

  try {

    const { lat, lng } = req.query

    const restaurantes = await Restaurante.find({

      "address.coord": {

        $near: {

          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },

          $maxDistance: 5000

        }

      }

    })

    res.json(restaurantes)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}


/**
 * Obtener restaurante por ID
 */
exports.obtenerRestaurantePorId = async (req, res) => {

  try {

    const restaurante = await Restaurante.findById(req.params.id)

    if (!restaurante) {
      return res.status(404).json({ error: "Restaurante no encontrado" })
    }

    res.json(restaurante)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}


/**
 * Actualizar restaurante
 */
exports.actualizarRestaurante = async (req, res) => {

  try {

    const restaurante = await Restaurante.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(restaurante)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}


/**
 * Actualizar rating
 */
exports.actualizarRating = async (req, res) => {

  try {

    const restaurante = await Restaurante.findByIdAndUpdate(
      req.params.id,
      { rating: req.body.rating },
      { new: true }
    )

    res.json(restaurante)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}


/**
 * Eliminar restaurante
 */
exports.eliminarRestaurante = async (req, res) => {

  try {

    const resultado = await Restaurante.deleteOne({ _id: req.params.id })

    res.json(resultado)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}