import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/DeleteServices.css";

const ServiceSkeleton = () => (
  <li className="service-item skeleton">
    <div className="service-info">
      <div className="skeleton-text" style={{width: '120px'}}></div>
      <div className="skeleton-text" style={{width: '80px', marginTop: '8px'}}></div>
    </div>
    <div className="skeleton-btn"></div>
  </li>
);

const DeleteMyServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get JWT auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch services created by the logged-in user
  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:8000/api/my-services",
        { headers: getAuthHeaders() }
      );
      setServices(res.data.data || []);
    } catch (err) {
      console.error("Fetch user services failed:", err);
      alert("Failed to fetch your services");
    } finally {
      setLoading(false);
    }
  };

  // Delete a service (provider or admin)
  const deleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    // Detect admin vs provider
    const adminToken = localStorage.getItem("admin_token");
    const isAdmin = !!adminToken;
    const url = isAdmin
      ? `http://localhost:8000/api/admin/services/${id}`
      : `http://localhost:8000/api/services/${id}`;
    const headers = isAdmin
      ? { Authorization: `Bearer ${adminToken}` }
      : getAuthHeaders();

    try {
      await axios.delete(url, { headers });
      setServices((prev) => prev.filter((s) => s.services_id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete service");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="delete-services-container">
      <h1>
        <span role="img" aria-label="services" style={{marginRight: '10px'}}>🛠️</span>
        My Services
      </h1>
      <div className="services-card">
        {loading ? (
          <ul className="services-list">
            {[...Array(3)].map((_, i) => <ServiceSkeleton key={i} />)}
          </ul>
        ) : services.length === 0 ? (
          <div className="empty-state">
            <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="No services" className="empty-img" />
            <p>You have not created any services yet.</p>
          </div>
        ) : (
          <ul className="services-list">
            {services.map((service) => (
              <li key={service.services_id} className="service-item">
                <div className="service-info">
                  <strong className="service-name">{service.name}</strong>
                  <span className="service-location">{service.location}</span>
                </div>
                <button
                  className="delete-btn"
                  title="Delete this service"
                  onClick={() => deleteService(service.services_id)}
                >
                  <span role="img" aria-label="delete">🗑️</span> Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DeleteMyServices;
