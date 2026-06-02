import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import ProductManager from './components/admin/ProductManager';
import OrderPipeline from './components/admin/OrderPipeline';
import Inbox from './components/admin/Inbox';
import Home from './pages/storefront/Home';
import ProductDetail from './pages/storefront/ProductDetail';
import Checkout from './pages/storefront/Checkout';
import CartDrawer from './components/storefront/CartDrawer';

import ShopAll from './pages/storefront/ShopAll';

function App() {
  return (
    <Router>
      <CartDrawer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop/all" element={<ShopAll />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route path="/admin" element={<Navigate to="/admin/products" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="products" element={<ProductManager />} />
                <Route path="orders" element={<OrderPipeline />} />
                <Route path="inbox" element={<Inbox />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
