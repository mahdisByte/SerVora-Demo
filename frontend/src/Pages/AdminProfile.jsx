import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaShieldAlt, FaEdit } from "react-icons/fa";
import "../Styles/AdminProfile.css";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_BASE = "http://localhost:8000/api";

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin-login");
      return;
    }

    fetch(`${API_BASE}/admin/profile`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (res.status === 401) {
          throw new Error('Unauthorized');
        }
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setAdmin(data.admin);
        } else {
          throw new Error(data.msg || 'Failed to fetch profile');
        }
      })
      .catch(err => {
        console.error("Failed to fetch admin profile:", err);
        localStorage.removeItem("admin_token");
        navigate("/admin-login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="admin-profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="admin-profile-container">
        <div className="error-message">
          <p>Could not load admin profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-profile-container">
      <div className="admin-profile-header">
        <h1>Admin Profile</h1>
        <p>Manage your administrative account</p>
      </div>

      <div className="admin-profile-card">
        <div className="profile-avatar">
          <div className="avatar-placeholder">
            <FaUser />
          </div>
        </div>

        <div className="profile-info">
          <div className="info-item">
            <div className="info-icon">
              <FaUser />
            </div>
            <div className="info-content">
              <label>Full Name</label>
              <span>{admin.name}</span>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <FaEnvelope />
            </div>
            <div className="info-content">
              <label>Email Address</label>
              <span>{admin.email}</span>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <FaShieldAlt />
            </div>
            <div className="info-content">
              <label>Role</label>
              <span className="admin-badge">Administrator</span>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="edit-profile-btn">
            <FaEdit />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
