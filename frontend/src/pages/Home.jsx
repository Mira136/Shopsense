import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import PriceGuardCard from '../components/PriceGuardCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, errMsg } from '../utils/format';

export const Grid = ({ list }) => <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">{list.map((p) => <div className="col" key={p.id}><ProductCard product={p} /></div>)}</div>;

export default function Home() {
  const { user } = useAuth();
  const [products, setProducts] = useState(null); const [error, setError] = useState('');
  const [drops, setDrops] = useState([]);
  useEffect(() => { api.get('/products').then((r) => setProducts(r.data)).catch((e) => setError(errMsg(e))); }, []);
  useEffect(() => { if (user) api.get('/price-guard').then((r) => setDrops(r.data.filter((d) => d.status === 'dropped'))).catch(() => {}); else setDrops([]); }, [user]);
  const recommended = products ? [...products].sort((a, b) => b.rating - a.rating).slice(0, 4) : [];
  const trending = products ? [...products].sort((a, b) => b.stock - a.stock).slice(0, 4) : [];
  return (
    <>
      <section className="ss-hero"><div className="container">
        <h1>Smart Shopping, Made Personal</h1>
        <p>Discover products that match your interests, budget and shopping behavior.</p>
        <Link to="/products" className="btn btn-light btn-lg me-2">Shop Now</Link>
        <Link to="/price-guard" className="btn btn-outline-light btn-lg">Explore Price Guard</Link>
      </div></section>
      <div className="container py-5">
        <h3 id="categories" className="ss-h">Shop by category</h3>
        <div className="ss-cats mb-5">{CATEGORIES.map((c) => <CategoryCard key={c} name={c} />)}</div>
        {error && <div className="alert alert-danger">{error} — is the backend running on port 5000?</div>}
        {!products && !error ? <LoadingSpinner /> : products && (<>
          <h3 className="ss-h">Recommended for you</h3><Grid list={recommended} />
          <h3 className="ss-h mt-5">Trending products</h3><Grid list={trending} />
        </>)}
        <h3 className="ss-h mt-5">Price drop alerts</h3>
        {!user ? <div className="ss-empty"><Link to="/login">Log in</Link> to track prices with Price Guard.</div>
          : drops.length ? drops.map((d) => <PriceGuardCard key={d.id} item={d} />)
          : <div className="ss-empty">No price drops yet. Add products to Price Guard from their detail page.</div>}
      </div>
    </>
  );
}
