const MenuItem = require('../models/MenuItem');

// Crear item de menú
exports.crearMenuItem = async (req, res) => {
  try {
    const { restauranteId, nombre, descripcion, precio, categoria } = req.body;

    const nuevoItem = new MenuItem({
      restauranteId,
      nombre,
      descripcion,
      precio,
      categoria
    });

    const item = await nuevoItem.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener menú de un restaurante
exports.obtenerMenuRestaurante = async (req, res) => {
  try {
    const items = await MenuItem.find({ 
      restauranteId: req.params.restauranteId,
      disponible: true 
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener item por ID
exports.obtenerMenuItemPorId = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar item
exports.actualizarMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar item
exports.eliminarMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    res.json({ mensaje: 'Item eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cambiar disponibilidad
exports.cambiarDisponibilidad = async (req, res) => {
  try {
    const { disponible } = req.body;
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { disponible },
      { new: true }
    );
    if (!item) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
