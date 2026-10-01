export default function RecommendationModal({ reasons, loading, onClose }) {
  return (
    <div className="ss-modal-bg" onClick={onClose}>
      <div className="ss-modal" onClick={(e) => e.stopPropagation()}>
        <h4>✨ Why this product?</h4>
        {loading ? <div className="text-center py-3"><div className="spinner-border text-primary" /></div>
          : reasons.map((r) => <div key={r} className="ss-reason">✓ {r}</div>)}
        <button className="btn btn-primary w-100 mt-3" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
