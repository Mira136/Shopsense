export const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
export const errMsg = (e) => e?.response?.data?.message || 'Something went wrong. Please try again.';
export const FALLBACK_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="100%" height="100%" fill="#e8ecf4"/><text x="50%" y="50%" text-anchor="middle" fill="#8a94a8" font-size="28" font-family="sans-serif">ShopSense</text></svg>');
export const CATEGORIES = ['Electronics', 'Fashion', 'Beauty', 'Home', 'Accessories'];
export const deliveryFee = (sub) => (sub > 999 || sub === 0 ? 0 : 49);
