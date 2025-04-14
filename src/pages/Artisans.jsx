import React, { useEffect, useState } from "react";
import "../styles/Artisans.css";
import Sidebar from "../pages/Sidebar";
import { User, Hammer, Search, Filter } from "lucide-react";

const Artisans = () => {
  const [artisans, setArtisans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:8080/api/artisan/artisans")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setArtisans(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching artisans:", err);
        setIsLoading(false);
      });
  }, []);

  const filteredArtisans = artisans.filter((artisan) => 
    (artisan.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (artisan.skill || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-artisan-container">
      <Sidebar />
      <div className="admin-artisan-content">
        <h1 className="admin-artisan-title">
          All Registered Artisans
        </h1>
        
        <div className="admin-artisan-controls">
          <div className="admin-search-box">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search artisans by name or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="admin-stats">
            <div className="admin-stat-card">
              <User size={20} />
              <span>{artisans.length}</span>
              <p>Total Artisans</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="admin-loading">
            <div className="admin-spinner"></div>
            <p>Loading artisans...</p>
          </div>
        ) : filteredArtisans.length > 0 ? (
          <div className="admin-artisan-table-container">
            <table className="admin-artisan-table">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Username</th>
                  <th>ID</th>
                  <th>Skill</th>
                </tr>
              </thead>
              <tbody>
                {filteredArtisans.map((artisan) => (
                  <tr key={artisan.id} className="admin-artisan-row">
                    <td>
                      <div className="admin-artisan-avatar">
                        {(artisan.username || "").charAt(0).toUpperCase()}
                      </div>
                    </td>
                    <td className="admin-artisan-name">{artisan.username || "Unnamed"}</td>
                    <td>{artisan.id}</td>
                    <td>
                      <span className="admin-artisan-skill">
                        <Hammer size={16} />
                        {artisan.skill || "Not specified"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-no-results">
            <Filter size={48} />
            <h3>No artisans found</h3>
            <p>Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Artisans;