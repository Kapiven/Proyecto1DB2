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
});

// Index for queries
resenaSchema.index({ restauranteId: 1 });
resenaSchema.index({ usuarioId: 1 });
resenaSchema.index({ ordenId: 1 });

module.exports = mongoose.model('Resena', resenaSchema);
