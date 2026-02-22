const Structure = require('../models/Structure');
const { geocodeAddress } = require('../services/geocodingService');

// CREA una nuova struttura
exports.createStructure = async (req, res) => {
  try {
    const { nome, tipo, indirizzo, telefono, email, sitoWeb, servizi } = req.body;

    // Geocoding dell'indirizzo per ottenere coordinate
    const coordinates = await geocodeAddress(indirizzo);
    
    if (!coordinates) {
      return res.status(400).json({ error: 'Indirizzo non valido o non trovato' });
    }

    // Crea la struttura
    const structure = new Structure({
      nome,
      tipo,
      indirizzo,
      telefono,
      email,
      sitoWeb,
      servizi: servizi || [],
      coordinate: {
        type: 'Point',
        coordinates: [coordinates.lng, coordinates.lat] // MongoDB usa [longitude, latitude]
      }
    });

    await structure.save();

    res.status(201).json({
      message: 'Struttura creata con successo',
      structure
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante la creazione della struttura' });
  }
};

// OTTIENI tutte le strutture
exports.getAllStructures = async (req, res) => {
  try {
    const structures = await Structure.find({ attiva: true })
      .select('-verifiche') // Non mostrare le singole verifiche
      .sort('-createdAt');
    
    res.json(structures);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nel recupero delle strutture' });
  }
};

// OTTIENI una struttura per ID
exports.getStructureById = async (req, res) => {
  try {
    const structure = await Structure.findById(req.params.id)
      .populate('verifiche.userId', 'username livello');
    
    if (!structure) {
      return res.status(404).json({ error: 'Struttura non trovata' });
    }
    
    res.json(structure);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nel recupero della struttura' });
  }
};

// CERCA strutture nelle vicinanze
exports.getNearbyStructures = async (req, res) => {
  try {
    const { lat, lng, maxDistance = 5000 } = req.query; // distanza in metri (default 5km)

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitudine e longitudine richieste' });
    }

    const structures = await Structure.find({
      coordinate: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      attiva: true
    }).select('-verifiche').limit(50);

    res.json(structures);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nella ricerca' });
  }
};

// AGGIORNA una struttura
exports.updateStructure = async (req, res) => {
  try {
    const updates = req.body;
    
    // Se cambia l'indirizzo, ricalcola le coordinate
    if (updates.indirizzo) {
      const coordinates = await geocodeAddress(updates.indirizzo);
      if (coordinates) {
        updates.coordinate = {
          type: 'Point',
          coordinates: [coordinates.lng, coordinates.lat]
        };
      }
    }

    const structure = await Structure.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!structure) {
      return res.status(404).json({ error: 'Struttura non trovata' });
    }

    res.json({
      message: 'Struttura aggiornata con successo',
      structure
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nell\'aggiornamento' });
  }
};

// ELIMINA (disattiva) una struttura
exports.deleteStructure = async (req, res) => {
  try {
    const structure = await Structure.findByIdAndUpdate(
      req.params.id,
      { attiva: false },
      { new: true }
    );

    if (!structure) {
      return res.status(404).json({ error: 'Struttura non trovata' });
    }

    res.json({ message: 'Struttura disattivata con successo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nell\'eliminazione' });
  }
};