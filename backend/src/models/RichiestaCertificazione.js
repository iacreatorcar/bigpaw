const mongoose = require('mongoose');

const richiestaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['hotel', 'bb', 'ristorante', 'agriturismo', 'campeggio', 'balneare', 'villaggio', 'resort'],
    required: true
  },
  email: {
    type: String,
    required: true
  },
  telefono: String,
  indirizzo: {
    type: String,
    required: true
  },
  sito: String,
  servizi: {
    ciotole: Boolean,
    cuscini: Boolean,
    giardino: Boolean,
    menupet: Boolean,
    dogsitter: Boolean,
    recinto: Boolean
  },
  pesoMax: {
    type: Number,
    required: true
  },
  note: String,
  stato: {
    type: String,
    enum: ['in_attesa', 'contattata', 'verificata', 'certificata', 'rifiutata'],
    default: 'in_attesa'
  },
  dataRichiesta: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RichiestaCertificazione', richiestaSchema);