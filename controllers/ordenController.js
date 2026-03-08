const Orden = require('../models/Orden');
const MenuItem = require('../models/MenuItem');
const Usuario = require('../models/Usuario');

// Crear orden
exports.crearOrden = async (req, res) => {
  try {
    const { usuarioId, restauranteId, items, direccionEntrega, comentarios } = req.body;

    // Validar usuario existe
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    let total = 0;
    const itemsOrden = [];

    // Procesar items y calcular total
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(404).json({ error: `Item ${item.menuItemId} no encontrado` });
      }

      const subtotal = menuItem.precio * item.cantidad;
      total += subtotal;

      itemsOrden.push({
        menuItemId: menuItem._id,
        nombre: menuItem.nombre,
        precioUnitario: menuItem.precio,
        cantidad: item.cantidad,
        subtotal
      });
    }

    const nuevaOrden = new Orden({
      usuarioId,
      restauranteId,
      items: itemsOrden,
      total,
      direccionEntrega: {
        building: direccionEntrega.building,
        street: direccionEntrega.street,
        zipcode: direccionEntrega.zipcode,
        borough: direccionEntrega.borough
      },
      comentarios
    });

    const orden = await nuevaOrden.save();
    
    // Actualizar total gastado del usuario
    usuario.totalGastado += total;
    await usuario.save();

    res.status(201).json(orden);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener órdenes de un usuario
exports.obtenerOrdenesUsuario = async (req, res) => {
  try {
    const ordenes = await Orden.find({ usuarioId: req.params.usuarioId })
      .populate('restauranteId', 'nombre')
      .sort({ fechaOrden: -1 });
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener órdenes de un restaurante
exports.obtenerOrdenesRestaurante = async (req, res) => {
  try {
    const ordenes = await Orden.find({ restauranteId: req.params.restauranteId })
      .populate('usuarioId', 'nombre email telefono')
      .sort({ fechaOrden: -1 });
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener orden por ID
exports.obtenerOrdenPorId = async (req, res) => {
  try {
    const orden = await Orden.findById(req.params.id)
      .populate('usuarioId')
      .populate('restauranteId')
      .populate('items.menuItemId');
    
    if (!orden) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    res.json(orden);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar estado de orden
exports.actualizarEstadoOrden = async (req, res) => {
  try {
    const { nuevoEstado } = req.body;
    const orden = await Orden.findById(req.params.id);

    if (!orden) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    // Validar que no sea ENTREGADA
    if (orden.estado === 'ENTREGADA') {
      return res.status(400).json({ error: 'No se puede modificar una orden entregada' });
    }

    orden.estado = nuevoEstado;
    if (nuevoEstado === 'ENTREGADA') {
      orden.fechaEntrega = new Date();
    }

    const ordenActualizada = await orden.save();
    res.json(ordenActualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener órdenes por estado
exports.obtenerOrdenesPorEstado = async (req, res) => {
  try {
    const { estado } = req.params;
    const ordenes = await Orden.find({ estado })
      .sort({ fechaOrden: -1 });
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancelar orden
exports.cancelarOrden = async (req, res) => {
  try {
    const orden = await Orden.findById(req.params.id);

    if (!orden) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    if (orden.estado === 'ENTREGADA') {
      return res.status(400).json({ error: 'No se puede cancelar una orden entregada' });
    }

    if (orden.estado === 'CANCELADA') {
      return res.status(400).json({ error: 'La orden ya está cancelada' });
    }

    orden.estado = 'CANCELADA';
    const ordenActualizada = await orden.save();

    res.json({ mensaje: 'Orden cancelada', orden: ordenActualizada });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
