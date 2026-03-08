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
    coord: {
      type: [Number], // [longitude, latitude]
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
});

// Create geospatial index for coord
restauranteSchema.index({ 'address.coord': '2dsphere' });
restauranteSchema.index({ 'address.borough': 1 });

module.exports = mongoose.model('Restaurante', restauranteSchema);
