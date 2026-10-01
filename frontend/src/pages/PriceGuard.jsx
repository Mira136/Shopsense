import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PriceGuardCard from '../components/PriceGuardCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../components/Toast';
import { errMsg } from '../utils/format';
export default function PriceGuard() {
  const [list, setList] = useState(null); const [error, setError] = useState(''); const toast = useToast();
  const load = useCallback(() => api.get('/price-guard').then((r) => setList(r.data)).catch((e) => setError(errMsg(e))), []);
  useEffect(() => { load(); }, [load]);
  const remove = async (pid) => { try { await api.delete(`/price-guard/${pid}`); toast('Removed from Price Guard'); load(); } catch (e) { toast(errMsg(e), 'error'); } };
  if (error) return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>;
  if (!list) return <LoadingSpinner />;
  return (
    <div className="container py-4" style={{ maxWidth: 820 }}>
      <div className="d-flex justify-content-between align-items-center"><h2 className="ss-h">🛡 Price Guard</h2><button className="btn btn-outline-primary btn-sm" onClick={load}>Refresh</button></div>
      {list.length ? list.map((i) => <PriceGuardCard key={i.id} item={i} onRemove={remove} />)
        : <div className="ss-empty">No products guarded yet. Open a product and tap “Add to Price Guard”. <Link to="/products">Browse</Link></div>}
    </div>
  );
}
