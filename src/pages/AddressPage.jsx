import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import '../styles/AddressPage.css';
import Navbar1 from "./Navbar1";

const AddressPage = () => {
    const navigate = useNavigate(); // ✅ Initialize navigate
    const userId = localStorage.getItem('user_id');
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [newAddress, setNewAddress] = useState({ street: '', city: '', state: '', zipCode: '', country: 'India' });
    const [isEditing, setIsEditing] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState(null);

    useEffect(() => {
        fetchAddresses();
        const storedAddressId = localStorage.getItem('address_id');
        if (storedAddressId) {
            setSelectedAddress(addresses.find(addr => addr.id === storedAddressId) || null);
        }
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/addresses/user/${userId}`);
            setAddresses(response.data);
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    };

    const addAddress = async () => {
        try {
            await axios.post(`http://localhost:8080/api/addresses/${userId}`, newAddress);
            fetchAddresses();
            resetForm();
        } catch (error) {
            console.error("Error adding address:", error);
        }
    };

    const updateAddress = async () => {
        if (!editingAddressId) return;
        try {
            await axios.put(`http://localhost:8080/api/addresses/${editingAddressId}`, newAddress);
            fetchAddresses();
            resetForm();
        } catch (error) {
            console.error("Error updating address:", error);
        }
    };

    const deleteAddress = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/addresses/${id}`);
            if (selectedAddress?.id === id) {
                setSelectedAddress(null);
                localStorage.removeItem('selected_address_id');
            }
            fetchAddresses();
        } catch (error) {
            console.error("Error deleting address:", error);
        }
    };

    const placeOrder = async () => {
        const addressId = localStorage.getItem('address_id');
        const userId = localStorage.getItem('user_id');

        if (!addressId || !userId) {
            alert('User or Address information is missing.');
            return;
        }

        if (!selectedAddress || !paymentMethod) {
            alert('Please select an address and a payment method.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/orders/place/${userId}/${addressId}`, {
                method: "POST",
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Order placed successfully:", data);
                navigate('/orderplaced'); // ✅ Redirect to success page
            } else if (response.status === 404) {
                alert('User or cart not found.');
            } else {
                alert('Something went wrong while placing the order.');
            }
        } catch (error) {
            console.error("Error placing order:", error);
            alert('Error placing order. Please try again.');
        }
    };

    const resetForm = () => {
        setNewAddress({ street: '', city: '', state: '', zipCode: '', country: 'India' });
        setIsEditing(false);
        setEditingAddressId(null);
    };

    const handleEdit = (address) => {
        setNewAddress(address);
        setIsEditing(true);
        setEditingAddressId(address.id);
    };

    const handleAddressSelect = (address) => {
        setSelectedAddress(address);
        localStorage.setItem('address_id', address.id);
    };

    return (
        <div className="address-page">
            <div className='navvvv'><Navbar1 /></div>

            <h1 className="page-titleeee">Checkout - Address & Payment</h1>

            {/* Select Address Section */}
            <div className="section">
                <h2>📍 Select Address</h2>
                {addresses.length > 0 ? (
                    addresses.map((address) => (
                        <div key={address.id} className="address-card">
                            <input
                                type="radio"
                                name="address"
                                value={address.id}
                                checked={selectedAddress?.id === address.id}
                                onChange={() => handleAddressSelect(address)}
                            />
                            <label>
                                {`${address.street}, ${address.city}, ${address.state} - ${address.zipCode}, ${address.country}`}
                            </label>
                            <div className="address-actions">
                                <button className="edit-btn" onClick={() => handleEdit(address)}>✏️ Edit</button>
                                <button className="delete-btn" onClick={() => deleteAddress(address.id)}>🗑️ Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No saved addresses found. Please add a new address.</p>
                )}
            </div>

            {/* Add / Edit Address Section */}
            <div className="section">
                <h2>{isEditing ? '✏️ Update Address' : '➕ Add New Address'}</h2>
                <div className="address-form">
                    <input type="text" placeholder="Street" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} />
                    <input type="text" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                    <input type="text" placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
                    <input type="text" placeholder="Zip Code" value={newAddress.zipCode} onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })} />
                    <select value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}>
                        <option value="India">India</option>
                    </select>
                    <button className="submit-btn" onClick={isEditing ? updateAddress : addAddress}>
                        {isEditing ? 'Update Address' : 'Add Address'}
                    </button>
                </div>
            </div>

            {/* Payment Options Section */}
            <div className="section">
                <h2>💳 Payment Options</h2>
                <div className="payment-options">
                    {["creditCard", "debitCard", "netBanking", "cod"].map((method) => (
                        <label key={method} className="payment-option">
                            <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                            {method === "creditCard" ? "💳 Credit Card" : method === "debitCard" ? "🏦 Debit Card" : method === "netBanking" ? "🌐 Net Banking" : "💰 Cash on Delivery (COD)"}
                        </label>
                    ))}
                </div>
            </div>

            {/* Place Order Button */}
            <button className="place-order-button" onClick={placeOrder}>🛒 Place Order</button>
        </div>
    );
};

export default AddressPage;
