import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../pages/Sidebar";
import "../styles/Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        setProducts(response.data);
        setIsError(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    navigate("/add-product");
  };

  const handleViewProducts = () => {
    navigate("/productspage2");
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <main className="products-main">
        <div className="products-header">
          <h3 className="products-title">PRODUCTS</h3>
          <div className="button-group">
            <button className="action-button add-product-button" onClick={handleAddProduct}>
              <span className="button-icon">📦</span> Add Product
            </button>
            <button className="action-button view-products-button" onClick={handleViewProducts}>
              <span className="button-icon">🛍️</span> View Products
            </button>
          </div>
        </div>
        
        <div className="products-table-wrapper">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : isError ? (
            <div className="error-container">
              <p className="error-message">Failed to load products. Please try again later.</p>
              <button className="retry-button" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          ) : (
            <div className="products-table-container">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="no-products">No Products Available</td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="product-row">
                        <td className="product-id">{product.id}</td>
                        <td className="product-name">{product.name}</td>
                        <td className="product-description">
                          {product.description.length > 100
                            ? `${product.description.substring(0, 100)}...`
                            : product.description}
                        </td>
                        <td className="product-price">₹{product.price.toFixed(2)}</td>
                        <td className="product-status">
                          {!product.productAvailable || product.stockQuantity <= 0 ? (
                            <span className="status-badge out-of-stock">Out of Stock</span>
                          ) : (
                            <span className="status-badge in-stock">In Stock</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Products;