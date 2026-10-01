import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { errMsg, inr } from '../utils/format';

const Items = ({ items }) => items.map((i) => (
  <div key={i.product_id} className="d-flex justify-content-between small py-1"><Link to={`/products/${i.product_id}`}>{i.name} × {i.quantity}</Link><span>{inr(i.price * i.quantity)}</span></div>));
const date = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export function Orders() {
  const [list, setList] = useState(null); const [error, setError] = useState('');
  useEffect(() => { api.get('/orders').then((r) => setList(r.data)).catch((e) => setError(errMsg(e))); }, []);
  if (error) return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>;
  if (!list) return <LoadingSpinner />;
  return (
    <div className="container py-4"><h2 className="ss-h">My orders</h2>
      {!list.length && <div className="ss-empty">No orders yet. <Link to="/products">Start shopping</Link></div>}
      {list.map((o) => (
        <div key={o.id} className="ss-panel mb-3">
          <div className="d-flex justify-content-between flex-wrap"><b>Order #{o.id}</b><span className="badge bg-success">{o.status}</span></div>
          <div className="small text-muted mb-2">{date(o.created_at)}</div><Items items={o.items} />
          <hr className="my-2" /><div className="d-flex justify-content-between"><b>Total {inr(o.total_amount)}</b><Link to={`/orders/${o.id}`}>Details</Link></div>
        </div>))}
    </div>
  );
}
export function OrderDetails() {
  const { id } = useParams(); const [o, setO] = useState(null); const [error, setError] = useState('');
  useEffect(() => { api.get(`/orders/${id}`).then((r) => setO(r.data)).catch((e) => setError(errMsg(e))); }, [id]);
  if (error) return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>;
  if (!o) return <LoadingSpinner />;
  return (
    <div className="container py-4" style={{ maxWidth: 720 }}><h2 className="ss-h">Order #{o.id}</h2>
      <div className="ss-panel">
        <div className="d-flex justify-content-between"><span>{date(o.created_at)}</span><span className="badge bg-success">{o.status}</span></div>
        <hr /><Items items={o.items} /><hr />
        <div className="d-flex justify-content-between fw-bold"><span>Total</span><span>{inr(o.total_amount)}</span></div>
        <div className="small text-muted mt-3">Delivering to: {o.address}</div>
      </div>
      <Link to="/orders" className="btn btn-link mt-2">← All orders</Link>
    </div>
  );
}
