const mongoose = require('mongoose');

const ordenSchema = new mongoose.Schema({
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
  items: [
    {
      menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
      },
      nombre: {
        type: String,
        required: true
      },
      precioUnitario: {
        type: Number,
        required: true,
        min: 0
      },
      cantidad: {
        type: Number,
        required: true,
        min: 1
      },
      subtotal: {
        type: Number,
        required: true,
        min: 0
      }
    }
  ],
  total: {
    type: Number,
    required: true,
    min: 0
  },
  estado: {
    type: String,
    enum: ['PENDIENTE', 'CONFIRMADA', 'EN_PREPARACION', 'LISTA', 'ENTREGADA', 'CANCELADA'],
    default: 'PENDIENTE'
  },
  fechaOrden: {
    type: Date,
    default: Date.now
  },
  fechaEntrega: {
    type: Date
  },
  direccionEntrega: {
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
    }
  },
  comentarios: {
    type: String
  }
});

// Prevent modification of delivered orders at application level
ordenSchema.methods.puedeSer = function(nuevoEstado) {
  if (this.estado === 'ENTREGADA') {
    return false;
  }
  return true;
};

// Index for queries by usuario and restaurante
ordenSchema.index({ usuarioId: 1 });
ordenSchema.index({ restauranteId: 1 });
ordenSchema.index({ estado: 1 });
ordenSchema.index({ fechaOrden: -1 });

module.exports = mongoose.model('Orden', ordenSchema);
