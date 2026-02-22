// geocodingService.js - VERSIONE FAKE PER TEST
// Restituisce coordinate fisse in base alla città

exports.geocodeAddress = async (address) => {
  console.log('📍 Geocoding address:', address);
  
  // Coordinate fisse per le principali città italiane
  const cities = {
    'roma': { lat: 41.9028, lng: 12.4964 },
    'milano': { lat: 45.4642, lng: 9.1900 },
    'firenze': { lat: 43.7696, lng: 11.2558 },
    'venezia': { lat: 45.4408, lng: 12.3155 },
    'napoli': { lat: 40.8518, lng: 14.2681 },
    'bologna': { lat: 44.4949, lng: 11.3426 },
    'torino': { lat: 45.0703, lng: 7.6869 },
    'palermo': { lat: 38.1157, lng: 13.3615 }
  };

  // Cerca la città nell'indirizzo (in lowercase)
  const addressLower = address.toLowerCase();
  
  for (const [city, coords] of Object.entries(cities)) {
    if (addressLower.includes(city)) {
      console.log(`✅ Trovata città: ${city} -> coordinate:`, coords);
      return coords;
    }
  }

  // Se non trova la città, restituisci coordinate di default (Roma)
  console.log('⚠️ Città non riconosciuta, uso default Roma');
  return { lat: 41.9028, lng: 12.4964 };
};