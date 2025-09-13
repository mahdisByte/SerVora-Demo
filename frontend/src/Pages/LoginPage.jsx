import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/LoginPage.css";
import logoImage from "../assets/servora-logo.jpg"; // Servora logo

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(""); // reset message

    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      if (res.data.token) {
        // ✅ store JWT token
        localStorage.setItem("token", res.data.token);

        // Optional: store user info
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }

        setMessage("Login successful!");
        navigate("/homepage"); // redirect after login
      } else {
        setMessage(res.data.msg || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.msg || "Error logging in");
    }
  };

  return (
    <section className="login-section">
      <div className="login-card">
        <img src={logoImage} alt="Servora Logo" className="login-logo" />

        {message && <p className="login-message">{message}</p>}

        <form onSubmit={handleLogin} className="form">
          <div>
            <label htmlFor="email" className="label">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@example.com"
              className="input"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="label">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input"
              required
            />
          </div>

          <button type="submit" className="button">
            Login
          </button>
        </form>

        <div className="divider">or</div>

        <button className="google-btn">
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
          />
          Continue with Google
        </button>

        <Link to="/signup" className="register-btn">
          Register Now
        </Link>
      </div>
    </section>
  );
};

export default LoginPage;
