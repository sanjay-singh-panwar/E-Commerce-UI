import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResetPassword = () => {
  // In a real app with react-router-dom, you would use:
  // const token = new URLSearchParams(window.location.search).get('token');
  const [token, setToken] = useState('');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // This effect simulates getting the token from the URL when the component loads.
  useEffect(() => {
    const tokenFromUrl = new URLSearchParams(window.location.search).get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("Invalid password reset link. The token is missing.");
    }
  }, []);

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Cannot reset password without a valid token.");
      return;
    }
    
    setLoading(true);
    try {
      await axios.post('https://localhost:7000/api/auth/reset-password', {
        token,
        password,
      });
      setMessage('Your password has been reset successfully! You can now log in.');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to reset password. The link may be invalid or expired.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow rounded-3">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">Reset Your Password</h5>
            </div>
            <div className="card-body">
              { !message && <p>Please enter your new password below.</p> }
              <form onSubmit={handleResetPasswordSubmit}>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={!!message} // Disable after success
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={!!message} // Disable after success
                  />
                </div>

                {message && <div className="alert alert-success p-2">{message}</div>}
                {error && <div className="alert alert-danger p-2">{error}</div>}

                {!message && (
                  <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;