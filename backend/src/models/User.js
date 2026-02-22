const mongoose = require('mongoose');

// Schema per i cani dell'utente
const dogSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true
  },
  razza: {
    type: String,
    required: true,
    trim: true
  },
  peso: {
    type: Number,
    required: true,
    min: 0
  },
  foto: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Schema per l'utente
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  cani: [dogSchema],
  badges: [{
    type: String,
    enum: ['bronze', 'silver', 'gold', 'ambassador']
  }],
  verificheEffettuate: {
    type: Number,
    default: 0
  },
  livello: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'ambassador'],
    default: 'bronze'
  },
  avatar: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);