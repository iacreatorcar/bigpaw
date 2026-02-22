const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const verificationRoutes = require('./routes/verificationRoutes');
require('dotenv').config();

// Importa le route
const authRoutes = require('./routes/authRoutes');
const structureRoutes = require('./routes/structureRoutes'); // ATTIVATO
// const verificationRoutes = require('./routes/verificationRoutes'); // Da scommentare dopo

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api/verifications', verificationRoutes);

// Connessione a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connesso a MongoDB');
  })
  .catch((err) => {
    console.error('❌ Errore connessione MongoDB:', err.message);
  });

// Rotte pubbliche
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date(),
    message: 'BigPaw API è attiva e funzionante!',
    mongodb: mongoose.connection.readyState === 1 ? 'connesso' : 'disconnesso'
  });
});

app.get('/', (req, res) => {
  res.json({ 
    name: 'BigPaw API',
    version: '1.0.0',
    message: 'Benvenuto su BigPaw!',
    mongodb: mongoose.connection.readyState === 1 ? '✅' : '❌',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

// Rotte API
app.use('/api/auth', authRoutes);
app.use('/api/structures', structureRoutes); // ATTIVATO
// app.use('/api/verifications', verificationRoutes);

// Rotte API di base (per ora)
app.use('/api', (req, res) => {
  res.json({ 
    message: 'API BigPaw',
    available_endpoints: [
      '/api/auth',
      '/api/verifications',
      '/api/structures'
    ]
  });
});

// Gestione 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rotta non trovata' });
});

// Gestione errori
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Qualcosa è andato storto!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server avviato su http://localhost:${PORT}`);
  console.log(`📚 Health check: http://localhost:${PORT}/health`);
});