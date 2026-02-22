// trackingService.js - Gestione del tracking durante le verifiche

// Calcola la distanza tra due punti (in metri)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Raggio della terra in metri
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metri
}

// Verifica che l'utente sia rimasto nella struttura
exports.verifyPresence = (trackingPath, structureCoords, minTime = 15) => {
  if (!trackingPath || trackingPath.length < 2) {
    return { valid: false, reason: 'Tracking insufficiente' };
  }

  // Calcola tempo totale
  const startTime = new Date(trackingPath[0].timestamp);
  const endTime = new Date(trackingPath[trackingPath.length - 1].timestamp);
  const durationMinutes = (endTime - startTime) / (1000 * 60);

  if (durationMinutes < minTime) {
    return { 
      valid: false, 
      reason: `Tempo insufficiente: ${durationMinutes.toFixed(1)} minuti (minimo ${minTime})` 
    };
  }

  // Verifica che sia stato vicino alla struttura
  let nearStructure = false;
  for (const point of trackingPath) {
    const distance = calculateDistance(
      point.lat, point.lng,
      structureCoords.lat, structureCoords.lng
    );
    if (distance < 100) { // entro 100 metri
      nearStructure = true;
      break;
    }
  }

  if (!nearStructure) {
    return { valid: false, reason: 'Non sei mai stato vicino alla struttura' };
  }

  return { 
    valid: true, 
    duration: durationMinutes,
    message: 'Verifica valida' 
  };
};

// Calcola il bounding box dell'area visitata
exports.calculateBoundingBox = (trackingPath) => {
  if (!trackingPath || trackingPath.length === 0) {
    return null;
  }

  let minLat = trackingPath[0].lat;
  let maxLat = trackingPath[0].lat;
  let minLng = trackingPath[0].lng;
  let maxLng = trackingPath[0].lng;

  for (const point of trackingPath) {
    minLat = Math.min(minLat, point.lat);
    maxLat = Math.max(maxLat, point.lat);
    minLng = Math.min(minLng, point.lng);
    maxLng = Math.max(maxLng, point.lng);
  }

  return {
    minLat,
    maxLat,
    minLng,
    maxLng,
    center: {
      lat: (minLat + maxLat) / 2,
      lng: (minLng + maxLng) / 2
    }
  };
};