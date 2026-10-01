import { Link } from 'react-router-dom';
import { Grid } from './Home';
import { useWishlist } from '../context/WishlistContext';
export default function Wishlist() {
  const { items } = useWishlist();
  return (
    <div className="container py-4"><h2 className="ss-h">Your wishlist</h2>
      {items.length ? <Grid list={items} /> : <div className="ss-empty">Nothing saved yet. <Link to="/products">Find something you like</Link></div>}
    </div>
  );
}
