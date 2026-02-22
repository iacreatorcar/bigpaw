const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Prendi token dall'header Authorization
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'Accesso negato. Token mancante' });
  }

  // Formato: "Bearer TOKEN"
  const token = authHeader.replace('Bearer ', '');
  
  try {
    // Verifica token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token non valido' });
  }
};