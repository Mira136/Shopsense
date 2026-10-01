const jwt = require('jsonwebtoken');
const read = (req) => { const h = req.headers.authorization || ''; return h.startsWith('Bearer ') ? h.slice(7) : null; };
exports.auth = (req, res, next) => {
  const t = read(req);
  if (!t) return res.status(401).json({ message: 'Please log in to continue' });
  try { req.user = jwt.verify(t, process.env.JWT_SECRET); next(); }
  catch { res.status(401).json({ message: 'Session expired. Please log in again' }); }
};
exports.optionalAuth = (req, res, next) => {
  const t = read(req);
  if (t) { try { req.user = jwt.verify(t, process.env.JWT_SECRET); } catch {} }
  next();
};
