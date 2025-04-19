import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ProductPage1.css";
import Navbar1 from "./Navbar1";

const ProductsPage1 = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initial fetch of all products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("http://localhost:8080/api/products");
        
        // Process products to include image URLs
        const productsWithImages = await Promise.all(
          data.map(async (product, index) => {
            try {
              // Check if imageData is already available in the API response
              if (product.imageData) {
                const imageUrl = `data:${product.imageType || 'image/jpeg'};base64,${product.imageData}`;
                // Add animation delay for staggered effect
                const animationDelay = `${index * 0.1}s`;
                return { ...product, imageUrl, animationDelay, isNew: Math.random() > 0.7 };
              } else {
                // Fallback to fetching image if imageData is not in API response
                const { data: imageBlob } = await axios.get(
                  `http://localhost:8080/api/product/${product.id}/image`,
                  { responseType: "blob" }
                );
                const imageUrl = URL.createObjectURL(imageBlob);
                const animationDelay = `${index * 0.1}s`;
                return { ...product, imageUrl, animationDelay, isNew: Math.random() > 0.7 };
              }
            } catch (error) {
              console.error(`Error fetching image for product ID: ${product.id}`, error);
              return { 
                ...product, 
                imageUrl: "/images/placeholder.png", 
                animationDelay: `${index * 0.1}s`, 
                isNew: Math.random() > 0.7 
              };
            }
          })
        );
        
        setFilteredProducts(productsWithImages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    if (!product.productAvailable || product.stockQuantity === 0) {
      alert("This product is out of stock!");
      return;
    }

    const userId = localStorage.getItem("user_id");
    const cartId = 1;
    const quantity = 1;
    const totalPrice = product.price * quantity;

    try {
      await axios.post(
        `http://localhost:8080/api/cart/users/${userId}/cart/products/${product.id}/quantity/${quantity}`,
        {
          cart_id: cartId,
          user_id: userId,
          total_price: totalPrice,
        }
      );

      alert("Product added to cart successfully!");

      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const existingItemIndex = cartItems.findIndex((item) => item.id === product.id);

      if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
          total_price: totalPrice,
          imageUrl: product.imageUrl,
        });
      }

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error.message);
      alert("Failed to add product to cart.");
    }
  };

  // This function receives the selected category from Navbar
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // This function receives products with images already attached from Navbar component
  const handleSearchResults = (results) => {
    setFilteredProducts(results);
  };

  if (loading) {
    return <div className="loading-state">Loading products...</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  return (
    <div className="boutique-page-wrapper">
      <div className="top-header">
        <Navbar1 
          onSelectCategory={handleCategorySelect} 
          onSearchResults={handleSearchResults} 
        />
      </div>

      <div className="boutique-products-showcase">
        {/* Display category title or products heading */}
        <h2 className="boutique-section-title">
          {selectedCategory ? `${selectedCategory} Products` : "All Products"}
          {filteredProducts.length > 0 && (
            <span className="product-total"> ({filteredProducts.length} items)</span>
          )}
        </h2>

        {filteredProducts.length === 0 ? (
          <div className="boutique-empty-container">
            <h3 className="boutique-empty-state">No Products Available</h3>
            {selectedCategory && (
              <p className="empty-message">
                There are no products available in the "{selectedCategory}" category.
              </p>
            )}
          </div>
        ) : (
          <div className="boutique-products-grid">
            {filteredProducts.map((product) => {
              const {
                id,
                brand,
                name,
                price,
                imageUrl,
                productAvailable,
                stockQuantity,
                animationDelay,
                isNew
              } = product;
              const isOutOfStock = !productAvailable || stockQuantity === 0;

              return (
                <div
                  className={`boutique-product-item ${isOutOfStock ? "sold-out" : ""} ${isNew ? "new-item" : ""}`}
                  key={id}
                  style={{ animationDelay }}
                >
                  {/* Clicking image or title goes to individual product page */}
                  <div
                    className="boutique-product-clickable"
                    onClick={() => navigate(`/product2/${id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={imageUrl}
                      alt={name}
                      className="boutique-product-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/placeholder.png";
                      }}
                    />
                    <div className="boutique-product-details">
                      <h5 className="boutique-product-name">
                        {name.toUpperCase()}
                      </h5>
                      <i className="boutique-product-maker">~ {brand}</i>
                      <h5 className="boutique-product-cost">₹{price}</h5>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    className="boutique-cart-button"
                    onClick={() => handleAddToCart(product)}
                    disabled={isOutOfStock}
                  >
                    {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="contact-footer">
        <p>© 2025 Indiart. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default ProductsPage1;