import React, { useState, useEffect } from "react";
//import { useNavigate, useLocation } from "react-router-dom";
import {
  Users,
  ShoppingBag,
  Palette,
  DollarSign,
  Clock,
} from "lucide-react";
import "../styles/DashboardAdmin.css";

const DashboardAdmin = () => {
  //const navigate = useNavigate();
  //const location = useLocation();

  const [customerCount, setCustomerCount] = useState(0);
  const [artisanCount, setArtisanCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [artisans, setArtisans] = useState([]);

  // Redirect non-admins to homepage or login
 // useEffect(() => {
   // const role = localStorage.getItem("role");
  //  if (role !== "admin") {
    //  navigate("/login"); // Change as needed
   // } else if (location.pathname !== "/admin") {
     // navigate("/admin", { replace: true });
   // }
 // }, [navigate, location]);

  useEffect(() => {
    fetch("http://localhost:8080/api/user/users")
      .then((res) => res.json())
      .then((data) => setCustomerCount(data.length))
      .catch((err) => console.error("Error fetching customers:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/artisan/artisans")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setArtisanCount(data.length);

          const sortedRecentArtisans = [...data]
            .sort((a, b) => b.id - a.id)
            .slice(0, 4)
            .map((artisan) => ({
              id: artisan.id,
              name: artisan.username || "N/A",
              skill: artisan.skill || "N/A",
            }));

          setArtisans(sortedRecentArtisans);
        }
      })
      .catch((err) => console.error("Error fetching artisans:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProductCount(data.length);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    const fetchAllOrders = async () => {
      let allOrders = [];
      let totalRevenue = 0;

      for (let userId = 1; userId <= 30; userId++) {
        try {
          const res = await fetch(
            `http://localhost:8080/api/orders/user/${userId}`
          );
          if (!res.ok) continue;
          const userOrders = await res.json();
          if (Array.isArray(userOrders)) {
            allOrders = [...allOrders, ...userOrders];
            totalRevenue += userOrders.reduce(
              (sum, order) => sum + (order.totalAmount || 0),
              0
            );
          }
        } catch (err) {
          console.error(`Error fetching orders for user ${userId}:`, err);
        }
      }

      const sortedOrders = allOrders.sort(
        (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
      );
      const topThree = sortedOrders.slice(0, 3);

      setRevenue(`₹${totalRevenue.toFixed(2)}`);
      setRecentOrders(topThree);
    };

    fetchAllOrders();
  }, []);

  const stats = [
    {
      title: "Total Customers",
      value: customerCount !== 0 ? customerCount : "Loading...",
      icon: <Users className="icon blue" />,

      isPositive: true,
    },
    {
      title: "Products",
      value: productCount !== 0 ? productCount : "Loading...",
      icon: <ShoppingBag className="icon purple" />,

      isPositive: true,
    },
    {
      title: "Artisans",
      value: artisanCount !== 0 ? artisanCount : "Loading...",
      icon: <Palette className="icon pink" />,

      isPositive: true,
    },
    {
      title: "Revenue",
      value: revenue,
      icon: <DollarSign className="icon green" />,
 
      isPositive: true,
    },
  ];

  return (
    <div className="dashboard">
      <div className="header">
        <h1 className="title">Dashboard Overview</h1>
        <p className="welcome">Welcome back, Admin!</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <div className="icon-container">{stat.icon}</div>

            </div>
            <h3 className="stat-value">{stat.value}</h3>
            <p className="stat-title">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="content-grid">
        {/* Recent Orders */}
        <div className="orders">
          <div className="orders-header">
            <h2 className="orders-title">Recent Orders</h2>
            <Clock size={20} className="icon gray" />
          </div>
          <div className="orders-list">
            {recentOrders.length > 0 ? (
              recentOrders.map((order, index) => (
                <div key={index} className="order-item">
                  <div>
                    <p className="order-product">{order.productName || "Product"}</p>
                    <span className="order-id">#{order.orderId}</span>
                  </div>
                  <div className="order-price-status">
                    <p className="order-price">₹{order.totalAmount?.toFixed(2)}</p>
                    <span className={`order-status ${order.status?.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>No recent orders found.</p>
            )}
          </div>
        </div>

        {/* Artisans */}
        <div className="artisans">
          <div className="artisans-header">
            <h2 className="artisans-title">Recent Artisans</h2>
            <Palette size={20} className="icon gray" />
          </div>
          <div className="artisans-list">
            {artisans.length > 0 ? (
              artisans.map((artisan, index) => (
                <div key={index} className="artisan-item">
                  <p className="artisan-id">ID: {artisan.id}</p>
                  <p className="artisan-name">Name: {artisan.name}</p>
                  <p className="artisan-skill">Skill: {artisan.skill}</p>
                </div>
              ))
            ) : (
              <p>No artisan data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
