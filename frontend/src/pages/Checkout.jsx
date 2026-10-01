import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Summary } from './Cart';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { errMsg, inr } from '../utils/format';

export default function Checkout() {
  const { user } = useAuth(); const { cartItems, subtotal, delivery, total, clearCart } = useCart();
  const [f, setF] = useState({ fullName: user?.name || '', phone: '', address: '', city: '', pincode: '' });
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false); const [done, setDone] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const place = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try {
      const r = await api.post('/orders', { ...f, items: cartItems.map((i) => ({ productId: i.id, quantity: i.quantity })) });
      clearCart(); setDone(r.data);
    } catch (e2) { setErr(errMsg(e2)); } finally { setBusy(false); }
  };
  if (done) return (
    <div className="container py-5 text-center"><div className="ss-panel mx-auto" style={{ maxWidth: 480 }}>
      <div className="display-4">✅</div><h3>Order Placed Successfully</h3>
      <p>Order ID: <b>#{done.orderId}</b> · Total {inr(done.total)}</p>
      <Link to={`/orders/${done.orderId}`} className="btn btn-primary me-2">View order</Link><Link to="/orders" className="btn btn-outline-primary">My orders</Link>
    </div></div>
  );
  if (!cartItems.length) return <div className="container py-5"><div className="ss-empty">Your cart is empty. <Link to="/products">Browse products</Link></div></div>;
  return (
    <div className="container py-4">
      <h2 className="ss-h">Checkout</h2>
      <form className="row g-4" onSubmit={place}>
        <div className="col-lg-7"><div className="ss-panel">
          {err && <div className="alert alert-danger">{err}</div>}
          <input className="form-control mb-3" placeholder="Full name" value={f.fullName} onChange={set('fullName')} required />
          <input className="form-control mb-3" placeholder="Phone" value={f.phone} onChange={set('phone')} required />
          <textarea className="form-control mb-3" placeholder="Address" rows={3} value={f.address} onChange={set('address')} required />
          <div className="row g-3"><div className="col-6"><input className="form-control" placeholder="City" value={f.city} onChange={set('city')} required /></div>
            <div className="col-6"><input className="form-control" placeholder="Pincode" value={f.pincode} onChange={set('pincode')} required /></div></div>
        </div></div>
        <div className="col-lg-5"><Summary sub={subtotal} del={delivery} total={total} />
          <button className="btn btn-primary w-100 mt-3" disabled={busy}>{busy ? 'Placing order...' : 'Place Order'}</button></div>
      </form>
    </div>
  );
}
