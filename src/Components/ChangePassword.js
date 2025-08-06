import React, { useState, useEffect } from "react";
import axios from "axios";

function ChangePassword() {
  // All state declarations remain the same
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [passwordStrength, setPasswordStrength] = useState({ level: "none", color: "light", percent: 0 });

  useEffect(() => {
    const userFromStorage = localStorage.getItem("user");
    if (userFromStorage) {
      const userId = JSON.parse(userFromStorage).id;
      fetchUserData(userId);
    }
  }, []);

  const fetchUserData = async (id) => {
    try {
      const res = await axios.get(`https://localhost:7000/api/User/${id}`);
      setUser(res.data.data);
    } catch (error) {
      console.error("Failed to fetch user data for password change", error);
      setApiError("Could not load user data. Please try again later.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
    if (name === "newPassword") {
      checkPasswordStrength(value);
    }
  };

  const toggleVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    let strengthProfile = { level: "Too Weak", color: "danger", percent: 20 };
    if (strength === 5) strengthProfile = { level: "Strong", color: "success", percent: 100 };
    else if (strength >= 3) strengthProfile = { level: "Medium", color: "warning", percent: 60 };
    setPasswordStrength(strengthProfile);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    if (!form.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (form.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    
    // Check for confirm password
    if (!form.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your new password";
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    // **THE FIX: The missing return statement that caused the crash.**
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setApiError("❌ User data not loaded. Cannot change password.");
      return;
    }
    // This line will no longer crash
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);
    setApiError("");
    setSuccessMessage("");

    try {
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        password: form.newPassword,
        mobile: user.mobile,
        currentPassword: form.currentPassword,
      };
      
      const response = await axios.put(
        `https://localhost:7000/api/User/${user.id}`,
        payload
      );
      setSuccessMessage(`✅ ${response.data.message || "Password changed successfully!"}`);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordStrength({ level: "none", color: "light", percent: 0 });
      setErrors({});
    } catch (error) {
      console.error("Password change failed:", error.response || error);
      const errorData = error.response?.data;
      if (errorData && errorData.errors) {
        const serverErrors = {};
        for (const field in errorData.errors) {
          const clientField = field.charAt(0).toLowerCase() + field.slice(1);
          serverErrors[clientField] = errorData.errors[field][0];
        }
        setErrors(serverErrors);
        setApiError("❌ Please correct the errors below.");
      } else {
        const friendlyErrorMessage = errorData?.message || errorData?.title || JSON.stringify(errorData) || "An unexpected error occurred.";
        setApiError(`❌ ${friendlyErrorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mt-4 text-center">
        {apiError ? 
          <div className="alert alert-danger">{apiError}</div> :
          <p>Loading user data...</p>
        }
      </div>
    );
  }

  // The JSX for the form remains exactly the same.
  return (
    <div className="container mt-4" style={{ maxWidth: "500px" }}>
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">🔒 Change Password</h5>
        </div>
        <div className="card-body">
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          {apiError && <div className="alert alert-danger">{apiError}</div>}
          <form onSubmit={handleSubmit} noValidate>
            {/* ... all form inputs are the same as the previous version ... */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Current Password</label>
              <div className="input-group">
                <input
                  placeholder="Enter current password"
                  type={showPassword.current ? "text" : "password"}
                  className={`form-control ${errors.currentPassword ? "is-invalid" : ""}`}
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <button type="button" className="btn btn-outline-secondary" onClick={() => toggleVisibility("current")} disabled={isLoading}>
                  <i className={`bi ${showPassword.current ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
                {errors.currentPassword && <div className="invalid-feedback">{errors.currentPassword}</div>}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">New Password</label>
              <div className="input-group">
                <input
                  placeholder="Enter new password (min. 8 characters)"
                  type={showPassword.new ? "text" : "password"}
                  className={`form-control ${errors.newPassword ? "is-invalid" : ""}`}
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <button type="button" className="btn btn-outline-secondary" onClick={() => toggleVisibility("new")} disabled={isLoading}>
                  <i className={`bi ${showPassword.new ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
                {errors.newPassword && <div className="invalid-feedback">{errors.newPassword}</div>}
              </div>
              {form.newPassword && (
                <div className="progress mt-2" style={{ height: "10px" }}>
                  <div
                    className={`progress-bar bg-${passwordStrength.color}`}
                    role="progressbar"
                    style={{ width: `${passwordStrength.percent}%` }}
                    aria-valuenow={passwordStrength.percent}
                  ></div>
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Confirm New Password</label>
              <div className="input-group">
                <input
                  placeholder="Confirm your new password"
                  type={showPassword.confirm ? "text" : "password"}
                  className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <button type="button" className="btn btn-outline-secondary" onClick={() => toggleVisibility("confirm")} disabled={isLoading}>
                  <i className={`bi ${showPassword.confirm ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
              </div>
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Changing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-shield-lock me-2"></i>Change Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;