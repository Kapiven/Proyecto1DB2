const Restaurante = require('../models/Restaurante');

// Crear restaurante
exports.crearRestaurante = async (req, res) => {
  try {
    const { name, cuisine, restaurant_id, address } = req.body;

    const nuevoRestaurante = new Restaurante({
      name,
      cuisine,
      restaurant_id,
      address: {
        building: address.building,
        street: address.street,
        zipcode: address.zipcode,
        borough: address.borough,
        coord: address.coord
      }
    });

    const restaurante = await nuevoRestaurante.save();
    res.status(201).json(restaurante);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todos los restaurantes
exports.obtenerRestaurantes = async (req, res) => {
  try {
    const restaurantes = await Restaurante.find({ activo: true });
    res.json(restaurantes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener restaurante por ID
exports.obtenerRestaurantePorId = async (req, res) => {
  try {
    const restaurante = await Restaurante.findById(req.params.id);
    if (!restaurante) {
      return res.status(404).json({ error: 'Restaurante no encontrado' });
    }
    res.json(restaurante);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar restaurante
exports.actualizarRestaurante = async (req, res) => {
  try {
    const restaurante = await Restaurante.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!restaurante) {
      return res.status(404).json({ error: 'Restaurante no encontrado' });
    }
    res.json(restaurante);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar restaurante (soft delete)
exports.eliminarRestaurante = async (req, res) => {
  try {
    const restaurante = await Restaurante.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );
    if (!restaurante) {
      return res.status(404).json({ error: 'Restaurante no encontrado' });
    }
    res.json({ mensaje: 'Restaurante eliminado', restaurante });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar restaurantes cercanos (Geospatial query)
exports.restaurantesCercanos = async (req, res) => {
  try {
    const { longitude, latitude, distancia } = req.body;

    const restaurantes = await Restaurante.find({
      'address.coord': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: distancia * 1000 // convertir km a metros
        }
      }
    });

    res.json(restaurantes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar restaurantes por borough
exports.restaurantesPorBorough = async (req, res) => {
  try {
    const { borough } = req.params;
    const restaurantes = await Restaurante.find({
      'address.borough': borough,
      activo: true
    });

    res.json(restaurantes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar restaurantes por cuisine
exports.restaurantesPorCuisine = async (req, res) => {
  try {
    const { cuisine } = req.params;
    const restaurantes = await Restaurante.find({
      cuisine: new RegExp(cuisine, 'i'),
      activo: true
    });

    res.json(restaurantes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar rating de restaurante
exports.actualizarRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const restaurante = await Restaurante.findById(req.params.id);

    if (!restaurante) {
      return res.status(404).json({ error: 'Restaurante no encontrado' });
    }

    const nuevoRating = (restaurante.ratingPromedio * restaurante.totalResenas + rating) / (restaurante.totalResenas + 1);
    
    const restauranteActualizado = await Restaurante.findByIdAndUpdate(
      req.params.id,
      {
        ratingPromedio: nuevoRating,
        totalResenas: restaurante.totalResenas + 1
      },
      { new: true }
    );

    res.json(restauranteActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
