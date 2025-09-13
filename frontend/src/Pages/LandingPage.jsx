import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Navigation hook
import "../styles/LandingPage.css";
import bgShapes from "../assets/abstract-shapes.png"; // Make sure this file exists

const LandingPage = () => {
  const navigate = useNavigate(); // ✅ Navigation hook

  return (
    <div className="landing-container">
      {/* Background shapes */}
      <div
        className="background-shapes"
        style={{ backgroundImage: `url(${bgShapes})` }}
      ></div>

      {/* Main content */}
      <div className="landing-content">
        <h1>Your Personal Assistant</h1>
        <p>One-stop solution for your services. Order any service, anytime.</p>
        
        <button 
          className="cta-button" 
          onClick={() => navigate("/signup")}
        >
          Join Us
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
