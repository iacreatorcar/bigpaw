const RichiestaCertificazione = require('../models/RichiestaCertificazione');

// Salva una nuova richiesta di certificazione
exports.creaRichiesta = async (req, res) => {
  try {
    const richiesta = new RichiestaCertificazione(req.body);
    await richiesta.save();
    
    res.status(201).json({
      message: 'Richiesta ricevuta con successo',
      richiesta
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante il salvataggio della richiesta' });
  }
};

// Ottieni tutte le richieste (solo per admin)
exports.getRichieste = async (req, res) => {
  try {
    const richieste = await RichiestaCertificazione.find().sort('-dataRichiesta');
    res.json(richieste);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nel recupero delle richieste' });
  }
};
exports.creaRichiesta = async (req, res) => {
  try {
    console.log('📥 Ricevuta richiesta:', req.body);
    const richiesta = new RichiestaCertificazione(req.body);
    await richiesta.save();
    console.log('✅ Richiesta salvata con ID:', richiesta._id);
    res.status(201).json({ message: 'Richiesta salvata', richiesta });
  } catch (error) {
    console.error('❌ Errore salvataggio:', error);
    res.status(500).json({ error: error.message });
  }
};