import React, { useState } from "react";
import axios from "axios";
import { FaGoogle, FaFacebookF, FaTwitter } from "react-icons/fa";

const Signup = ({ showSignup, setShowSignup, setShowLogin }) => {
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupMobile, setSignupMobile] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    setSignupError("");
    setSignupSuccess("");

    try {
      const response = await axios.post(
        "https://localhost:7000/api/Auth/signup",
        {
          name: signupName,
          mobile: signupMobile,
          email: signupEmail,
          password: signupPassword,
        }
      );

      if (response.status === 200) {
        setSignupSuccess("Account created successfully. You can now log in.");
        setSignupName("");
        setSignupMobile("");
        setSignupEmail("");
        setSignupPassword("");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setSignupError(error.response.data.message);
      } else {
        setSignupError("Something went wrong. Please try again.");
      }
    }
  };

  if (!showSignup) return null;

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
      onClick={() => setShowSignup(false)}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ maxWidth: "400px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content shadow rounded-3">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Sign Up</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowSignup(false)}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSignupSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your Name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                 />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mobile</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Enter mobile number"
                    value={signupMobile}
                    onChange={(e) => setSignupMobile(e.target.value)}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                  />
                </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Choose a password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
              </div>

              {signupError && (
                <div className="alert alert-danger p-2">{signupError}</div>
              )}

              {signupSuccess && (
                <div className="alert alert-success p-2">{signupSuccess}</div>
              )}

              <button type="submit" className="btn btn-primary w-100 mb-3">
                Create Account
              </button>
            </form>

            <div className="d-flex justify-content-center gap-2">
              <button className="btn btn-outline-danger btn-sm">
                <FaGoogle />
              </button>
              <button className="btn btn-outline-primary btn-sm">
                <FaFacebookF />
              </button>
              <button className="btn btn-outline-info btn-sm">
                <FaTwitter />
              </button>
            </div>

            <p className="text-center mt-3 mb-0">
              Already have an account?{" "}
              <button
                className="btn btn-link p-0"
                onClick={() => {
                  setShowSignup(false);
                  setShowLogin(true);
                }}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
