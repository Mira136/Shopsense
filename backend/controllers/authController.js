const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const sign = (u) => jwt.sign({ id: u.id, email: u.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
const pub = (u) => ({ id: u.id, name: u.name, email: u.email, created_at: u.created_at });

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 6)
    return res.status(400).json({ message: 'Name, email and a password of 6+ characters are required' });
  const [ex] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
  if (ex.length) return res.status(400).json({ message: 'Email already registered' });
  const hash = await bcrypt.hash(password, 10);
  const [r] = await db.execute('INSERT INTO users (name, email, password) VALUES (?,?,?)', [name, email, hash]);
  const user = { id: r.insertId, name, email };
  res.status(201).json({ token: sign(user), user });
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  if (!rows.length || !(await bcrypt.compare(password, rows[0].password)))
    return res.status(401).json({ message: 'Invalid email or password' });
  res.json({ token: sign(rows[0]), user: pub(rows[0]) });
};
exports.me = async (req, res) => {
  const [rows] = await db.execute('SELECT id, name, email, created_at FROM users WHERE id = ?', [req.user.id]);
  if (!rows.length) return res.status(404).json({ message: 'User not found' });
  res.json({ user: rows[0] });
};
