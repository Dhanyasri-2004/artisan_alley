import React, { useEffect, useState } from "react";
import "../styles/Categories.css";
import Sidebar from "../pages/Sidebar";
import { 
  Layers, 
  Search, 
  Tag, 
  Package, 
  TrendingUp, 
  AlertCircle 
} from "lucide-react";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8080/api/products");
      
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      
      const products = await response.json();
      
      // Extract unique categories
      const uniqueCategories = [...new Set(products.map(product => product.category))];
      
      // Create category objects with counts
      const categoryData = uniqueCategories.map(category => {
        const productsInCategory = products.filter(product => product.category === category);
        return {
          name: category,
          count: productsInCategory.length,
          totalValue: productsInCategory.reduce((sum, product) => sum + product.price, 0).toFixed(2)
        };
      });
      
      setCategories(categoryData);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate a random color from a predefined palette
  const getCategoryColor = (name) => {
    const colors = [
      "var(--category-blue)", 
      "var(--category-purple)", 
      "var(--category-green)", 
      "var(--category-orange)",
      "var(--category-pink)"
    ];
    
    // Use the name to generate a consistent color
    const charSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charSum % colors.length];
  };

  return (
    <div className="admin-categories-container">
      <Sidebar />
      
      <div className="admin-categories-content">
        <div className="admin-categories-header">
          <h1><Layers size={24} /> Product Categories</h1>

        </div>

        <div className="admin-categories-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Tag />
            </div>
            <div className="admin-stat-details">
              <h3>{categories.length}</h3>
              <p>Total Categories</p>
            </div>
          </div>
          
          <div className="admin-stat-card">
            <div className="admin-stat-icon">
              <Package />
            </div>
            <div className="admin-stat-details">
              <h3>{categories.reduce((sum, cat) => sum + cat.count, 0)}</h3>
              <p>Total Products</p>
            </div>
          </div>
        </div>

        <div className="admin-categories-search">
          <div className="search-container">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="admin-categories-loading">
            <div className="spinner"></div>
            <p>Loading categories...</p>
          </div>
        ) : error ? (
          <div className="admin-categories-error">
            <AlertCircle size={48} />
            <h3>Failed to load categories</h3>
            <p>{error}</p>
          </div>
        ) : (
          <div className="admin-categories-grid">
            {filteredCategories.map((category, index) => (
              <div 
                className="admin-category-card" 
                key={index}
                style={{ "--category-color": getCategoryColor(category.name) }}
              >
                <div className="admin-category-header">
                  <h2>{category.name}</h2>
                  <div className="admin-category-icon">
                    <Tag />
                  </div>
                </div>
                <div className="admin-category-details">
                  <div className="admin-category-stat">
                    <span className="value">{category.count}</span>
                    <span className="label">Products</span>
                  </div>
                  <div className="admin-category-stat">
                    <span className="value">${category.totalValue}</span>
                    <span className="label">Total Value</span>
                  </div>
                </div>
                <div className="admin-category-growth">
                  <TrendingUp size={16} />
                  <span>Active</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!isLoading && !error && filteredCategories.length === 0 && (
          <div className="admin-no-categories">
            <AlertCircle size={48} />
            <h3>No categories found</h3>
            <p>Try adjusting your search or add a new category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;