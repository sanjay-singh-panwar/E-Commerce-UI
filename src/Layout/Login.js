import React, { useState } from "react";
import axios from "axios";
import { FaGoogle, FaFacebookF, FaTwitter } from "react-icons/fa";

const Login = ({
  showLogin,
  setShowLogin,
  setShowSignup,
  onLoginSuccess,
  setShowForgotPassword,
}) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await axios.post("https://localhost:7000/api/auth/login", {
        username: loginEmail,
        password: loginPassword,
      });

      const { statusCode, token, user, role, message } = response.data;

      if (statusCode === "200" && token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user || {}));
        localStorage.setItem("role", JSON.stringify(role || {}));
        setLoginEmail("");
        setLoginPassword("");
        if (onLoginSuccess) onLoginSuccess();
      } else if (statusCode === "403") {
        setLoginError("Please contact the admin.");
      } else if (statusCode === "404") {
        setLoginError("Invalid credentials. Please try again.");
      } else {
        setLoginError(message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      if (error.response && error.response.status === 401) {
          setLoginError("Invalid credentials. Please try again.");
      } else {
          setLoginError("Something went wrong. Please try again later.");
      }
    }
  };

  if (!showLogin) return null;

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      onClick={() => setShowLogin(false)}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ maxWidth: "400px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content shadow rounded-3">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Login</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowLogin(false)}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="d-flex justify-content-end mb-3">
                <button
                  type="button"
                  className="btn btn-link p-0 text-decoration-none"
                  onClick={() => {
                    setShowLogin(false);
                    setShowForgotPassword(true);
                  }}
                >
                  Forgot password?
                </button>
              </div>

              {loginError && (
                <div className="alert alert-danger p-2">{loginError}</div>
              )}

              <button type="submit" className="btn btn-primary w-100 mb-3">
                Login
              </button>
            </form>

            <div className="d-flex justify-content-center gap-2">
              <button className="btn btn-outline-danger btn-sm"><FaGoogle /></button>
              <button className="btn btn-outline-primary btn-sm"><FaFacebookF /></button>
              <button className="btn btn-outline-info btn-sm"><FaTwitter /></button>
            </div>

            <p className="text-center mt-3 mb-0">
              No account?{" "}
              <button
                className="btn btn-link p-0"
                onClick={() => {
                  setShowLogin(false);
                  setShowSignup(true);
                }}
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;