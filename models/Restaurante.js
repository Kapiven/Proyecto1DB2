/**
 * Modelo Restaurante
 * Basado en dataset NYC Restaurants
 */

const mongoose = require('mongoose');

const restauranteSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  cuisine: {
    type: String,
    required: true
  },

  restaurant_id: {
    type: String,
    required: true,
    unique: true
  },

  address: {

    building: {
      type: String,
      required: true
    },

    street: {
      type: String,
      required: true
    },

    zipcode: {
      type: String,
      required: true
    },

    borough: {
      type: String,
      enum: ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'],
      required: true
    },

    /**
     * Coordenadas geográficas
     * [longitude, latitude]
     */
    coord: {
      type: [Number],
      required: true
    }

  },

  ratingPromedio: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },

  totalResenas: {
    type: Number,
    default: 0,
    min: 0
  },

  fechaCreacion: {
    type: Date,
    default: Date.now
  },

  activo: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

/**
 * Índices
 */

// índice geoespacial
restauranteSchema.index({ "address.coord": "2dsphere" });

// consultas por borough
restauranteSchema.index({ "address.borough": 1 });

// consultas por cuisine
restauranteSchema.index({ cuisine: 1 });

module.exports = mongoose.model('Restaurante', restauranteSchema);