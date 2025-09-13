import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/homepage.css";
import ServiceCard from "../components/ServiceCard";

const HomePage = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
    from: 0,
    to: 0
  });

  const API_BASE = "http://localhost:8000/api";

  // Check login status
  const checkLoginStatus = () => {
    const adminToken = localStorage.getItem("admin_token");
    const userToken = localStorage.getItem("token");
    setIsLoggedIn(!!(adminToken || userToken));
    setIsAdmin(!!adminToken);
  };

  // Headers with JWT
  const getAuthHeaders = () => {
    const adminToken = localStorage.getItem("admin_token");
    const userToken = localStorage.getItem("token");
    const token = adminToken || userToken;
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  // Fetch profile if logged in
  const fetchProfile = () => {
    if (!isLoggedIn) return;
    const endpoint = isAdmin
      ? `${API_BASE}/admin/profile`
      : `${API_BASE}/profile`;

    fetch(endpoint, { headers: getAuthHeaders() })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProfile(isAdmin ? data.admin : data.user);
      })
      .catch((err) => console.error("Failed to fetch profile:", err));
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    fetchServices();
    fetchProfile();
  }, [isLoggedIn, pagination.current_page]);

  // Fetch services with pagination
  const fetchServices = (url = `${API_BASE}/services?per_page=${pagination.per_page}&page=${pagination.current_page}`) => {
    setLoading(true);
    fetch(url, { headers: getAuthHeaders() })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setServices(data.data || []);
        setPagination({
          current_page: data.current_page || 1,
          last_page: data.last_page || 1,
          per_page: data.per_page || 12,
          total: data.total || 0,
          from: data.from || 0,
          to: data.to || 0
        });
      })
      .catch((err) => {
        console.error("Fetch services error:", err);
        setServices([]);
      })
      .finally(() => setLoading(false));
  };

  // Search services
  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`${API_BASE}/search?search=${searchTerm}&per_page=${pagination.per_page}`, {
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.success && data.services) {
          setServices(data.services.data || []);
          setPagination(prev => ({
            ...prev,
            current_page: data.services.current_page || 1,
            last_page: data.services.last_page || 1,
            total: data.services.total || 0
          }));
        } else {
          setServices([]);
          setPagination(prev => ({
            ...prev,
            current_page: 1,
            last_page: 1,
            total: 0
          }));
        }
      })
      .catch((err) => {
        console.error("Search error:", err);
        setServices([]);
        setPagination(prev => ({
          ...prev,
          current_page: 1,
          last_page: 1,
          total: 0
        }));
      })
      .finally(() => setLoading(false));
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      setPagination(prev => ({ ...prev, current_page: page }));
    }
  };

  const handlePrevious = () => {
    handlePageChange(pagination.current_page - 1);
  };

  const handleNext = () => {
    handlePageChange(pagination.current_page + 1);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const current = pagination.current_page;
    const last = pagination.last_page;
    
    // Show first page
    if (current > 3) pages.push(1);
    if (current > 4) pages.push('...');
    
    // Show pages around current
    for (let i = Math.max(1, current - 2); i <= Math.min(last, current + 2); i++) {
      pages.push(i);
    }
    
    // Show last page
    if (current < last - 3) pages.push('...');
    if (current < last - 2) pages.push(last);
    
    return pages;
  };

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Find Perfect Services</h1>
          <p className="hero-subtitle">
            Connect with trusted service providers in your area
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-container">
          <input
            type="text"
            placeholder="Search with job name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            🔍 Search
          </button>
        </form>
      </div>

      {/* Action Buttons */}
      {isLoggedIn && (isAdmin || profile?.is_verified) && (
        <div className="action-section">
          <div className="action-buttons">
            <Link to="/service-form" className="action-btn create-btn">
              ➕ Create Service
            </Link>
            {isAdmin ? (
              <Link to="/delete-service" className="action-btn delete-btn">
                🗑️ Delete All Services
              </Link>
            ) : (
              <Link to="/delete-my-service" className="action-btn delete-btn">
                🗑️ Delete My Services
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Services Section */}
      <div className="services-section">
        <div className="services-container">
          <h2 className="section-title">Available Services</h2>
          <p className="section-subtitle">
            Browse through our wide range of professional services
          </p>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : services.length === 0 ? (
            <div className="no-services-state">
              <div className="no-services-icon">🔍</div>
              <h3 className="no-services">No services found</h3>
              <p className="no-services-subtitle">
                Try adjusting your search terms or check back later
              </p>
            </div>
          ) : (
            <>
              <div className="all-cards-container">
                {services.map((service) =>
                  service.is_booked ? (
                    <div
                      key={service.services_id}
                      className="service-card-link unavailable"
                    >
                      <ServiceCard service={service} />
                      <div className="overlay">Unavailable</div>
                    </div>
                  ) : (
                    <Link
                      to={`/service/${service.services_id}`}
                      key={service.services_id}
                      className="service-card-link"
                    >
                      <ServiceCard service={service} />
                    </Link>
                  )
                )}
              </div>

              {/* Pagination */}
              {pagination.last_page > 1 && (
                <div className="pagination-container">
                  <button
                    onClick={handlePrevious}
                    disabled={pagination.current_page === 1}
                    className={`pagination-btn ${
                      pagination.current_page === 1 ? "disabled" : ""
                    }`}
                  >
                    ← Previous
                  </button>

                  <div className="pagination-info">
                    <span>
                      Showing {pagination.from}-{pagination.to} of {pagination.total} services
                    </span>
                    <div className="page-numbers">
                      {getPageNumbers().map((page, index) =>
                        page === "..." ? (
                          <span key={index} className="page-number">
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`page-number ${
                              page === pagination.current_page ? "active" : ""
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={pagination.current_page === pagination.last_page}
                    className={`pagination-btn ${
                      pagination.current_page === pagination.last_page ? "disabled" : ""
                    }`}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
