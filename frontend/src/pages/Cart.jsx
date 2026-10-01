import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import { inr } from '../utils/format';
export const Summary = ({ sub, del, total }) => (
  <div className="ss-panel">
    <h5>Order summary</h5>
    <div className="d-flex justify-content-between"><span>Subtotal</span><span>{inr(sub)}</span></div>
    <div className="d-flex justify-content-between"><span>Delivery</span><span>{del ? inr(del) : 'Free'}</span></div>
    <hr /><div className="d-flex justify-content-between fw-bold fs-5"><span>Total</span><span>{inr(total)}</span></div>
  </div>
);
export default function Cart() {
  const { cartItems, subtotal, delivery, total, clearCart } = useCart();
  if (!cartItems.length) return <div className="container py-5"><div className="ss-empty">Your cart is empty. <Link to="/products">Browse products</Link></div></div>;
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between"><h2 className="ss-h">Your cart</h2><button className="btn btn-link text-danger" onClick={clearCart}>Clear cart</button></div>
      <div className="row g-4">
        <div className="col-lg-8">{cartItems.map((i) => <CartItem key={i.id} item={i} />)}</div>
        <div className="col-lg-4"><Summary sub={subtotal} del={delivery} total={total} />
          <Link to="/checkout" className="btn btn-primary w-100 mt-3">Proceed to Checkout</Link></div>
      </div>
    </div>
  );
}
