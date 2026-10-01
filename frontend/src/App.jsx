import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import SearchResults from './pages/SearchResults';
import { Login, Register } from './pages/Auth';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import { Orders, OrderDetails } from './pages/Orders';
import PriceGuard from './pages/PriceGuard';
import Profile from './pages/Profile';

const P = (el) => <ProtectedRoute>{el}</ProtectedRoute>;
export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={P(<Checkout />)} />
          <Route path="/wishlist" element={P(<Wishlist />)} />
          <Route path="/orders" element={P(<Orders />)} />
          <Route path="/orders/:id" element={P(<OrderDetails />)} />
          <Route path="/price-guard" element={P(<PriceGuard />)} />
          <Route path="/profile" element={P(<Profile />)} />
          <Route path="*" element={<div className="container py-5 text-center"><h2>Page not found</h2></div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
