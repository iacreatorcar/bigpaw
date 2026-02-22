const Verification = require('../models/Verification');
const Structure = require('../models/Structure');
const User = require('../models/User');
const badgeService = require('../services/badgeService');
const trackingService = require('../services/trackingService');

// CREA una nuova verifica
exports.createVerification = async (req, res) => {
  try {
    const { strutturaId, pesoCane, esito, foto, note, rating, tracking } = req.body;
    const userId = req.user.userId;

    // Verifica che la struttura esista
    const struttura = await Structure.findById(strutturaId);
    if (!struttura) {
      return res.status(404).json({ error: 'Struttura non trovata' });
    }

    // Verifica validità tracking (minimo 15 minuti)
    const trackingValid = trackingService.verifyPresence(
      tracking.percorso,
      struttura.coordinate.coordinates,
      15
    );

    // Crea la verifica
    const verification = new Verification({
      strutturaId,
      userId,
      pesoCane,
      esito,
      foto,
      note,
      rating,
      tracking,
      valida: trackingValid.valid
    });

    await verification.save();

    // Aggiorna la struttura con la nuova verifica
    struttura.verifiche.push(verification._id);
    struttura.totaleVerifiche += 1;
    
    // Calcola nuova media rating
    const allVerifiche = await Verification.find({ strutturaId, valida: true });
    const media = allVerifiche.reduce((acc, v) => acc + (v.rating || 0), 0) / allVerifiche.length;
    struttura.mediaRating = media || 0;
    
    await struttura.save();

    // Aggiorna statistiche utente
    await User.findByIdAndUpdate(userId, {
      $inc: { verificheEffettuate: 1 }
    });

    // Assegna badge se necessario
    const user = await User.findById(userId);
    const nuoviBadge = badgeService.assignBadges(
      user.verificheEffettuate + 1,
      pesoCane
    );
    
    if (nuoviBadge.length > 0) {
      user.badges.push(...nuoviBadge);
      user.livello = badgeService.calculateLevel(user.verificheEffettuate + 1);
      await user.save();
    }

    res.status(201).json({
      message: 'Verifica creata con successo',
      verification,
      valida: trackingValid.valid,
      trackingInfo: trackingValid
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante la creazione della verifica' });
  }
};

// OTTIENI tutte le verifiche di una struttura
exports.getStructureVerifications = async (req, res) => {
  try {
    const { strutturaId } = req.params;
    
    const verifiche = await Verification.find({ 
      strutturaId,
      valida: true 
    })
    .populate('userId', 'username livello')
    .sort('-data');

    res.json(verifiche);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nel recupero delle verifiche' });
  }
};

// OTTIENI le verifiche di un utente
exports.getMyVerifications = async (req, res) => {
  try {
    const verifiche = await Verification.find({ userId: req.user.userId })
      .populate('strutturaId', 'nome indirizzo')
      .sort('-data');

    res.json(verifiche);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nel recupero delle tue verifiche' });
  }
};

// OTTIENI statistiche di una struttura
exports.getStructureStats = async (req, res) => {
  try {
    const { strutturaId } = req.params;

    const stats = await Verification.aggregate([
      { $match: { strutturaId: mongoose.Types.ObjectId(strutturaId), valida: true } },
      { $group: {
        _id: null,
        totaleVerifiche: { $sum: 1 },
        mediaRating: { $avg: '$rating' },
        verifichePositive: { $sum: { $cond: ['$esito', 1, 0] } },
        pesoMedio: { $avg: '$pesoCane' },
        pesoMax: { $max: '$pesoCane' }
      }}
    ]);

    res.json(stats[0] || { 
      totaleVerifiche: 0,
      mediaRating: 0,
      verifichePositive: 0,
      pesoMedio: 0,
      pesoMax: 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nel recupero statistiche' });
  }
};