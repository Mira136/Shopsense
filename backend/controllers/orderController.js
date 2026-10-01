const db = require('../config/db');
const delivery = (sub) => (sub > 999 ? 0 : 49);

exports.create = async (req, res) => {
  const { items, fullName, phone, address, city, pincode } = req.body;
  if (!Array.isArray(items) || !items.length) return res.status(400).json({ message: 'Your cart is empty' });
  if (!fullName || !phone || !address || !city || !pincode) return res.status(400).json({ message: 'All delivery fields are required' });
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    let subtotal = 0; const lines = [];
    for (const it of items) {
      const qty = parseInt(it.quantity, 10);
      const [p] = await conn.execute('SELECT id, name, price, stock FROM products WHERE id = ? FOR UPDATE', [it.productId]);
      if (!p.length || !(qty > 0)) throw Object.assign(new Error('Invalid item in cart'), { status: 400 });
      if (p[0].stock < qty) throw Object.assign(new Error(`Only ${p[0].stock} left of ${p[0].name}`), { status: 400 });
      subtotal += Number(p[0].price) * qty; lines.push({ id: p[0].id, qty, price: p[0].price });
    }
    const total = subtotal + delivery(subtotal);
    const addr = `${fullName}, ${phone}, ${address}, ${city} - ${pincode}`;
    const [o] = await conn.execute('INSERT INTO orders (user_id, total_amount, address, status) VALUES (?,?,?,?)',
      [req.user.id, total, addr, 'Placed']);
    for (const l of lines) {
      await conn.execute('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?,?,?,?)', [o.insertId, l.id, l.qty, l.price]);
      await conn.execute('UPDATE products SET stock = stock - ? WHERE id = ?', [l.qty, l.id]);
    }
    await conn.commit();
    res.status(201).json({ orderId: o.insertId, total });
  } catch (e) {
    await conn.rollback();
    res.status(e.status || 500).json({ message: e.status ? e.message : 'Could not place order' });
    if (!e.status) console.error(e);
  } finally { conn.release(); }
};
const attachItems = async (orders) => {
  if (!orders.length) return orders;
  const [items] = await db.query(
    `SELECT oi.order_id, oi.product_id, oi.quantity, oi.price, p.name, p.image
     FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id IN (?)`, [orders.map((o) => o.id)]);
  return orders.map((o) => ({ ...o, items: items.filter((i) => i.order_id === o.id) }));
};
exports.list = async (req, res) => {
  const [o] = await db.execute('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
  res.json(await attachItems(o));
};
exports.get = async (req, res) => {
  const [o] = await db.execute('SELECT * FROM orders WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  if (!o.length) return res.status(404).json({ message: 'Order not found' });
  res.json((await attachItems(o))[0]);
};
