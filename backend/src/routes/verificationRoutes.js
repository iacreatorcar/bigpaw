const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');
const auth = require('../middleware/auth');

// Route pubbliche
router.get('/struttura/:strutturaId', verificationController.getStructureVerifications);
router.get('/struttura/:strutturaId/stats', verificationController.getStructureStats);

// Route protette (richiedono autenticazione)
router.post('/', auth, verificationController.createVerification);
router.get('/mie', auth, verificationController.getMyVerifications);

module.exports = router;