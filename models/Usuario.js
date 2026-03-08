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
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un email válido']
  },
  passwordHash: {
    type: String,
    required: true
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
    coord: {
      type: [Number], // [longitude, latitude]
      required: false
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
});

// Index for email lookups
usuarioSchema.index({ email: 1 });

module.exports = mongoose.model('Usuario', usuarioSchema);
