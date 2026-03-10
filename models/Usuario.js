/**
 * Modelo Usuario
 */

const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({

  nombre: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },

  passwordHash: {
    type: String,
    required: true
  },

  address: {

    building: String,

    street: String,

    zipcode: String,

    borough: {
      type: String,
      enum: ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island']
    },

    coord: {
      type: [Number] // [longitude, latitude]
    }

  },

  telefono: {
    type: String,
    required: true
  },

  fechaRegistro: {
    type: Date,
    default: Date.now
  },

  rol: {
    type: String,
    enum: ['cliente', 'administrador'],
    default: 'cliente'
  },

  totalGastado: {
    type: Number,
    default: 0,
    min: 0
  }

}, { timestamps: true });

/**
 * Índices
 */

usuarioSchema.index({ email: 1 });
usuarioSchema.index({ totalGastado: -1 });

module.exports = mongoose.model('Usuario', usuarioSchema);