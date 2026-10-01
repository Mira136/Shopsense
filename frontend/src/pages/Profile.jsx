import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Profile() {
  const { user, logout } = useAuth(); const nav = useNavigate();
  return (
    <div className="container py-5" style={{ maxWidth: 520 }}><div className="ss-panel">
      <h3>{user.name}</h3><div className="text-muted mb-3">{user.email}</div>
      <div className="d-flex flex-wrap gap-2"><Link to="/orders" className="btn btn-outline-primary">My orders</Link><Link to="/wishlist" className="btn btn-outline-primary">Wishlist</Link>
        <Link to="/price-guard" className="btn btn-outline-primary">Price Guard</Link>
        <button className="btn btn-danger ms-auto" onClick={() => { logout(); nav('/'); }}>Logout</button></div>
    </div></div>
  );
}
