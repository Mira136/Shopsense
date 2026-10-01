# ShopSense — Smart Shopping, Made Personal
React + Vite + Bootstrap frontend, Node/Express API, MySQL, JWT + bcrypt.

## Unique features
1. **✨ Why This Product?** `GET /api/products/:id/recommendation` — rule-based (rating ≥ 4.5, price ≤ ₹3000, category matches wishlist DB items or cart categories sent as `?cart=`). Max 3 reasons; no external AI.
2. **🛡 Price Guard** — saves the price when you start guarding; the list endpoint JOINs live `products.price`, so a `PATCH /api/products/:id/price` instantly shows "PRICE DROP DETECTED".

## Setup (MySQL must be running)
```
cd backend && npm install
# edit .env (copy of .env.example) -> set DB_PASSWORD if your root user has one
npm run seed      # creates DB + tables from database.sql, demo user, 12 products
npm run dev       # http://localhost:5000
cd ../frontend && npm install && npm run dev   # http://localhost:5173
```
Demo login: `demo@shopsense.com` / `Demo@123` (also pre-filled on the login page).

## API
Auth: `POST /api/auth/register|login`, `GET /api/auth/me`
Products: `GET /api/products`, `/products/:id`, `/products/search?q=`, `/products/category/:c`, `PATCH /products/:id/price`, `GET /products/:id/recommendation`
Wishlist / Price Guard (JWT): `GET /`, `POST /:productId`, `DELETE /:productId` under `/api/wishlist` and `/api/price-guard`
Orders (JWT): `POST /api/orders` (MySQL transaction), `GET /api/orders`, `GET /api/orders/:id`

## Price Guard demo
1. Login → search "Wireless Headphones" → open it → "🛡 Add to Price Guard" (saved ₹2,999).
2. Drop the price:
   `curl -X PATCH http://localhost:5000/api/products/1/price -H "Content-Type: application/json" -d "{\"price\":2499}"`
3. Open Price Guard → "🎉 PRICE DROP DETECTED — You can save ₹500." (Re-run `npm run seed` to reset the price to ₹2,999.)

## Why This Product demo
Login as demo (wishlist has Bluetooth Speaker) → Wireless Headphones → click ✨ → 3 reasons incl. "Matches your shopping interests".

## 5-minute demo flow
Login → Home → search → details → ✨ Why → 🛡 Guard → add to cart → checkout → place order → My Orders → Price Guard → curl PATCH → refresh → drop banner.

## 2-minute architecture
React (Router, Context for auth/cart/wishlist/toast) → Axios instance with JWT interceptor → Express routes → controllers → mysql2 pool (parameterized SQL). Cart lives in Context + localStorage; orders use a transaction (row lock on products, stock check, insert order + items, decrement stock). Order totals are recomputed server-side.

## Likely interview questions
- **Why JWT?** Stateless auth; token in localStorage sent via Axios interceptor; verified by middleware.
- **Why bcrypt?** Salted, slow hash; passwords never returned.
- **SQL injection?** All queries use `?` placeholders.
- **Why a transaction for orders?** Order, items and stock must all succeed or all roll back.
- **Why no cart table?** Requirement: cart in Context + localStorage; server revalidates price/stock at checkout.
- **How does Price Guard detect drops?** JOIN with live product price; compare to saved_price.
- **Recommendation logic?** Deterministic rules on rating, price, wishlist/cart categories.
- **Context vs Redux?** App state is small; Context is enough.
- **localStorage XSS risk?** Yes; httpOnly cookies are the production alternative.
- **Scaling?** Indexes on category/name, pagination, cache product list, move cart to DB.

## Troubleshooting
- `ECONNREFUSED`/`Access denied`: start MySQL, fix `DB_PASSWORD` in `backend/.env`.
- Frontend shows "is the backend running": start backend on port 5000.
- Product images use picsum.photos (need internet); a fallback is shown if blocked.
