/**
 * Modelo Orden
 * Representa una orden de comida realizada por un usuario
 */

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

  /**
   * Items de la orden
   */
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
    enum: [
      'PENDIENTE',
      'CONFIRMADA',
      'EN_PREPARACION',
      'LISTA',
      'ENTREGADA',
      'CANCELADA'
    ],
    default: 'PENDIENTE'
  },

  fechaOrden: {
    type: Date,
    default: Date.now
  },

  fechaEntrega: {
    type: Date
  },

  /**
   * Dirección de entrega
   */
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

}, { timestamps: true });


/**
 * Método para validar cambios de estado
 */
ordenSchema.methods.puedeCambiarEstado = function(nuevoEstado) {

  if (this.estado === 'ENTREGADA') {
    return false;
  }

  return true;

};


/**
 * Índices para optimizar consultas
 */

// órdenes por usuario
ordenSchema.index({ usuarioId: 1 });

// órdenes por restaurante
ordenSchema.index({ restauranteId: 1 });

// búsqueda por items
ordenSchema.index({ "items.menuItemId": 1 });

// consultas por estado
ordenSchema.index({ estado: 1 });

// historial por fecha
ordenSchema.index({ fechaOrden: -1 });

// consultas usuario + fecha
ordenSchema.index({ usuarioId: 1, fechaOrden: -1 });

module.exports = mongoose.model('Orden', ordenSchema);