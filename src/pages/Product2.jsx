import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../axios";
import Navbar1 from "./Navbar1";
import "../styles/Product2.css";
import { ShoppingCart, ArrowLeft, Star } from "lucide-react";

const Product2 = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
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
        const response = await axios.get(
          `http://localhost:8080/api/product/${id}/image`,
          { responseType: "blob" }
        );
        setImageUrl(URL.createObjectURL(response.data));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product image:", error);
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  // Check if product is available based on stock quantity
  const isProductAvailable = product && product.productAvailable && product.stockQuantity > 0;
  
  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity > 0 && newQuantity <= (product?.stockQuantity || 1)) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = async () => {
    // Check if product is out of stock
    if (!product || !isProductAvailable) {
      // Show error message for out of stock
      const notification = document.createElement('div');
      notification.className = 'product-notification error';
      notification.innerHTML = `
        <div class="notification-content">
          <div class="notification-icon">✕</div>
          <div class="notification-message">This product is out of stock.</div>
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
      
      return;
    }
    
    const userId = localStorage.getItem("user_id");
    const cartId = 1;
    const totalPrice = product.price * quantity;
    
    try {
      await axios.post(
        `http://localhost:8080/api/cart/users/${userId}/cart/products/${product.id}/quantity/${quantity}`,
        {
          cart_id: cartId,
          user_id: userId,
          total_price: totalPrice
        }
      );
      
      // Update local storage
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += quantity;
        cartItems[existingItemIndex].total_price += totalPrice;
      } else {
        cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          total_price: totalPrice,
          imageUrl: imageUrl
        });
      }
      
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      
      // Show success message
      const notification = document.createElement('div');
      notification.className = 'product-notification success';
      notification.innerHTML = `
        <div class="notification-content">
          <div class="notification-icon">✓</div>
          <div class="notification-message">Added to cart successfully!</div>
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
      
    } catch (error) {
      console.error("Error adding product to cart:", error.response ? error.response.data : error.message);
      
      // Show error message
      const notification = document.createElement('div');
      notification.className = 'product-notification error';
      notification.innerHTML = `
        <div class="notification-content">
          <div class="notification-icon">✕</div>
          <div class="notification-message">Failed to add product to cart.</div>
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
  

  if (loading) {
    return (
      <div className="product-loading">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="product-error">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <button className="back-button" onClick={() => window.history.back()}>
          <ArrowLeft size={18} />
          Back to Products
        </button>
      </div>
    );
  }
  
  // Generate random review count and rating for demo purposes
  const reviewCount = Math.floor(Math.random() * 100) + 5;
  const rating = (3.5 + Math.random() * 1.5).toFixed(1);
  
  return (
    <div className="product-container">
      <Navbar1 />
      

      
      <div className="product-content">
        <div className="product-gallery">
          <div className="product-main-image">
            <img src={imageUrl} alt={product.name} />
            {isProductAvailable ? (
              <div className="product-badge in-stock">In Stock</div>
            ) : (
              <div className="product-badge out-of-stock">Out of Stock</div>
            )}
          </div>
        </div>
        
        <div className="product-info">
          <div className="product-header">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-brand">By <span>{product.brand}</span></div>
            
            <div className="product-rating">
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < Math.floor(rating) ? "star filled" : "star"} 
                    fill={i < Math.floor(rating) ? "#FFD700" : "none"} 
                    stroke={i < Math.floor(rating) ? "#FFD700" : "#D1D5DB"}
                  />
                ))}
              </div>
              <span className="rating-value">{rating}</span>
              <span className="rating-count">({reviewCount} reviews)</span>
            </div>
          </div>
          
          <div className="product-price-container">
            <div className="product-price">₹{product.price.toFixed(2)}</div>
            <div className="product-stock">
              <span className="stock-label">Availability:</span>
              {isProductAvailable ? (
                <span className="stock-value">{product.stockQuantity} in stock</span>
              ) : (
                <span className="stock-value out-of-stock">Out of Stock</span>
              )}
            </div>
          </div>
          
          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          
          <div className="product-meta">
            <div className="meta-item">
              <span className="meta-label">Category:</span>
              <span className="meta-value">{product.category}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Listed On:</span>
              <span className="meta-value">{new Date(product.releaseDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
          
          <div className="product-actions">
            {isProductAvailable ? (
              <>
                <div className="quantity-selector">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    min="1"
                    max={product.stockQuantity}
                    readOnly
                    className="quantity-input"
                  />
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stockQuantity}
                  >
                    +
                  </button>
                </div>
                
                <button
                  className="add-to-cart-btn"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                

              </>
            ) : (
              <button className="out-of-stock-btn" disabled>
                Out of Stock
              </button>
            )}
          </div>
          
          <div className="product-features">
            <div className="feature">
              <div className="feature-icon">🚚</div>
              <div className="feature-text">
                <h4>Free Shipping</h4>
                <p>On orders over ₹1000</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <div className="feature-text">
                <h4>Secure Payments</h4>
                <p>Protected by encryption</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">↩️</div>
              <div className="feature-text">
                <h4>Easy Returns</h4>
                <p>30-day money back</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product2;