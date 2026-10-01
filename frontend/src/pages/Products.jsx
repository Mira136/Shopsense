import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductFilter from '../components/ProductFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import { Grid } from './Home';
import { errMsg } from '../utils/format';

export default function Products() {
  const [sp] = useSearchParams();
  const [all, setAll] = useState(null); const [error, setError] = useState('');
  const [filters, setFilters] = useState({ category: sp.get('category') || '', maxPrice: '', minRating: '', sort: '' });
  useEffect(() => { setFilters((f) => ({ ...f, category: sp.get('category') || '' })); }, [sp]);
  useEffect(() => { api.get('/products').then((r) => setAll(r.data)).catch((e) => setError(errMsg(e))); }, []);
  let list = all || [];
  if (filters.category) list = list.filter((p) => p.category === filters.category);
  if (filters.maxPrice) list = list.filter((p) => p.price <= Number(filters.maxPrice));
  if (filters.minRating) list = list.filter((p) => p.rating >= Number(filters.minRating));
  if (filters.sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
  if (filters.sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
  if (filters.sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
  return (
    <div className="container py-4">
      <h2 className="ss-h">Products</h2>
      <ProductFilter filters={filters} setFilters={setFilters} />
      {error && <div className="alert alert-danger">{error}</div>}
      {!all && !error ? <LoadingSpinner /> : list.length ? <Grid list={list} /> : <div className="ss-empty">No products match these filters.</div>}
    </div>
  );
}
