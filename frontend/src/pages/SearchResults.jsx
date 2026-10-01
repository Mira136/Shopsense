import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Grid } from './Home';
import { errMsg } from '../utils/format';
export default function SearchResults() {
  const [sp] = useSearchParams(); const q = sp.get('q') || '';
  const [list, setList] = useState(null); const [error, setError] = useState('');
  useEffect(() => { setList(null); setError(''); api.get('/products/search', { params: { q } }).then((r) => setList(r.data)).catch((e) => setError(errMsg(e))); }, [q]);
  return (
    <div className="container py-4">
      <h2 className="ss-h">Results for “{q}”</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {!list && !error ? <LoadingSpinner /> : list && (list.length ? <Grid list={list} /> : <div className="ss-empty">No products found. Try “headphones” or “watch”.</div>)}
    </div>
  );
}
