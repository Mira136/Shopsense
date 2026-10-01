require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const app = express();
app.use(cors());
app.use(express.json());
// Wrap async handlers so errors reach the error middleware
const router = require('./routes');
router.stack.forEach((l) => l.route && l.route.stack.forEach((s) => {
  const fn = s.handle; if (fn.length <= 2) s.handle = (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}));
app.use('/api', router);
app.use('/api', (req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ message: 'Server error' }); });
const port = process.env.PORT || 5000;
db.query('SELECT 1').then(() => console.log('MySQL connected'))
  .catch((e) => console.error('MySQL connection failed:', e.message));
app.listen(port, () => console.log(`ShopSense API on http://localhost:${port}`));
