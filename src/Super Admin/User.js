import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function User() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", mobile: "", password: ""});

  const [editUserId, setEditUserId] = useState(null);
  const [editUser, setEditUser] = useState({ name: "", email: "", mobile: "", password: "" });

  const [viewUser, setViewUser] = useState(null);

  const baseUrl = "https://localhost:7000/api/User"; // Update with actual API URL

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(baseUrl);
      setUsers(response.data.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleAddUser = async () => {
    if (newUser.name && newUser.email && newUser.mobile && newUser.password ) {
      try {
        await axios.post(baseUrl, newUser);
        setShowAddModal(false);
        setNewUser({ name: "", email: "", mobile: "", password: "" });
        fetchUsers();
      } catch (err) {
        console.error("Add error:", err);
      }
    }
  };

  const handleDeleteUser = (id, name) => {
    Swal.fire({
      title: `Delete "${name}"?`,
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseUrl}/${id}`);
          fetchUsers();
          Swal.fire("Deleted!", `"${name}" deleted`, "success");
        } catch (err) {
          console.error("Delete error:", err);
        }
      }
    });
  };

  const handleEditUser = (user) => {
    setEditUserId(user.id);
    setEditUser({ name: user.name, email: user.email, mobile: user.mobile, password: user.password });
  };

  const handleUpdateUser = async () => {
    if (editUser.name && editUser.email && editUser.mobile && editUser.password) {
      try {
        await axios.put(`${baseUrl}`, { id: editUserId, ...editUser });
        setEditUserId(null);
        setEditUser({ name: "", email: "", mobile: "", password: "" });
        fetchUsers();
        Swal.fire("Updated!", "User updated", "success");
      } catch (err) {
        console.error("Update error:", err);
      }
    }
  };

  const handleDownload = () => {
    const csv = users.map((u) => `${u.id},${u.name},${u.email},${u.mobile},${u.password}`).join("\n");
    const blob = new Blob([`ID,Name,Email,mobile,password\n${csv}`], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "Users.csv";
    link.click();
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">👤 User Management</h4>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-plus-lg"></i> Add User
        </button>
      </div>

      <div className="row g-2 mb-3 align-items-center">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="col-md-4">
          <button className="btn btn-success btn-sm" onClick={handleDownload}>
            <i className="bi bi-download"></i> Export
          </button>
        </div>
        <div className="col-md-4 text-end">
          <label className="form-label me-2">Items per page:</label>
          <select
            className="form-select form-select-sm d-inline-block w-auto"
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[3, 5, 10].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.mobile}</td>
              <td>{u.password}</td>
              <td>
                <button className="btn btn-link p-0 me-2" onClick={() => handleEditUser(u)}>
                  <i className="bi bi-pencil-fill text-primary fs-5"></i>
                </button>
                <button className="btn btn-link p-0 me-2" onClick={() => handleDeleteUser(u.id, u.name)}>
                  <i className="bi bi-trash-fill text-danger fs-5"></i>
                </button>
                <button className="btn btn-link p-0" onClick={() => setViewUser(u)}>
                  <i className="bi bi-eye-fill text-success fs-5"></i>
                </button>
              </td>
            </tr>
          ))}
          {paginatedUsers.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <nav>
        <ul className="pagination pagination-sm justify-content-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(page)}>
                {page}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Add Modal */}
      {showAddModal && (
        <>
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add User</h5>
                  <button className="btn-close" onClick={() => setShowAddModal(false)}></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                  <input
                    type="email"
                    className="form-control mb-2"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Mobile"
                    value={newUser.mobile}
                    onChange={(e) => setNewUser({ ...newUser, mobile: e.target.value })}
                  />
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleAddUser}>Save</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* Edit Modal */}
      {editUserId !== null && (
        <>
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit User</h5>
                  <button className="btn-close" onClick={() => setEditUserId(null)}></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={editUser.name}
                    onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                  />
                  <input
                    type="email"
                    className="form-control mb-2"
                    value={editUser.email}
                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    value={editUser.mobile}
                    onChange={(e) => setEditUser({ ...editUser, mobile: e.target.value })}
                  />
                  <input
                    type="password"
                    className="form-control "
                    value={editUser.password}
                    onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setEditUserId(null)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleUpdateUser}>Update</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* View Modal */}
      {viewUser && (
        <>
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">User Details</h5>
                  <button className="btn-close" onClick={() => setViewUser(null)}></button>
                </div>
                <div className="modal-body">
                  <p><strong>ID:</strong> {viewUser.id}</p>
                  <p><strong>Name:</strong> {viewUser.name}</p>
                  <p><strong>Email:</strong> {viewUser.email}</p>
                  <p><strong>Mobile:</strong> {viewUser.mobile}</p>
                  <p><strong>Password:</strong> {viewUser.password}</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setViewUser(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}

export default User;
