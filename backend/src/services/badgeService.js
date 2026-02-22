// badgeService.js - Gestione badge e livelli utente

// Calcola il livello in base al numero di verifiche
exports.calculateLevel = (verificheCount) => {
  if (verificheCount >= 50) return 'ambassador';
  if (verificheCount >= 25) return 'gold';
  if (verificheCount >= 10) return 'silver';
  if (verificheCount >= 1) return 'bronze';
  return 'newbie';
};

// Assegna badge in base ai traguardi
exports.assignBadges = (verificheCount, pesoCaniVerificati) => {
  const badges = [];
  
  // Badge per numero verifiche
  if (verificheCount >= 1) badges.push('prima_verifica');
  if (verificheCount >= 10) badges.push('verificatore_bronze');
  if (verificheCount >= 25) badges.push('verificatore_silver');
  if (verificheCount >= 50) badges.push('verificatore_gold');
  if (verificheCount >= 100) badges.push('verificatore_legend');
  
  // Badge per cani grandi
  if (pesoCaniVerificati > 25) badges.push('amico_dei_grandi');
  if (pesoCaniVerificati > 40) badges.push('specialista_grandi_taglie');
  
  return badges;
};

// Verifica se l'utente può certificare una struttura
exports.canCertify = (userLevel, verificheCount) => {
  const certifiedLevels = ['gold', 'ambassador'];
  return certifiedLevels.includes(userLevel) && verificheCount >= 25;
};