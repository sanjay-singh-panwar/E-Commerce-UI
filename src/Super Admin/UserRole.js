import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function UserRole() {
  const [userRoles, setUserRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserRole, setNewUserRole] = useState({ userId: "", roleId: "" });

  const [editUserRoleId, setEditUserRoleId] = useState(null);
  const [editUserRole, setEditUserRole] = useState({ userId: "", roleId: "" });

  const [viewUserRole, setViewUserRole] = useState(null);

  const baseUrl = "https://localhost:7000/api/UserRole";
  const userUrl = "https://localhost:7000/api/User";
  const roleUrl = "https://localhost:7000/api/Role";

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [userRoleRes, userRes, roleRes] = await Promise.all([
        axios.get(baseUrl),
        axios.get(userUrl),
        axios.get(roleUrl),
      ]);
      setUserRoles(userRoleRes.data.data);
      setUsers(userRes.data.data);
      setRoles(roleRes.data.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleAddUserRole = async () => {
    if (newUserRole.userId && newUserRole.roleId) {
      try {
        await axios.post(baseUrl, newUserRole);
        setNewUserRole({ userId: "", roleId: "" });
        setShowAddModal(false);
        fetchAll();
      } catch (err) {
        console.error("Add error:", err);
      }
    }
  };

  const handleDeleteUserRole = (id) => {
    Swal.fire({
      title: "Delete UserRole?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseUrl}/${id}`);
          fetchAll();
          Swal.fire("Deleted!", "UserRole deleted", "success");
        } catch (err) {
          console.error("Delete error:", err);
        }
      }
    });
  };

  const handleEditUserRole = (ur) => {
    setEditUserRoleId(ur.id);
    setEditUserRole({ userId: ur.userId, roleId: ur.roleId });
  };

  const handleUpdateUserRole = async () => {
    if (editUserRole.userId && editUserRole.roleId) {
      try {
        await axios.put(`${baseUrl}`, {
          id: editUserRoleId,
          ...editUserRole,
        });
        setEditUserRoleId(null);
        setEditUserRole({ userId: "", roleId: "" });
        fetchAll();
        Swal.fire("Updated!", "UserRole updated", "success");
      } catch (err) {
        console.error("Update error:", err);
      }
    }
  };

  const handleDownload = () => {
    const csv = userRoles
      .map((ur) => `${ur.id},${getUserName(ur.userId)},${getRoleName(ur.roleId)}`)
      .join("\n");
    const blob = new Blob([`ID,User,Role\n${csv}`], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "UserRoles.csv";
    link.click();
  };

  const getUserName = (id) => users.find((u) => u.id === id)?.name || "Unknown";
  const getRoleName = (id) => roles.find((r) => r.id === id)?.name || "Unknown";

  const filteredUserRoles = userRoles.filter((ur) => {
    const user = getUserName(ur.userId).toLowerCase();
    const role = getRoleName(ur.roleId).toLowerCase();
    return user.includes(searchTerm.toLowerCase()) || role.includes(searchTerm.toLowerCase());
  });

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUserRoles = filteredUserRoles.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filteredUserRoles.length / pageSize);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">🔗 User Role Management</h4>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-plus-lg"></i> Assign Role
        </button>
      </div>

      <div className="row g-2 mb-3 align-items-center">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search by user or role..."
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
            <th>User</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUserRoles.map((ur) => (
            <tr key={ur.id}>
              <td>{ur.id}</td>
              <td>{getUserName(ur.userId)}</td>
              <td>{getRoleName(ur.roleId)}</td>
              <td>
                <button className="btn btn-link p-0 me-2" onClick={() => handleEditUserRole(ur)}>
                  <i className="bi bi-pencil-fill text-primary fs-5"></i>
                </button>
                <button className="btn btn-link p-0 me-2" onClick={() => handleDeleteUserRole(ur.id)}>
                  <i className="bi bi-trash-fill text-danger fs-5"></i>
                </button>
                <button className="btn btn-link p-0" onClick={() => setViewUserRole(ur)}>
                  <i className="bi bi-eye-fill text-success fs-5"></i>
                </button>
              </td>
            </tr>
          ))}
          {paginatedUserRoles.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">No user roles found.</td>
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
                  <h5 className="modal-title">Assign Role to User</h5>
                  <button className="btn-close" onClick={() => setShowAddModal(false)}></button>
                </div>
                <div className="modal-body">
                  <select
                    className="form-select mb-2"
                    value={newUserRole.userId}
                    onChange={(e) => setNewUserRole({ ...newUserRole, userId: e.target.value })}
                  >
                    <option value="">Select User</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                  <select
                    className="form-select"
                    value={newUserRole.roleId}
                    onChange={(e) => setNewUserRole({ ...newUserRole, roleId: e.target.value })}
                  >
                    <option value="">Select Role</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleAddUserRole}>Assign</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* Edit Modal */}
      {editUserRoleId !== null && (
        <>
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit User Role</h5>
                  <button className="btn-close" onClick={() => setEditUserRoleId(null)}></button>
                </div>
                <div className="modal-body">
                  <select
                    className="form-select mb-2"
                    value={editUserRole.userId}
                    onChange={(e) => setEditUserRole({ ...editUserRole, userId: e.target.value })}
                  >
                    <option value="">Select User</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                  <select
                    className="form-select"
                    value={editUserRole.roleId}
                    onChange={(e) => setEditUserRole({ ...editUserRole, roleId: e.target.value })}
                  >
                    <option value="">Select Role</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setEditUserRoleId(null)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleUpdateUserRole}>Update</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* View Modal */}
      {viewUserRole && (
        <>
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">User Role Details</h5>
                  <button className="btn-close" onClick={() => setViewUserRole(null)}></button>
                </div>
                <div className="modal-body">
                  <p><strong>ID:</strong> {viewUserRole.id}</p>
                  <p><strong>User:</strong> {getUserName(viewUserRole.userId)}</p>
                  <p><strong>Role:</strong> {getRoleName(viewUserRole.roleId)}</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setViewUserRole(null)}>Close</button>
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

export default UserRole;
