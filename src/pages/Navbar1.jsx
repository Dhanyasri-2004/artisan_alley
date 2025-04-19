import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import "../styles/Navbar1.css";

const Navbar1 = ({ onSelectCategory, onSearchResults }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [allProductsWithImages, setAllProductsWithImages] = useState([]);
  const searchRef = useRef(null);
  const categoryRef = useRef(null);

  // Fetch all products and extract unique categories
  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/api/products");
        
        // Process products to include image URLs
        const productsWithImages = await Promise.all(
          data.map(async (product) => {
            try {
              // Create a base64 data URL from the imageData if available
              if (product.imageData) {
                const imageUrl = `data:${product.imageType || 'image/jpeg'};base64,${product.imageData}`;
                return { ...product, imageUrl };
              } else {
                // Otherwise fetch the image from the endpoint
                const { data: imageBlob } = await axios.get(
                  `http://localhost:8080/api/product/${product.id}/image`,
                  { responseType: "blob" }
                );
                const imageUrl = URL.createObjectURL(imageBlob);
                return { ...product, imageUrl };
              }
            } catch (error) {
              console.error(`Error processing image for product ID: ${product.id}`, error);
              return { ...product, imageUrl: "/images/placeholder.png" };
            }
          })
        );
        
        setAllProductsWithImages(productsWithImages);
        
        // Extract unique categories from products
        const uniqueCategories = [...new Set(data.map(product => product.category))].filter(Boolean).sort();
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProductsAndCategories();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setCategoryDropdown(false);
      }
      if (!event.target.closest('.nav-profile')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleProfileDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleCategoryDropdown = (e) => {
    e.stopPropagation();
    setCategoryDropdown(!categoryDropdown);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleSearchChange = (value) => {
    setSearchInput(value);
    if (value.trim().length > 0) {
      // Enhanced search functionality - filter products by name, brand, category, description, and price
      const searchTerm = value.toLowerCase();
      const filteredProducts = allProductsWithImages.filter(product => {
        // Search in text fields
        const matchesText = 
          product.name.toLowerCase().includes(searchTerm) ||
          product.brand.toLowerCase().includes(searchTerm) || 
          product.category.toLowerCase().includes(searchTerm) ||
          (product.description && product.description.toLowerCase().includes(searchTerm));
        
        // Search by price - check if search term is a number that matches the price
        const isNumeric = !isNaN(searchTerm) && !isNaN(parseFloat(searchTerm));
        const matchesPrice = isNumeric && product.price.toString().includes(searchTerm);
        
        return matchesText || matchesPrice;
      });
      
      setSearchResults(filteredProducts);
      setShowSearchResults(true);
      setNoResults(filteredProducts.length === 0);
      // Pass the filtered products with their image URLs to the parent component
      onSearchResults?.(filteredProducts);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
      setNoResults(false);
      // Reset to show all products with their image URLs
      onSearchResults?.(allProductsWithImages);
    }
  };

  const handleSearchClick = () => {
    if (searchInput.trim() !== "") {
      // Enhanced search functionality for search button click
      const searchTerm = searchInput.toLowerCase();
      const filteredProducts = allProductsWithImages.filter(product => {
        // Search in text fields
        const matchesText = 
          product.name.toLowerCase().includes(searchTerm) ||
          product.brand.toLowerCase().includes(searchTerm) || 
          product.category.toLowerCase().includes(searchTerm) ||
          (product.description && product.description.toLowerCase().includes(searchTerm));
        
        // Search by price - check if search term is a number that matches the price
        const isNumeric = !isNaN(searchTerm) && !isNaN(parseFloat(searchTerm));
        const matchesPrice = isNumeric && product.price.toString().includes(searchTerm);
        
        return matchesText || matchesPrice;
      });
      
      setSearchResults(filteredProducts);
      setNoResults(filteredProducts.length === 0);
      // Pass the filtered products with their image URLs to the parent component
      onSearchResults?.(filteredProducts);
      setShowSearchResults(false); // Hide dropdown after search
    }
  };

  const handleCategorySelect = (category) => {
    setCategoryDropdown(false);
    
    if (category === "All") {
      // Show all products when "All" is selected
      onSelectCategory?.(null);
      onSearchResults?.(allProductsWithImages);
      return;
    }
    
    // Filter products by selected category
    const filteredProducts = allProductsWithImages.filter(product => 
      product.category === category
    );
    
    // Update category in parent component
    onSelectCategory?.(category);
    
    // Pass the filtered products with their image URLs to the parent component
    onSearchResults?.(filteredProducts);
    
    // Clear search input when selecting a category
    setSearchInput("");
    setShowSearchResults(false);
  };

  const handleProductSelect = (product) => {
    setShowSearchResults(false);
    setSearchInput(product.name);
  };

  const handleAllProductsClick = () => {
    // Show all products
    onSelectCategory?.(null);
    onSearchResults?.(allProductsWithImages);
    setCategoryDropdown(false);
    setSearchInput("");
  };

  return (
    <nav className="nav-containerrr">
      {/* Left Section - Logo */}
      <div className="nav-left">
        <img src="/images/logo.png" alt="Artisan Alley Logo" className="nav-logo" />
        <span className="nav-brand">Indiart</span>
      </div>

      <div className="nav-search" ref={searchRef}>
        <div className="nav-search-wrapper">
          <input
            type="text"
            placeholder="Search for products, brands, descriptions or price..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="nav-search-input"
            onFocus={() => {
              if (searchInput.trim() !== "" && searchResults.length > 0) {
                setShowSearchResults(true);
              }
            }}
          />
          <FaSearch className="search-icon" onClick={handleSearchClick} />
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && (
          <ul className="nav-search-results">
            {searchResults.length > 0 ? (
              searchResults.slice(0, 5).map((product) => (
                <li key={product.id} className="nav-search-result-item" onClick={() => handleProductSelect(product)}>
                  <Link to={`/product2/${product.id}`} className="nav-search-result-link">
                    <div className="search-product-info">
                      <span className="product-name">{product.name}</span>
                      <span className="product-category">{product.category}</span>
                      <span className="product-description">{product.description?.substring(0, 30)}{product.description?.length > 30 ? '...' : ''}</span>
                    </div>
                    <span className="product-price">₹{product.price}</span>
                  </Link>
                </li>
              ))
            ) : (
              noResults && <li className="nav-no-results">No product found</li>
            )}
            {searchResults.length > 5 && (
              <li className="nav-show-more" onClick={handleSearchClick}>
                Show all {searchResults.length} results
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Right Section - Links & Dropdowns */}
      <ul className="nav-right">
        <li><Link to="/user" className="nav-link">Home</Link></li>
        <li><Link to="/productspage1" className="nav-link">Products</Link></li>
        <li ref={categoryRef}>
          <button onClick={toggleCategoryDropdown} className="nav-link category-toggle-btn">
            Categories ▼
          </button>
          {categoryDropdown && (
            <ul className="nav-category-dropdown">
              <li onClick={handleAllProductsClick} className="nav-category-item">
                All Products
              </li>
              {categories.map((cat, idx) => (
                <li key={idx} onClick={() => handleCategorySelect(cat)} className="nav-category-item">
                  {cat}
                </li>
              ))}
            </ul>
          )}
        </li>
        <li>
          <Link to="/cart" className="nav-icon" aria-label="Cart">
            <FaShoppingCart className="nav-cart-icon" />
          </Link>
        </li>
        <li className="nav-profile" onClick={(e) => e.stopPropagation()}>
          <FaUser className="nav-profile-iconnn" onClick={toggleProfileDropdown} />
          {isDropdownOpen && (
            <div className="nav-dropdownnn">
              <Link to="/userorders" className="nav-dropdown-itemmm">Your Orders</Link>
              <button onClick={handleLogout} className="nav-dropdown-itemmm">Logout</button>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar1;