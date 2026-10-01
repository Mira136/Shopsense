import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import RecommendationModal from '../components/RecommendationModal';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../components/Toast';
import { FALLBACK_IMG, errMsg, inr } from '../utils/format';

export default function ProductDetails() {
  const { id } = useParams(); const nav = useNavigate();
  const { user } = useAuth(); const { addToCart, cartItems } = useCart(); const { has, toggle } = useWishlist(); const toast = useToast();
  const [p, setP] = useState(null); const [error, setError] = useState(''); const [qty, setQty] = useState(1);
  const [modal, setModal] = useState(false); const [reasons, setReasons] = useState([]); const [rLoading, setRLoading] = useState(false);
  useEffect(() => { setP(null); api.get(`/products/${id}`).then((r) => setP(r.data)).catch((e) => setError(errMsg(e))); }, [id]);

  const why = async () => {
    setModal(true); setRLoading(true);
    try {
      const cart = [...new Set(cartItems.map((i) => i.category))].join(',');
      setReasons((await api.get(`/products/${id}/recommendation`, { params: { cart } })).data.reasons);
    } catch (e) { setReasons([errMsg(e)]); } finally { setRLoading(false); }
  };
  const guard = async () => {
    if (!user) { toast('Please log in to use Price Guard', 'error'); return nav('/login', { state: { from: `/products/${id}` } }); }
    try { await api.post(`/price-guard/${id}`); toast(`Price Guard on at ${inr(p.price)}`); } catch (e) { toast(errMsg(e), 'error'); }
  };
  if (error) return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>;
  if (!p) return <LoadingSpinner />;
  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-md-6"><img className="ss-detail-img" src={p.image} alt={p.name} onError={(e) => { e.target.src = FALLBACK_IMG; }} /></div>
        <div className="col-md-6">
          <h2>{p.name}</h2>
          <div className="mb-2">⭐ {Number(p.rating).toFixed(1)} · <span className="text-muted">{p.category}</span></div>
          <div className="ss-price fs-2">{inr(p.price)}</div>
          <p className="mt-3">{p.description}</p>
          <div className={p.stock > 0 ? 'text-success' : 'text-danger'}>{p.stock > 0 ? `In stock (${p.stock} available)` : 'Out of stock'}</div>
          <div className="d-flex align-items-center gap-2 my-3">
            <span>Quantity</span>
            <input type="number" min="1" max={p.stock} className="form-control" style={{ width: 90 }} value={qty}
              onChange={(e) => setQty(Math.max(1, Math.min(p.stock || 1, Number(e.target.value) || 1)))} />
          </div>
          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-primary" disabled={p.stock < 1} onClick={() => { addToCart(p, qty); toast('Added to cart'); }}>Add to Cart</button>
            <button className="btn btn-outline-danger" onClick={() => toggle(p.id)}>{has(p.id) ? '♥ In Wishlist' : '♡ Add to Wishlist'}</button>
            <button className="btn btn-outline-primary" onClick={why}>✨ Why This Product?</button>
            <button className="btn btn-outline-dark" onClick={guard}>🛡 Add to Price Guard</button>
          </div>
        </div>
      </div>
      {modal && <RecommendationModal reasons={reasons} loading={rLoading} onClose={() => setModal(false)} />}
    </div>
  );
}
