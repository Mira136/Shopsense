import { CATEGORIES } from '../utils/format';
export default function ProductFilter({ filters, setFilters }) {
  const set = (k) => (e) => setFilters({ ...filters, [k]: e.target.value });
  return (
    <div className="ss-filter row g-2 mb-4">
      <div className="col-6 col-md-3"><select className="form-select" value={filters.category} onChange={set('category')}>
        <option value="">All categories</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
      <div className="col-6 col-md-3"><select className="form-select" value={filters.maxPrice} onChange={set('maxPrice')}>
        <option value="">Any price</option><option value="1000">Under ₹1,000</option><option value="3000">Under ₹3,000</option><option value="5000">Under ₹5,000</option></select></div>
      <div className="col-6 col-md-3"><select className="form-select" value={filters.minRating} onChange={set('minRating')}>
        <option value="">Any rating</option><option value="4">4★ & up</option><option value="4.5">4.5★ & up</option></select></div>
      <div className="col-6 col-md-3"><select className="form-select" value={filters.sort} onChange={set('sort')}>
        <option value="">Sort by</option><option value="low">Price: Low → High</option><option value="high">Price: High → Low</option><option value="rating">Rating</option></select></div>
    </div>
  );
}
