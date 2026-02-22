const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Validazione registrazione
const validateRegister = [
  body('username').isLength({ min: 3 }).withMessage('Username minimo 3 caratteri'),
  body('email').isEmail().withMessage('Email non valida'),
  body('password').isLength({ min: 6 }).withMessage('Password minimo 6 caratteri')
];

// Validazione login
const validateLogin = [
  body('email').isEmail().withMessage('Email non valida'),
  body('password').notEmpty().withMessage('Password richiesta')
];

// Route pubbliche
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

// Route protette (richiedono autenticazione)
router.get('/profile', auth, authController.getProfile);

module.exports = router;