import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/DashboardUser.css";
import "../styles/ProductPage.css";

const ProductsPage2 = ({ selectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("http://localhost:8080/api/products");
        
        const productsWithImages = await Promise.all(
          data.map(async (product) => {
            try {
              if (product.imageData) {
                const imageUrl = `data:${product.imageType || 'image/jpeg'};base64,${product.imageData}`;
                return { ...product, imageUrl };
              } else {
                const response = await axios.get(
                  `http://localhost:8080/api/product/${product.id}/image`,
                  { responseType: "blob" }
                );
                const imageUrl = URL.createObjectURL(response.data);
                return { ...product, imageUrl };
              }
            } catch (error) {
              console.error(`Error fetching image for product ID: ${product.id}`, error);
              return { ...product, imageUrl: "placeholder-image-url" };
            }
          })
        );
        
        setProducts(productsWithImages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Something went wrong...");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (product, e) => {
    if (e) e.preventDefault();
    
    if (!product.productAvailable) {
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

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  if (loading) {
    return <div className="loading-state">Loading products...</div>;
  }

  if (error) {
    return <h2 className="artisan-error-message">{error}</h2>;
  }

  return (
    <div className="products-page-container">
      {filteredProducts.length === 0 ? (
        <h2 className="no-products-message">No Products Available</h2>
      ) : (
        <div className="products-grid-container">
          {filteredProducts.map((product) => {
            const { id, brand, name, price, productAvailable, imageUrl } = product;
            return (
              <div
                className={`product-item-card ${!productAvailable ? "product-out-of-stock" : ""}`}
                key={id}
              >
                <Link to={`/product1/${id}`} className="product-item-link">
                  <img 
                    src={imageUrl} 
                    alt={name} 
                    className="product-item-image" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/placeholder.png";
                    }}
                  />
                  <div className="product-item-details">
                    <h5 className="product-item-name">{name.toUpperCase()}</h5>
                    <i className="product-item-brand">{"~ " + brand}</i>
                    <h5 className="product-item-price">{"₹ " + price}</h5>
                    <button
                      className="product-cart-button"
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product, e);
                      }}
                      disabled={!productAvailable}
                    >
                      {productAvailable ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}

      <div className="product-page-footer">
        <p>© 2025 Indiart. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default ProductsPage2;