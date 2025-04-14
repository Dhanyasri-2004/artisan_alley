import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Product1.css";
import Sidebar from "../pages/Sidebar";
import axios from "../axios";


const Product1 = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/product/${id}`);
        setProduct(response.data);
        if (response.data.imageName) {
          fetchImage();
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    const fetchImage = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/product/${id}/image`, { responseType: "blob" });
        setImageUrl(URL.createObjectURL(response.data));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product image:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/product/${id}`);
      
      // Create notification for successful deletion
      const notification = document.createElement('div');
      notification.className = 'product-notification success';
      notification.innerHTML = `
        <div class="notification-content">
          <div class="notification-icon">✓</div>
          <div class="notification-message">Product deleted successfully</div>
        </div>
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
          notification.classList.remove('show');
          setTimeout(() => {
            document.body.removeChild(notification);
            navigate("/products");
          }, 300);
        }, 3000);
      }, 100);
      
      // Remove from cart if present
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const updatedCartItems = cartItems.filter(item => item.id !== id);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      
    } catch (error) {
      console.error("Error deleting product:", error);
      
      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'product-notification error';
      notification.innerHTML = `
        <div class="notification-content">
          <div class="notification-icon">✕</div>
          <div class="notification-message">Failed to delete product.</div>
        </div>
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
          notification.classList.remove('show');
          setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
      }, 100);
    }
  };

  const handleEditClick = () => {
    navigate(`/product1/update/${id}`);
  };

  if (loading) {
    return <h2 className="text-center" style={{ padding: "10rem" }}>Loading...</h2>;
  }

  if (!product) {
    return <h2 className="text-center" style={{ padding: "10rem" }}>Product not found</h2>;
  }

  // Check if product is available based on stock quantity
  const isProductAvailable = product && product.productAvailable && product.stockQuantity > 0;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="product2-container">
        <div className="product2-card">
          {/* Left Column - Image */}
          <div className="product2-image">
            <img src={imageUrl} alt={product.imageName || "Product image"} />
            {isProductAvailable ? (
              <div className="product-badge in-stock">In Stock</div>
            ) : (
              <div className="product-badge out-of-stock">Out of Stock</div>
            )}
          </div>

          {/* Right Column - Product Details */}
          <div className="product2-details">
            <div>
              <h2 className="product2-title">{product.name}</h2>
              
              {/* Using grid layout for consistent alignment */}
              <div className="product-info-grid">
                <span className="product-info-label">Brand:</span>
                <span className="product-info-value">{product.brand}</span>
                
                <span className="product-info-label">Category:</span>
                <span className="product-info-value">{product.category}</span>
                
                <span className="product-info-label">Description:</span>
                <span className="product-info-value">{product.description}</span>
                
                <span className="product-info-label">Stock Available:</span>
                <span className="product-info-value">{product.stockQuantity}</span>
              </div>
              
              <div className="product2-price">
                <span className="price-label">Price:</span>
                <span className="price-value">₹{product.price}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="product2-actions">
              <button className="btn1" onClick={handleEditClick}>Update</button>
              <button className="btn2" onClick={deleteProduct}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product1;