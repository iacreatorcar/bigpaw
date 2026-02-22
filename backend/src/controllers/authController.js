const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrazione nuovo utente
exports.register = async (req, res) => {
  try {
    const { username, email, password, cani } = req.body;

    // Verifica se utente esiste già
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Utente già esistente' });
    }

    // Hash della password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crea nuovo utente
    const user = new User({
      username,
      email,
      password: hashedPassword,
      cani: cani || []
    });

    await user.save();

    // Crea token JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      message: 'Utente registrato con successo',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        livello: user.livello,
        verificheEffettuate: user.verificheEffettuate
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante la registrazione' });
  }
};

// Login utente
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cerca utente
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    // Verifica password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    // Crea token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      message: 'Login effettuato con successo',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        livello: user.livello,
        verificheEffettuate: user.verificheEffettuate
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante il login' });
  }
};

// Profilo utente
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nel recupero del profilo' });
  }
};