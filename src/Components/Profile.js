import React, { useState, useEffect } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId]);

  const fetchUserData = async (id) => {
    try {
      const res = await axios.get(`https://localhost:7000/api/User/${id}`);
      setUser(res.data.data);
      setFormData({
        name: res.data.data.name || "",
        email: res.data.data.email || "",
        mobile: res.data.data.mobile || "",
      });
      const roleData = JSON.parse(localStorage.getItem("role"));
      setRole(roleData);
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`https://localhost:7000/api/User/${userId}`, formData);
      alert("User updated successfully");
      setUser(res.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this profile?");
    if (confirmed) {
      try {
        await axios.delete(`https://localhost:7000/api/User/${userId}`);
        alert("Profile deleted successfully");
        localStorage.clear();
        window.location.href = "/";
      } catch (error) {
        console.error("Error deleting user", error);
      }
    }
  };

  if (!user) {
    return (
      <div className="container mt-4 text-center">
        <h2>No User Profile Found</h2>
      </div>
    );
  }

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div className="card shadow-lg" style={{ maxWidth: "500px", width: "100%" }}>
        <div
          className="bg-primary text-white py-3 px-4"
          style={{ borderTopLeftRadius: "0.5rem", borderTopRightRadius: "0.5rem" }}
        >
          <h4 className="m-0 text-center">👤 User Profile</h4>
        </div>
        <div className="card-body">
          {isEditing ? (
            <>
              <div className="mb-2">
                <label>Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label>Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label>Mobile</label>
                <input
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <button className="btn btn-success me-2" onClick={handleUpdate}>
                ✅ Save
              </button>
              <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                ❌ Cancel
              </button>
            </>
          ) : (
            <>
              <p><strong>🧑 Name:</strong> {user.name}</p>
              <p><strong>📧 Email:</strong> {user.email}</p>
              <p><strong>📱 Mobile:</strong> {user.mobile}</p>
              <p><strong>🔐 Role:</strong> {role?.name || role?.roleName || "N/A"}</p>

              <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-primary w-45" onClick={handleEditToggle}>
                  ✏️ Edit
                </button>
                <button className="btn btn-danger w-45" onClick={handleDelete}>
                  🗑️ Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
