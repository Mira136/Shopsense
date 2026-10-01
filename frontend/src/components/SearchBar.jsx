import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function SearchBar({ onDone }) {
  const [q, setQ] = useState(''); const nav = useNavigate();
  const submit = (e) => { e.preventDefault(); if (q.trim()) { nav(`/search?q=${encodeURIComponent(q.trim())}`); onDone?.(); } };
  return (
    <form onSubmit={submit} className="d-flex w-100">
      <input className="form-control" placeholder="Search products..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
      <button className="btn btn-primary ms-2" type="submit">Search</button>
    </form>
  );
}
