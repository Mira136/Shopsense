require('dotenv').config();
const fs = require('fs'); const path = require('path');
const mysql = require('mysql2/promise'); const bcrypt = require('bcryptjs');
const img = (s) => `https://picsum.photos/seed/${s}/600/600`;
const products = [
 ['Wireless Headphones','Over-ear Bluetooth headphones with 30-hour battery and deep bass.',2999,'Electronics',4.7,25,'headphones,audio,wireless,music'],
 ['Smart Watch','Fitness smartwatch with heart-rate, sleep tracking and AMOLED display.',4999,'Electronics',4.4,18,'watch,fitness,wearable'],
 ['Bluetooth Speaker','Portable waterproof speaker with 12-hour playtime.',1999,'Electronics',4.6,30,'speaker,audio,portable,music'],
 ['Running Shoes','Lightweight breathable running shoes with cushioned sole.',3499,'Fashion',4.3,40,'shoes,running,sports'],
 ['Premium Backpack','Water-resistant 25L backpack with padded laptop compartment.',2499,'Accessories',4.5,22,'bag,backpack,travel'],
 ['Smartphone Stand','Adjustable aluminium phone stand for desk and video calls.',499,'Accessories',4.2,60,'phone,stand,desk'],
 ['Mechanical Keyboard','Hot-swappable mechanical keyboard with RGB backlight.',3999,'Electronics',4.6,15,'keyboard,typing,gaming'],
 ['LED Desk Lamp','Dimmable LED lamp with touch control and USB charging port.',1299,'Home',4.1,35,'lamp,light,desk,study'],
 ['Face Wash','Gentle daily gel face wash with aloe and vitamin E.',349,'Beauty',4.0,80,'skincare,face,cleanser'],
 ['Casual T-Shirt','Soft 100% cotton regular-fit t-shirt.',799,'Fashion',4.2,70,'tshirt,cotton,casual'],
 ['Travel Water Bottle','Insulated stainless steel bottle, keeps drinks cold for 24 hours.',599,'Home',4.4,50,'bottle,travel,steel'],
 ['Laptop Sleeve','Padded 15-inch laptop sleeve with extra pocket.',899,'Accessories',4.3,45,'laptop,sleeve,protection']];
(async () => {
  const c = await mysql.createConnection({ host: process.env.DB_HOST || 'localhost', user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '', multipleStatements: true });
  await c.query(fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8'));
  await c.query(`USE ${process.env.DB_NAME || 'shopsense'}`);
  for (const [name, d, price, cat, rating, stock, tags] of products) {
    const [ex] = await c.execute('SELECT id FROM products WHERE name = ?', [name]);
    if (ex.length) await c.execute('UPDATE products SET price = ?, stock = ? WHERE id = ?', [price, stock, ex[0].id]);
    else await c.execute('INSERT INTO products (name,description,price,category,image,rating,stock,tags) VALUES (?,?,?,?,?,?,?,?)',
      [name, d, price, cat, img(name.replace(/\s+/g, '-').toLowerCase()), rating, stock, tags]);
  }
  const [u] = await c.execute('SELECT id FROM users WHERE email = ?', ['demo@shopsense.com']);
  let uid = u[0]?.id;
  if (!uid) { const [r] = await c.execute('INSERT INTO users (name,email,password) VALUES (?,?,?)',
    ['Demo User', 'demo@shopsense.com', await bcrypt.hash('Demo@123', 10)]); uid = r.insertId; }
  // Demo wishlist item so "Matches your shopping interests" shows up
  await c.execute("INSERT IGNORE INTO wishlist (user_id, product_id) SELECT ?, id FROM products WHERE name = 'Bluetooth Speaker'", [uid]);
  console.log('Seed complete: demo user + 12 products'); await c.end();
})().catch((e) => { console.error('Seed failed:', e.message); process.exit(1); });
