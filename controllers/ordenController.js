/**
 * Controller de Órdenes
 */

const Orden = require("../models/Orden")
const Usuario = require("../models/Usuario")
const MenuItem = require("../models/MenuItem")
const mongoose = require("mongoose")

/**
 * Crear una orden
 * Implementa TRANSACCIÓN
 */
exports.crearOrden = async (req, res) => {

  const session = await mongoose.startSession()

  try {

    session.startTransaction()

    const { usuarioId, restauranteId, items, direccionEntrega } = req.body

    const usuario = await Usuario.findById(usuarioId).session(session)

    if (!usuario) {

      throw new Error("Usuario no encontrado")

    }

    let total = 0
    const itemsOrden = []

    for (const item of items) {

      const menuItem = await MenuItem.findById(item.menuItemId).session(session)
      if (!menuItem) {

        throw new Error(`Item de menú no encontrado: ${item.menuItemId}`)

      }
      
      const subtotal = menuItem.precio * item.cantidad

      total += subtotal

      itemsOrden.push({

        menuItemId: menuItem._id,
        nombre: menuItem.nombre,
        precioUnitario: menuItem.precio,
        cantidad: item.cantidad,
        subtotal: subtotal

      })

    }

    const nuevaOrden = new Orden({

      usuarioId,
      restauranteId,
      items: itemsOrden,
      total,
      direccionEntrega

    })

    const orden = await nuevaOrden.save({ session })

    usuario.totalGastado += total

    await usuario.save({ session })

    await session.commitTransaction()

    res.status(201).json(orden)

  } catch (error) {

    await session.abortTransaction()

    res.status(500).json({ error: error.message })

  } finally {

    session.endSession()

  }

}


/**
 * Obtener órdenes de un usuario
 * Uso de sort y limit
 */
exports.obtenerOrdenesUsuario = async (req, res) => {

  try {

    const ordenes = await Orden
      .find({ usuarioId: req.params.usuarioId })
      .sort({ fecha: -1 })
      .limit(10)

    res.json(ordenes)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}


/**
 * Eliminar órdenes canceladas
 * Uso de deleteMany
 */
exports.eliminarOrdenesCanceladas = async (req, res) => {

  try {

    const resultado = await Orden.deleteMany({

      estado: { $regex: "^cancelada$", $options: "i" }

    })

    res.json(resultado)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}

/**
 * Obtener todas las órdenes
 */
exports.obtenerOrdenes = async (req, res) => {

  try {
    const ordenes = await Orden.find()
    res.json(ordenes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


/**
 * Obtener orden por ID
 */
exports.obtenerOrdenPorId = async (req, res) => {

  try {

    const orden = await Orden.findById(req.params.id)

    if (!orden) {
      return res.status(404).json({ error: "Orden no encontrada" })
    }

    res.json(orden)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}


/**
 * Actualizar estado de orden
 */
exports.actualizarEstadoOrden = async (req, res) => {

  try {

    const resultado = await Orden.updateOne(
      { _id: req.params.id },
      { $set: { estado: req.body.estado } }
    )

    res.json(resultado)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}

/**
 * Obtener órdenes de un restaurante
 */
exports.obtenerOrdenesRestaurante = async (req, res) => {

  try {

    const ordenes = await Orden.find({
      restauranteId: req.params.restauranteId
    }).sort({ fecha: -1 })

    res.json(ordenes)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}


/**
 * Obtener órdenes por estado
 */
exports.obtenerOrdenesPorEstado = async (req, res) => {

  try {

    const ordenes = await Orden.find({
      estado: req.params.estado
    })

    res.json(ordenes)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}


/**
 * Cancelar orden
 */
exports.cancelarOrden = async (req, res) => {

  try {

    const resultado = await Orden.updateOne(
      { _id: req.params.id },
      { $set: { estado: "CANCELADA" } }
    )

    res.json(resultado)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}

/**
 * Top platillos vendidos
 * Uso de Aggregation Pipeline
 */
exports.topPlatillosVendidos = async (req, res) => {

  try {

    const resultado = await Orden.aggregate([

      { $match: { estado: "ENTREGADA" } },

      { $unwind: "$items" },

      {
        $group: {
          _id: "$items.menuItemId",
          totalVendidos: { $sum: "$items.cantidad" },
          totalIngresos: { $sum: "$items.subtotal" }
        }
      },

      {
        $lookup: {
          from: "menuitems",
          localField: "_id",
          foreignField: "_id",
          as: "menuItem"
        }
      },

      { $unwind: "$menuItem" },

      {
        $project: {
          nombre: "$menuItem.nombre",
          totalVendidos: 1,
          totalIngresos: 1
        }
      },

      { $sort: { totalVendidos: -1 } },

      { $limit: 10 }

    ])

    res.json(resultado)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}

/**
 * Ventas mensuales
 */

exports.ventasMensuales = async (req, res) => {

  try {

    const resultado = await Orden.aggregate([

      { $match: { estado: "ENTREGADA" } },

      {
        $group: {

          _id: {
            $dateTrunc: {
              date: "$fechaOrden",
              unit: "month"
            }
          },

          ventasTotales: { $sum: "$total" },
          totalOrdenes: { $sum: 1 },
          ticketPromedio: { $avg: "$total" }

        }

      },

      {
        $project: {
          mes: "$_id",
          ventasTotales: 1,
          totalOrdenes: 1,
          ticketPromedio: { $round: ["$ticketPromedio", 2] }
        }
      },

      { $sort: { mes: 1 } }

    ])

    res.json(resultado)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}