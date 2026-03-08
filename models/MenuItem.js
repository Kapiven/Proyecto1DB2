const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
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
  imagenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'fs.files' // GridFS reference
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries by restaurant
menuItemSchema.index({ restauranteId: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
