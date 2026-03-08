const Resena = require('../models/Resena');
const Restaurante = require('../models/Restaurante');
const Orden = require('../models/Orden');

// Crear reseña
exports.crearResena = async (req, res) => {
  try {
    const { usuarioId, restauranteId, ordenId, rating, comentario } = req.body;

    // Validar que la orden existe y pertenece al restaurante
    const orden = await Orden.findById(ordenId);
    if (!orden) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    if (orden.restauranteId.toString() !== restauranteId) {
      return res.status(400).json({ error: 'La orden no pertenece a este restaurante' });
    }

    if (orden.estado !== 'ENTREGADA') {
      return res.status(400).json({ error: 'Solo se pueden reseñar órdenes entregadas' });
    }

    const nuevaResena = new Resena({
      usuarioId,
      restauranteId,
      ordenId,
      rating,
      comentario
    });

    const resena = await nuevaResena.save();

    // Actualizar rating del restaurante
    await actualizarRatingRestaurante(restauranteId);

    res.status(201).json(resena);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Función auxiliar para actualizar rating
const actualizarRatingRestaurante = async (restauranteId) => {
  const resenas = await Resena.find({ restauranteId });
  
  if (resenas.length === 0) {
    return;
  }

  const ratingPromedio = resenas.reduce((sum, r) => sum + r.rating, 0) / resenas.length;
  
  await Restaurante.findByIdAndUpdate(
    restauranteId,
    {
      ratingPromedio,
      totalResenas: resenas.length
    }
  );
};

// Obtener reseñas de un restaurante
exports.obtenerResenasRestaurante = async (req, res) => {
  try {
    const resenas = await Resena.find({ restauranteId: req.params.restauranteId })
      .populate('usuarioId', 'nombre')
      .sort({ fecha: -1 });
    res.json(resenas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener reseñas de un usuario
exports.obtenerResenasUsuario = async (req, res) => {
  try {
    const resenas = await Resena.find({ usuarioId: req.params.usuarioId })
      .populate('restauranteId', 'nombre')
      .sort({ fecha: -1 });
    res.json(resenas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener reseña por ID
exports.obtenerResenaPorId = async (req, res) => {
  try {
    const resena = await Resena.findById(req.params.id)
      .populate('usuarioId')
      .populate('restauranteId')
      .populate('ordenId');
    
    if (!resena) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }
    res.json(resena);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar reseña
exports.actualizarResena = async (req, res) => {
  try {
    const { rating, comentario } = req.body;
    const resena = await Resena.findById(req.params.id);

    if (!resena) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }

    resena.rating = rating || resena.rating;
    resena.comentario = comentario || resena.comentario;
    const resenaActualizada = await resena.save();

    // Actualizar rating del restaurante
    await actualizarRatingRestaurante(resena.restauranteId);

    res.json(resenaActualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar reseña
exports.eliminarResena = async (req, res) => {
  try {
    const resena = await Resena.findByIdAndDelete(req.params.id);
    if (!resena) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }

    // Actualizar rating del restaurante
    await actualizarRatingRestaurante(resena.restauranteId);

    res.json({ mensaje: 'Reseña eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener estadísticas de reseñas de un restaurante
exports.estadisticasRestaurante = async (req, res) => {
  try {
    const resenas = await Resena.find({ restauranteId: req.params.restauranteId });
    
    if (resenas.length === 0) {
      return res.json({
        totalResenas: 0,
        ratingPromedio: 0,
        distribucion: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
    }

    const distribucion = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRating = 0;

    resenas.forEach(r => {
      distribucion[r.rating]++;
      totalRating += r.rating;
    });

    res.json({
      totalResenas: resenas.length,
      ratingPromedio: (totalRating / resenas.length).toFixed(2),
      distribucion
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
