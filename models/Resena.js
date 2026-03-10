/**
 * Modelo Resena
 * Representa la opinión de un usuario sobre un restaurante
 */

const mongoose = require('mongoose');

const resenaSchema = new mongoose.Schema({

  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },

  restauranteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurante',
    required: true
  },

  ordenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Orden',
    required: true
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  comentario: {
    type: String,
    required: true
  },

  fecha: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

/**
 * Índices
 */

// consultas por restaurante
resenaSchema.index({ restauranteId: 1 });

// consultas por usuario
resenaSchema.index({ usuarioId: 1 });

// reseñas por orden
resenaSchema.index({ ordenId: 1 });

// evitar duplicados
resenaSchema.index({ usuarioId: 1, ordenId: 1 }, { unique: true });

module.exports = mongoose.model('Resena', resenaSchema);