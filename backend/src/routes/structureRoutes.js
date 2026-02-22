const express = require('express');
const router = express.Router();
const structureController = require('../controllers/structureController');
const auth = require('../middleware/auth');

// Route pubbliche (non richiedono autenticazione)
router.get('/', structureController.getAllStructures);
router.get('/nearby', structureController.getNearbyStructures);
router.get('/:id', structureController.getStructureById);

// Route protette (richiedono autenticazione)
router.post('/', auth, structureController.createStructure);
router.put('/:id', auth, structureController.updateStructure);
router.delete('/:id', auth, structureController.deleteStructure);

module.exports = router;