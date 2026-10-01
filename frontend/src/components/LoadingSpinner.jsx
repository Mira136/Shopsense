export default function LoadingSpinner({ text = 'Loading...' }) {
  return <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /><div className="mt-2 text-muted">{text}</div></div>;
}
