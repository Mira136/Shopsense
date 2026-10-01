import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Navbar() {
  const { user } = useAuth(); const { count } = useCart(); const { items } = useWishlist();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="ss-nav">
      <div className="container d-flex align-items-center flex-wrap gap-2">
        <Link to="/" className="ss-logo" onClick={close}>Shop<span>Sense</span></Link>
        <button className="ss-burger d-lg-none ms-auto" onClick={() => setOpen(!open)} aria-label="Toggle menu">☰</button>
        <nav className={`ss-menu ${open ? 'open' : ''}`} onClick={close}>
          <div className="ss-links">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/products">Products</NavLink>
            <a href="/#categories">Categories</a>
            <NavLink to="/price-guard">Price Guard</NavLink>
          </div>
          <div className="ss-search" onClick={(e) => e.stopPropagation()}><SearchBar onDone={close} /></div>
          <div className="ss-actions">
            <Link to="/wishlist">♡ Wishlist{items.length > 0 && <b className="ss-badge">{items.length}</b>}</Link>
            <Link to="/cart">🛒 Cart{count > 0 && <b className="ss-badge">{count}</b>}</Link>
            {user ? <Link to="/profile">👤 {user.name.split(' ')[0]}</Link> : <Link to="/login" className="btn btn-primary btn-sm">Login</Link>}
          </div>
        </nav>
      </div>
    </header>
  );
}
