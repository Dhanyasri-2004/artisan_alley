import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import Navbar from './pages/Navbar';
import './App.css';

const Home = lazy(() => import('./pages/Home'));
const UserOrders = lazy(() => import('./pages/UserOrders'));
const Artisans = lazy(() => import('./pages/Artisans'));
const AdminOrders = lazy(() => import('./pages/AdminOrders'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Signup1 = lazy(() => import('./pages/Signup1'));
const DashboardArtisan = lazy(() => import('./pages/DashboardArtisan'));
const DashboardUser = lazy(() => import('./pages/DashboardUser'));
const ArtisanSummaryPage = lazy(() => import('./pages/ArtisanSummaryPage'));
const AttendancePage = lazy(() => import('./pages/AttendancePage'));
const MainLayout = lazy(() => import('./MainLayout'));
const ProductsPage1 = lazy(() => import('./pages/ProductsPage1'));
const Products = lazy(() => import('./pages/Products'));
const ProductsPage2 = lazy(() => import('./pages/ProductsPage2'));
const Product1 = lazy(() => import('./pages/Product1'));
const Product2 = lazy(() => import('./pages/Product2'));
const AddProduct = lazy(() => import('./pages/AddProduct'));
const UpdateProduct = lazy(() => import('./pages/UpdateProduct'));
const Cart = lazy(() => import('./pages/Cart'));
const OrderPlaced = lazy(() => import('./pages/OrderPlaced'));
const Categories = lazy(() => import('./pages/Categories'));
const AddressPage = lazy(() => import('./pages/AddressPage'));

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const location = useLocation();

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <>
      {location.pathname.startsWith('/products') && (
        <Navbar onSelectCategory={handleCategorySelect} />
      )}

      <Suspense fallback={<div>Loading...</div>}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup1" element={<Signup1 />} />
            <Route path="/admin" element={<MainLayout />} />
            <Route path="/user" element={<DashboardUser />} />
            <Route path="/artisan" element={<DashboardArtisan />} />
            <Route path="/products" element={<Products selectedCategory={selectedCategory} />} />
            <Route path="/productspage2" element={<ProductsPage2 selectedCategory={selectedCategory} />} />
            <Route path="/productsPage1" element={<ProductsPage1 />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/product1/update/:id" element={<UpdateProduct />} />
            <Route path="/product1" element={<Product1 />} />
            <Route path="/product1/:id" element={<Product1 />} />
            <Route path="/product2/update/:id" element={<UpdateProduct />} />
            <Route path="/product2" element={<Product2 />} />
            <Route path="/product2/:id" element={<Product2 />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orderplaced" element={<OrderPlaced />} />
            <Route path="/addresspage" element={<AddressPage />} />
            <Route path="/adminorders" element={<AdminOrders />} />
            <Route path="/userorders" element={<UserOrders />} />
            <Route path="/artisans" element={<Artisans />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/artisanSummaryPage" element={<ArtisanSummaryPage />} />
            <Route path="/attendancePage" element={<AttendancePage />} />
          </Routes>
        </ErrorBoundary>
      </Suspense>
    </>
  );
}

export default App;
