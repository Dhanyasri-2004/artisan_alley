// src/pages/OrderPlaced.jsx

import React, { useEffect, useState } from 'react';
import { CheckCircle, Package, Truck } from 'lucide-react';
import '../styles/OrderPlaced.css'; // Import the CSS file

function OrderPlaced() {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  return (
    <div className="container">
      <div className="card">
        {/* Success Icon Animation */}
        <div className={`success-icon ${showAnimation ? 'scale-up' : 'scale-down'}`}>
          <div className="relative">
            <div className="absolute inset-0 animate-ping bg-green-100 rounded-full" style={{ animationDuration: '2s' }}></div>
            <CheckCircle className="w-20 h-20 text-green-500 relative" />
          </div>
        </div>

        {/* Success Message */}
        <div className={`success-message ${showAnimation ? 'visible' : 'hidden'}`}>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">Thank you for your purchase. Your order is being processed.</p>
        </div>

        {/* Order Details */}
        <div className={`order-details ${showAnimation ? 'visible' : 'hidden'}`}>
          {/* Order ID */}
          <div className="order-id">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-semibold text-gray-800">#ORD-2024-1234</p>
          </div>

          {/* Order Timeline */}
          <div className="timeline">
            <div className="timeline-line"></div>
            
            <div className="timeline-item">
              <div className="timeline-icon">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div className="timeline-content">
                <p className="font-medium text-gray-800">Order Confirmed</p>
                <p className="text-sm text-gray-500">We've received your order</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-icon">
                <Package className="w-6 h-6 text-blue-500" />
              </div>
              <div className="timeline-content">
                <p className="font-medium text-gray-800">Processing</p>
                <p className="text-sm text-gray-500">Your order is being prepared</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-icon">
                <Truck className="w-6 h-6 text-gray-400" />
              </div>
              <div className="timeline-content">
                <p className="font-medium text-gray-800">Shipping</p>
                <p className="text-sm text-gray-500">Your order will be shipped soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Shopping Button */}
        <div className="button">
          <button 
            className="continue-shopping"
            onClick={() => window.location.href = '/user'}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderPlaced;
