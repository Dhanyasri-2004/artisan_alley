import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link
import "../styles/Cart.css";
import Navbar1 from "./Navbar1";
const getUserCart = async () => {
  const userId = localStorage.getItem("user_id");
  if (!userId) throw new Error("User  ID not found in localStorage");

  try {
    const response = await fetch(`http://localhost:8080/api/cart/users/${userId}/cart`);
    if (!response.ok) throw new Error("Failed to fetch cart");
    return response.json();
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

const updateCartProduct = async (cartId, productId, quantity) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/cart/carts/${cartId}/products/${productId}/quantity/${quantity}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  } catch (error) {
    console.error("Error updating product quantity:", error);
    throw error;
  }
};

const deleteProductFromCart = async (cartId, productId) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/cart/carts/${cartId}/product/${productId}`,
      {
        method: "DELETE",
      }
    );
    return response.text();
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cart = await getUserCart();
        setCartItems(
          cart.product.map((item) => ({
            ...item,
            quantity: item.quantity || 1,
            total: (item.quantity || 1) * item.price,
          })) || []
        );
        setCartId(cart.cartId || null);
      } catch (error) {
        setCartItems([]); // Reset cart on failure
      }
    };

    fetchCart();
  }, []); // Removed unnecessary dependency warning

  const handleQuantityChange = async (productId, amount) => {
    const updatedItems = cartItems.map((item) =>
      item.id === productId
        ? {
            ...item,
            quantity: Math.max(1, item.quantity + amount),
            total: Math.max(1, item.quantity + amount) * item.price,
          }
        : item
    );
    setCartItems(updatedItems);
    const item = updatedItems.find((item) => item.id === productId);
    if (cartId && item) {
      try {
        await updateCartProduct(cartId, productId, item.quantity);
        // Store product details in local storage
        localStorage.setItem(
          `cart_item_${productId}`,
          JSON.stringify({
            product_id: productId,
            quantity: item.quantity,
            product_price: item.price,
          })
        );
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    }
  };

  const handleRemove = async (productId) => {
    if (cartId) {
      try {
        await deleteProductFromCart(cartId, productId);
        setCartItems(cartItems.filter((item) => item.id !== productId));
        // Remove product details from local storage
        localStorage.removeItem(`cart_item_${productId}`);
      } catch (error) {
        console.error("Error removing product:", error);
      }
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.total, 0);
  };

  return (
    <div className="cart-container">
            <div className="divv">
            <Navbar1 />
              </div>
      <h2 className="cart-title">🛍️ Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={`/images/${item.imageName}`}
                alt={item.name}
                className="cart-item-image"
                onError={(e) =>
                  (e.target.src = `${process.env.PUBLIC_URL}/images/default.jpg`)
                }
              />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p className="price">₹{item.total.toLocaleString()}</p>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, -1)}
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button className="remove-btn" onClick={() => handleRemove(item.id)}>
                ❌ Remove
              </button>
            </div>
          ))}
          <div className="cart-total">
            <h3>Total: ₹{getTotalPrice().toLocaleString()}</h3>
            <Link to="/addresspage" style={{ textDecoration: 'none' }}> {/* Add inline style to remove underline */}
              <button className="checkout-btnnn">Proceed to Checkout</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;