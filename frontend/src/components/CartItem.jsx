import { useCart } from '../context/CartContext';
import { FALLBACK_IMG, inr } from '../utils/format';
export default function CartItem({ item }) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();
  return (
    <div className="ss-cart-item">
      <img src={item.image} alt="" onError={(e) => { e.target.src = FALLBACK_IMG; }} />
      <div className="flex-grow-1">
        <div className="fw-semibold">{item.name}</div><div className="small text-muted">{item.category} · {inr(item.price)}</div>
        <div className="btn-group btn-group-sm mt-2">
          <button className="btn btn-outline-secondary" onClick={() => decreaseQuantity(item.id)}>−</button>
          <span className="btn btn-light disabled">{item.quantity}</span>
          <button className="btn btn-outline-secondary" onClick={() => increaseQuantity(item.id)}>+</button>
        </div>
      </div>
      <div className="text-end"><div className="fw-bold">{inr(item.price * item.quantity)}</div>
        <button className="btn btn-link btn-sm text-danger p-0" onClick={() => removeFromCart(item.id)}>Remove</button></div>
    </div>
  );
}
