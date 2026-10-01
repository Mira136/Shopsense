export default function Footer() {
  return (
    <footer className="ss-footer">
      <div className="container d-flex flex-wrap justify-content-between gap-3">
        <div><div className="ss-logo light">Shop<span>Sense</span></div><div className="small opacity-75">Smart Shopping, Made Personal</div></div>
        <div className="d-flex gap-3 flex-wrap small">{['About', 'Contact', 'Privacy', 'Terms', 'Customer Support'].map((l) => <a key={l} href="#top">{l}</a>)}</div>
      </div>
      <div className="container small opacity-75 mt-3">© 2026 ShopSense</div>
    </footer>
  );
}
