// src/pages/ServicePage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ServicePage.css";

export default function ServicePage() {
  const { id } = useParams(); // service id from route
  const navigate = useNavigate(); // for programmatic navigation
  const [service, setService] = useState(null);
  const [message, setMessage] = useState("");

  const API_BASE = "http://127.0.0.1:8000/api";
  const token = localStorage.getItem("token");

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  // Booking form state
  const [booking, setBooking] = useState({
    services_id: id,
    user_id: "",
    booking_time: "",
    status: "",
    payment_status: "",
  });

  // Review form state
  const [review, setReview] = useState({
    services_id: id,
    rating: "",
    comment: "",
  });

  // Fetch service details
  useEffect(() => {
    axios
      .get(`${API_BASE}/service/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        if (res.data.success) {
          setService(res.data.service);
        } else {
          setMessage("❌ Failed to load service");
        }
      })
      .catch(() => setMessage("❌ Failed to load service"));
  }, [id, token]);

  // Input handlers
  const handleBookingChange = (e) =>
    setBooking({ ...booking, [e.target.name]: e.target.value });
  const handleReviewChange = (e) =>
    setReview({ ...review, [e.target.name]: e.target.value });

  // Helper to send requests with token
  const authHeaders = () => ({
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  // Submit booking
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!token) {
      setMessage("❌ Please login first.");
      navigate("/login");
      return;
    }

    axios
      .post(`${API_BASE}/addBookings`, booking, authHeaders())
      .then((res) => {
        if (res.data.success) {
          setMessage("✅ Booking completed successfully!");
          setBooking({
            services_id: id,
            user_id: "",
            booking_time: "",
            status: "",
            payment_status: "",
          });
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          setMessage("❌ Unauthorized. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setMessage("❌ Booking failed");
        }
      });
  };

  // Submit review
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!token) {
      setMessage("❌ Please login first.");
      navigate("/login");
      return;
    }

    axios
      .post(`${API_BASE}/addReview`, review, authHeaders())
      .then((res) => {
        if (res.data.success) {
          setMessage("✅ Review submitted!");
          setReview({ services_id: id, rating: "", comment: "" });
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          setMessage("❌ Unauthorized. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setMessage("❌ Review failed");
        }
      });
  };

  // Navigate to payment page
  const handlePayment = () => {
    if (!token) {
      setMessage("❌ Please login first.");
      navigate("/login");
      return;
    }
    navigate(`/payment/${booking.services_id}`);
  };

  if (!service) return <p>Loading service...</p>;

  return (
    <div className="container">
      {message && <p className="message">{message}</p>}

      {/* Left column */}
      <div className="left-column">
        <img
          src={
            service.profile_picture
              ? `http://127.0.0.1:8000/storage/${service.profile_picture}`
              : `http://127.0.0.1:8000/storage/default.jpeg`
          }
          alt="Profile"
        />
        <h3><strong>User ID:</strong> {service.user_id}</h3>
        <h3><strong>Services ID:</strong> {service.services_id}</h3>
        <h3><strong>Name:</strong> {service.name}</h3>
        <h3><strong>Category:</strong> {service.category}</h3>
        <h3><strong>Location:</strong> {service.location}</h3>
        <h3><strong>Price:</strong> {service.price} Tk</h3>
        <h3><strong>Available Time:</strong> {service.available_time}</h3>
      </div>

      {/* Right column */}
      <div className="right-column">
        {/* Booking Form */}
        <div className="form-container">
          <h2>Booking</h2>
          <form onSubmit={handleBookingSubmit}>
            <div className="input-wrapper">
              <label>Services Id</label>
              <input type="number" value={id} name="services_id" readOnly />
            </div>
            <div className="input-wrapper">
              <label>User ID</label>
              <input
                type="number"
                name="user_id"
                value={booking.user_id}
                onChange={handleBookingChange}
              />
            </div>
            <div className="input-wrapper">
              <label>Booking time</label>
              <input
                type="text"
                name="booking_time"
                value={booking.booking_time}
                onChange={handleBookingChange}
              />
            </div>
            <div className="input-wrapper">
              <label>Status</label>
              <input
                type="text"
                name="status"
                value={booking.status}
                onChange={handleBookingChange}
              />
            </div>
            <div className="input-wrapper">
              <label>Payment Status</label>
              <input
                type="text"
                name="payment_status"
                value={booking.payment_status}
                onChange={handleBookingChange}
              />
            </div>
            <button type="submit">Book</button>
          </form>
        </div>

        {/* Review Form */}
        <div className="form-container">
          <h2>Submit Review</h2>
          <form onSubmit={handleReviewSubmit}>
            <div className="input-wrapper">
              <label>Service ID</label>
              <input type="number" value={id} name="services_id" readOnly />
            </div>
            <div className="input-wrapper">
              <label>Rating (out of 5)</label>
              <input
                type="number"
                min="1"
                max="5"
                name="rating"
                value={review.rating}
                onChange={handleReviewChange}
              />
            </div>
            <div className="input-wrapper">
              <label>Comment</label>
              <textarea
                name="comment"
                value={review.comment}
                onChange={handleReviewChange}
              ></textarea>
            </div>
            <button type="submit">Submit Review</button>
          </form>
        </div>

        {/* Payment Section */}
        <div className="form-container">
          <h2>Payment</h2>
          <p>Is your booking confirmed?</p>
          <button
            type="button"
            className="payment-btn"
            onClick={handlePayment}
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}
