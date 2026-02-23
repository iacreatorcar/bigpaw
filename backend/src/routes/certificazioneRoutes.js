const express = require('express');
const router = express.Router();
const certificazioneController = require('../controllers/certificazioneController');

// Route pubblica per inviare richiesta
router.post('/', certificazioneController.creaRichiesta);

// Route protetta per admin (da implementare dopo)
// router.get('/', auth, certificazioneController.getRichieste);

module.exports = router;