import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = ({ showForgotPassword, setShowForgotPassword, setShowLogin }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await axios.post('https://localhost:7000/api/auth/forgot-password', { email });
      // For security, show a generic success message whether the email exists or not.
      setMessage('If an account with that email exists, a password reset link has been sent.');
      setEmail('');
    } catch (err) {
      // Log the actual error for debugging but show a generic message to the user.
      console.error("Forgot Password error:", err);
      setMessage('If an account with that email exists, a password reset link has been sent.');
    } finally {
      setLoading(false);
    }
  };

  if (!showForgotPassword) return null;

  return (
    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} onClick={() => setShowForgotPassword(false)}>
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-content shadow rounded-3">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Forgot Password</h5>
            <button type="button" className="btn-close" onClick={() => setShowForgotPassword(false)}></button>
          </div>
          <div className="modal-body">
            {!message && <p className="text-muted">Enter your email address and we'll send you a link to reset your password.</p>}
            <form onSubmit={handleForgotPasswordSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {message && <div className="alert alert-success p-2">{message}</div>}
              {error && <div className="alert alert-danger p-2">{error}</div>}

              <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            <p className="text-center mt-3 mb-0">
              <button
                className="btn btn-link p-0"
                onClick={() => {
                  setShowForgotPassword(false);
                  setShowLogin(true);
                }}
              >
                Back to Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;