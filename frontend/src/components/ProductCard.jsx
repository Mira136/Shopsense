import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from './Toast';
import { FALLBACK_IMG, inr } from '../utils/format';
export default function ProductCard({ product: p }) {
  const { addToCart } = useCart(); const { has, toggle } = useWishlist(); const toast = useToast();
  return (
    <div className="ss-card h-100">
      <Link to={`/products/${p.id}`} className="ss-card-link">
        <img src={p.image} alt={p.name} onError={(e) => { e.target.src = FALLBACK_IMG; }} />
        <div className="p-3 pb-0">
          <div className="small text-muted">{p.category}</div>
          <div className="fw-semibold">{p.name}</div>
          <div className="d-flex justify-content-between align-items-center mt-1">
            <span>⭐ {Number(p.rating).toFixed(1)}</span><span className="ss-price">{inr(p.price)}</span>
          </div>
        </div>
      </Link>
      <div className="p-3 d-flex gap-2">
        <button className="btn btn-primary flex-grow-1" disabled={p.stock < 1}
          onClick={() => { addToCart(p); toast(`${p.name} added to cart`); }}>{p.stock < 1 ? 'Out of stock' : 'Add to Cart'}</button>
        <button className={`btn ${has(p.id) ? 'btn-danger' : 'btn-outline-danger'}`} aria-label="Wishlist" onClick={() => toggle(p.id)}>{has(p.id) ? '♥' : '♡'}</button>
      </div>
    </div>
  );
}
