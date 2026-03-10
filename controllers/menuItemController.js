/**
 * Controller de Menú
 */

const MenuItem = require("../models/MenuItem")


/**
 * Crear item de menú
 */
exports.crearMenuItem = async (req, res) => {

  try {

    const item = new MenuItem(req.body)

    const resultado = await item.save()

    res.status(201).json(resultado)

  } catch (error) {

    res.status(400).json({ error: error.message })

  }

}


/**
 * Obtener menú completo
 */
exports.obtenerMenu = async (req, res) => {

  try {

    const menu = await MenuItem.find()

    res.json(menu)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}


/**
 * Actualizar un item del menú
 */
exports.actualizarMenuItem = async (req, res) => {

  try {

    const resultado = await MenuItem.updateOne(

      { _id: req.params.id },
      { $set: req.body }

    )

    res.json(resultado)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}


/**
 * Actualizar múltiples items por categoría
 * Uso de updateMany
 */
exports.actualizarPreciosPorCategoria = async (req, res) => {

  try {

    const { categoria, incremento } = req.body

    const incrementoNum = Number(incremento)

    if (isNaN(incrementoNum)) {
      return res.status(400).json({
        error: "Incremento debe ser un número"
      })
    }

    const factor = 1 + incrementoNum / 100

    const resultado = await MenuItem.updateMany(
      { categoria },
      { $mul: { precio: factor } }
    )

    res.json(resultado)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}

/**
 * Obtener menú por restaurante
 */
exports.obtenerMenuPorRestaurante = async (req, res) => {

  try {

    const menu = await MenuItem.find({
      restauranteId: req.params.restauranteId
    })

    res.json(menu)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}


/**
 * Obtener items por categoría
 */
exports.obtenerItemsPorCategoria = async (req, res) => {

  try {

    const items = await MenuItem.find({
      categoria: req.params.categoria
    })

    res.json(items)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}


/**
 * Obtener item por ID
 */
exports.obtenerMenuItemPorId = async (req, res) => {

  try {

    const item = await MenuItem.findById(req.params.id)

    if (!item) {
      return res.status(404).json({ error: "Item no encontrado" })
    }

    res.json(item)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}


/**
 * Eliminar item del menú
 */
exports.eliminarMenuItem = async (req, res) => {

  try {

    const resultado = await MenuItem.deleteOne({ _id: req.params.id })

    res.json(resultado)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}

/**
 * Obtener menú de un restaurante
 */
exports.obtenerMenuRestaurante = async (req, res) => {

  try {

    const menu = await MenuItem.find({
      restauranteId: req.params.restauranteId
    })

    res.json(menu)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}


/**
 * Cambiar disponibilidad de un item
 */
exports.cambiarDisponibilidad = async (req, res) => {

  try {

    const resultado = await MenuItem.updateOne(
      { _id: req.params.id },
      { $set: { disponible: req.body.disponible } }
    )

    res.json(resultado)

  } catch (error) {

    res.status(500).json({ error: error.message })

  }

}