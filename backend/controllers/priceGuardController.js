const db = require('../config/db');
exports.list = async (req, res) => {
  const [rows] = await db.execute(
    `SELECT pg.id, pg.product_id, pg.saved_price, p.price AS current_price, pg.created_at, p.name, p.image, p.category
     FROM price_guard pg JOIN products p ON p.id = pg.product_id WHERE pg.user_id = ? ORDER BY pg.created_at DESC`, [req.user.id]);
  res.json(rows.map((r) => {
    const diff = Number(r.saved_price) - Number(r.current_price);
    return { ...r, difference: diff, status: diff > 0 ? 'dropped' : diff < 0 ? 'increased' : 'same' };
  }));
};
exports.add = async (req, res) => {
  const [p] = await db.execute('SELECT id, price FROM products WHERE id = ?', [req.params.productId]);
  if (!p.length) return res.status(404).json({ message: 'Product not found' });
  await db.execute(
    `INSERT INTO price_guard (user_id, product_id, saved_price, current_price) VALUES (?,?,?,?)
     ON DUPLICATE KEY UPDATE saved_price = VALUES(saved_price), current_price = VALUES(current_price)`,
    [req.user.id, p[0].id, p[0].price, p[0].price]);
  res.status(201).json({ message: 'Price Guard enabled', saved_price: p[0].price });
};
exports.remove = async (req, res) => {
  await db.execute('DELETE FROM price_guard WHERE user_id = ? AND product_id = ?', [req.user.id, req.params.productId]);
  res.json({ message: 'Removed from Price Guard' });
};
