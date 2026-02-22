const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  strutturaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Structure',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  data: {
    type: Date,
    default: Date.now
  },
  pesoCane: {
    type: Number,
    required: true,
    min: 0
  },
  esito: {
    type: Boolean,
    required: true
  },
  foto: [{
    type: String,
    required: true
  }],
  note: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  // Tracking GPS
  tracking: {
    percorso: [{
      lat: Number,
      lng: Number,
      timestamp: Date
    }],
    durataMinuti: Number,
    distanzaMetri: Number
  },
  // Verifica validità
  valida: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Verification', verificationSchema);