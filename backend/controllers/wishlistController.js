const db = require('../config/db');
exports.list = async (req, res) => {
  const [r] = await db.execute(
    'SELECT p.* FROM wishlist w JOIN products p ON p.id = w.product_id WHERE w.user_id = ? ORDER BY w.created_at DESC', [req.user.id]);
  res.json(r);
};
exports.add = async (req, res) => {
  const [p] = await db.execute('SELECT id FROM products WHERE id = ?', [req.params.productId]);
  if (!p.length) return res.status(404).json({ message: 'Product not found' });
  await db.execute('INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?,?)', [req.user.id, req.params.productId]);
  res.status(201).json({ message: 'Added to wishlist' });
};
exports.remove = async (req, res) => {
  await db.execute('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [req.user.id, req.params.productId]);
  res.json({ message: 'Removed from wishlist' });
};
