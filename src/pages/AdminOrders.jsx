import React, { useEffect, useState } from 'react';
import '../styles/AdminOrders.css';
import Sidebar from "../pages/Sidebar";

const AdminOrders = () => {
  const [ordersByUser, setOrdersByUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorUsers, setErrorUsers] = useState([]);

  const getUserOrders = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/user/${userId}`);
      if (!response.ok) throw new Error(`User ${userId} not found`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(`Error fetching orders for user ${userId}:`, err);
      throw err;
    }
  };

  const loadAllOrders = async () => {
    const userOrders = {};
    const failedUserIds = [];

    for (let userId = 1; userId <= 30; userId++) {
      try {
        const orders = await getUserOrders(userId);
        if (orders && orders.length > 0) {
          userOrders[userId] = orders;
        }
      } catch {
        failedUserIds.push(userId);
      }
    }

    setOrdersByUser(userOrders);
    setErrorUsers(failedUserIds);
    setLoading(false);
  };

  const updateOrderStatus = async (orderId, status, userId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/${orderId}/status/${status}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert(`Order ${orderId} status updated to ${status}`);
        const updatedOrders = await getUserOrders(userId);
        setOrdersByUser((prev) => ({ ...prev, [userId]: updatedOrders }));
      } else {
        throw new Error('Failed to update order status');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    loadAllOrders();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="admin-container">
      <Sidebar className="sidebar" />

      <div className="orders-container">
        <h1 className="title">🛒 Admin Panel - All User Orders</h1>

        {loading ? (
          <p className="loading">Loading all user orders...</p>
        ) : Object.keys(ordersByUser).length === 0 ? (
          <p className="no-orders">❌ No orders found for any users.</p>
        ) : (
          Object.entries(ordersByUser).map(([userId, orders]) => (
            <div key={userId} className="user-block">
              <h2 className="user-title">👤 User ID: {userId}</h2>
              {orders.map((order) => {
                const {
                  orderId = 'N/A',
                  orderDate = null,
                  status = 'PENDING',
                  totalAmount = 0,
                  address = 'N/A'
                } = order;

                return (
                  <div className="order-card" key={orderId}>
                    <div className="order-details">
                      <p><strong>Order ID:</strong> #{orderId}</p>
                      <p><strong>Order Date:</strong> {formatDate(orderDate)}</p>
                      <p><strong>Total Amount:</strong> ₹{totalAmount.toFixed(2)}</p>
                      <p><strong>Address:</strong> {address}</p>
                      <p><strong>Status:</strong>{status}</p>
                      <select
                        className="status-dropdown"
                        value={status}
                        onChange={(e) => updateOrderStatus(orderId, e.target.value, userId)}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="SHIPPED">SHIPPED</option>
                       
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}

        {errorUsers.length > 0 && (
          <div className="error-msg">
            <p>⚠️ Could not retrieve data for user IDs: {errorUsers.join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
