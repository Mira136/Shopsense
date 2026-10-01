import { Link } from 'react-router-dom';
import { FALLBACK_IMG, inr } from '../utils/format';
export default function PriceGuardCard({ item, onRemove }) {
  const dropped = item.status === 'dropped';
  return (
    <div className={`ss-pg ${dropped ? 'drop' : ''}`}>
      <img src={item.image} alt="" onError={(e) => { e.target.src = FALLBACK_IMG; }} />
      <div className="flex-grow-1">
        <Link to={`/products/${item.product_id}`} className="fw-semibold">🛡 {item.name}</Link>
        <div className="text-muted small">Saved Price: {inr(item.saved_price)}</div>
        <div>Current Price: <b>{inr(item.current_price)}</b></div>
        {dropped && <div className="ss-drop">🎉 PRICE DROP DETECTED — You can save {inr(item.difference)}.</div>}
        {item.status === 'increased' && <div className="text-danger small">Price increased by {inr(-item.difference)}</div>}
        {item.status === 'same' && <div className="text-muted small">No price change yet</div>}
      </div>
      {onRemove && <button className="btn btn-outline-secondary btn-sm align-self-start" onClick={() => onRemove(item.product_id)}>Remove</button>}
    </div>
  );
}
