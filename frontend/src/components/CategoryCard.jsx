import { Link } from 'react-router-dom';
const ICONS = { Electronics: '🎧', Fashion: '👟', Beauty: '🧴', Home: '🏠', Accessories: '🎒' };
export default function CategoryCard({ name }) {
  return <Link to={`/products?category=${name}`} className="ss-cat"><span>{ICONS[name]}</span>{name}</Link>;
}
