/**
 * Modelo MenuItem
 * Representa los platos del menú de cada restaurante
 */

const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({

  // Relación con restaurante
  restauranteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurante',
    required: true
  },

  nombre: {
    type: String,
    required: true,
    trim: true
  },

  descripcion: {
    type: String,
    required: true
  },

  precio: {
    type: Number,
    required: true,
    min: 0
  },

  categoria: {
    type: String,
    required: true
  },

  disponible: {
    type: Boolean,
    default: true
  },

  /**
   * Referencia a imagen almacenada en GridFS
   */
  imagenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'fs.files'
  },

  fechaCreacion: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

/**
 * Índices
 */

// consultas por restaurante
menuItemSchema.index({ restauranteId: 1 });

// consultas por categoría
menuItemSchema.index({ categoria: 1 });

// consultas rápidas menú disponible por restaurante
menuItemSchema.index({ restauranteId: 1, disponible: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);