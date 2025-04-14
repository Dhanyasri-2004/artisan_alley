import React, { useEffect, useState } from "react";
import "../styles/UserOrders.css";
import { MapPin, Calendar, Truck, Package } from "lucide-react";
import Navbar1 from "./Navbar1";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    
    if (!userId) {
      console.error("User ID missing from localStorage.");
      return;
    }
    
    fetch(`http://localhost:8080/api/orders/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Orders:", data); // Debug log
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error("Unexpected response:", data);
        }
      })
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);
  
  return (
    <div className="user-orders-container">
      <Navbar1 />
      <h1 className="orders-title">My Orders</h1>
      
      {orders.length === 0 ? (
        <p className="no-orders-msg">You haven't placed any orders yet.</p>
      ) : (
        <div className="orders-wrapper">
          {orders.map((order) => (
            <div className="order-box" key={order.orderId}>
              <div className="order-header">
                <div className="order-info">
                  <Package size={18} />
                  <span>Order ID: #{order.orderId}</span>
                </div>
                <div className={`order-status ${order.status?.toLowerCase()}`}>
                  <Truck size={16} />
                  <span>{order.status || "PENDING"}</span>
                </div>
              </div>
              
              <div className="items-section">
                {order.orderItems?.length > 0 ? (
                  order.orderItems.map((item, index) => (
                    <div key={index} className="item">
                      <div className="item-name">{item.productName}</div>
                      <div className="item-meta">
                        Qty: {item.quantity} | Price: ₹{item.price}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-items">No items in this order</p>
                )}
              </div>
              
              <div className="meta-section">
                <div className="order-date">
                  <Calendar size={16} />
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleDateString()
                    : "N/A"}
                </div>
                <div className="order-address">
                  <MapPin size={16} />
                  {order.address || "N/A"}
                </div>
                <div className="order-total">
                  <strong>
                    Total: ₹{order.totalAmount?.toFixed(2) || "0.00"}
                  </strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;