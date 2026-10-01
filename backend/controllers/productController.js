const db = require('../config/db');

exports.list = async (req, res) => { const [r] = await db.execute('SELECT * FROM products ORDER BY id'); res.json(r); };
exports.get = async (req, res) => {
  const [r] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
  if (!r.length) return res.status(404).json({ message: 'Product not found' });
  res.json(r[0]);
};
exports.search = async (req, res) => {
  const like = `%${(req.query.q || '').trim()}%`;
  const [r] = await db.execute(
    'SELECT * FROM products WHERE name LIKE ? OR category LIKE ? OR tags LIKE ? ORDER BY rating DESC', [like, like, like]);
  res.json(r);
};
exports.byCategory = async (req, res) => {
  const [r] = await db.execute('SELECT * FROM products WHERE category = ? ORDER BY id', [req.params.category]);
  res.json(r);
};
exports.updatePrice = async (req, res) => {
  const price = Number(req.body.price);
  if (!(price > 0)) return res.status(400).json({ message: 'A valid positive price is required' });
  const [r] = await db.execute('UPDATE products SET price = ? WHERE id = ?', [price, req.params.id]);
  if (!r.affectedRows) return res.status(404).json({ message: 'Product not found' });
  await db.execute('UPDATE price_guard SET current_price = ? WHERE product_id = ?', [price, req.params.id]);
  const [p] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
  res.json(p[0]);
};
// Rule-based recommendation: rating + price + wishlist/cart categories. No external AI.
exports.recommendation = async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ message: 'Product not found' });
  const p = rows[0];
  const interests = new Set((req.query.cart || '').split(',').filter(Boolean));
  if (req.user) {
    const [w] = await db.execute(
      'SELECT DISTINCT p.category FROM wishlist w JOIN products p ON p.id = w.product_id WHERE w.user_id = ? AND p.id <> ?',
      [req.user.id, p.id]);
    w.forEach((x) => interests.add(x.category));
  }
  const reasons = [];
  if (Number(p.rating) >= 4.5) reasons.push('Highly rated by customers');
  if (Number(p.price) <= 3000) reasons.push('Fits your budget');
  if (interests.has(p.category)) reasons.push('Matches your shopping interests');
  if (p.stock > 0) reasons.push('In stock and ready to ship');
  reasons.push(`Popular in ${p.category}`);
  res.json({ reasons: reasons.slice(0, 3) });
};
