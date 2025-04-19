import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ onSelectCategory }) => {
  const location = useLocation();
  const allowedPaths = ["/admin", "/add-product", "/productspage2"];

  if (!allowedPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <nav className="navbarrrr">
      {/* Left: Logo */}
      <div className="navbar-logo">
        <img src="/images/logo.png" alt="Website Logo" className="navbar-logo-img" />
        <span className="navbar-logo-title">Indiart</span>
      </div>

      {/* Right: Home, Add Product, View Product */}
      <div className="navbar-right">
        <Link to="/admin" className="navbar-link">Home</Link>
        <Link to="/add-product" className="navbar-add-product-btn">+ Add Product</Link>
        <Link to="/productspage2" className="navbar-view-product-btn">View Product</Link>
      </div>
    </nav>
  );
};

export default Navbar;
