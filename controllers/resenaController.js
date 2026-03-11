/**
 * Controller de Reseñas
 */
const mongoose = require("mongoose")

const Resena = require("../models/Resena")

exports.obtenerTodasResenas = async (req, res) => {

  try {

    const resenas = await Resena.find();

    res.json(resenas);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

/**
 * Crear reseña
 */
exports.crearResena = async (req, res) => {

  try {

    const resena = new Resena(req.body)

    const resultado = await resena.save()

    res.status(201).json(resultado)

  } catch (error) {

    res.status(400).json({ error: error.message })

  }

}


/**
 * Eliminar reseña
 */
exports.eliminarResena = async (req, res) => {

  try {

    const resultado = await Resena.deleteOne({ _id: req.params.id })

    res.json(resultado)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}


/**
 * Top restaurantes por rating
 * Uso de Aggregation Pipeline
 */
exports.topRestaurantes = async (req, res) => {

  try {

    const resultado = await Resena.aggregate([

      {
        $group: {
          _id: "$restauranteId",
          ratingPromedio: { $avg: "$rating" },
          totalResenas: { $sum: 1 }
        }
      },

      {
        $lookup: {
          from: "restaurantes",
          localField: "_id",
          foreignField: "_id",
          as: "restaurante"
        }
      },

      { $unwind: "$restaurante" },

      {
        $project: {
          restaurante: "$restaurante.name",
          ratingPromedio: 1,
          totalResenas: 1
        }
      },

      { $sort: { ratingPromedio: -1 } },

      { $limit: 10 }

    ])

    res.json(resultado)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}

/**
 * Obtener reseñas de un restaurante
 */
exports.obtenerResenasRestaurante = async (req, res) => {

  try {

    const resenas = await Resena.find({
      restauranteId: req.params.restauranteId
    })

    res.json(resenas)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}


/**
 * Obtener reseña por ID
 */
exports.obtenerResenaPorId = async (req, res) => {

  try {

    const resena = await Resena.findById(req.params.id)

    if (!resena) {
      return res.status(404).json({ error: "Reseña no encontrada" })
    }

    res.json(resena)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}

/**
 * Obtener reseñas de un usuario
 */
exports.obtenerResenasUsuario = async (req, res) => {

  try {

    const resenas = await Resena.find({
      usuarioId: req.params.usuarioId
    })

    res.json(resenas)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}


/**
 * Estadísticas de un restaurante
 * Usa aggregation pipeline
 */
exports.estadisticasRestaurante = async (req, res) => {

  try {

    const resultado = await Resena.aggregate([

      {
        $match: {
          restauranteId: new mongoose.Types.ObjectId(req.params.restauranteId)
        }
      },

      {
        $group: {
          _id: "$restauranteId",
          promedioRating: { $avg: "$rating" },
          totalResenas: { $sum: 1 },
          maxRating: { $max: "$rating" },
          minRating: { $min: "$rating" }
        }
      }

    ])

    res.json(resultado[0] || { mensaje: "No hay reseñas para este restaurante" })

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}


/**
 * Actualizar reseña
 */
exports.actualizarResena = async (req, res) => {

  try {

    const resultado = await Resena.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    )

    res.json(resultado)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}