const mongoose = require('mongoose');

// Schema per le verifiche della struttura
const verificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  data: {
    type: Date,
    default: Date.now
  },
  esito: {
    type: Boolean,
    required: true
  },
  pesoCane: {
    type: Number,
    required: true
  },
  foto: [String],
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  note: String,
  tempoVisita: Number, // in minuti
  percorso: [{
    lat: Number,
    lng: Number,
    timestamp: Date
  }]
});

// Schema principale della struttura
const structureSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  tipo: {
    type: String,
    enum: ['hotel', 'b&b', 'agriturismo', 'ristorante', 'bar', 'campeggio', 'struttura balneare', 'villaggio turistico', 'resort', 'altro'] ,
    required: true
  },
  indirizzo: {
    type: String,
    required: true
  },
  coordinate: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere' // per ricerche geospaziali
    }
  },
  telefono: String,
  email: String,
  sitoWeb: String,
  
  // Statistiche
  verifiche: [verificationSchema],
  mediaRating: {
    type: Number,
    default: 0
  },
  totaleVerifiche: {
    type: Number,
    default: 0
  },
  
  // Certificazione
  certificazione: {
    livello: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'none'],
      default: 'none'
    },
    dataCertificazione: Date,
    verificatoreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    scadenza: Date
  },
  
  // Informazioni aggiuntive
  accettaCaniGrandi: {
    type: Boolean,
    default: false
  },
  limitePeso: {
    type: String,
    enum: ['nessuno', 'fino25kg', 'fino40kg', 'soloPiccoli']
  },
  supplemento: {
    richiesto: Boolean,
    importo: Number
  },
  servizi: [String], // es: ['ciotole', 'cuscini', 'giardino']
  
  // Flag struttura attiva
  attiva: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indice per ricerche geospaziali
structureSchema.index({ coordinate: '2dsphere' });

module.exports = mongoose.model('Structure', structureSchema);