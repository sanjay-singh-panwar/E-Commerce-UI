import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function Role() {
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newRole, setNewRole] = useState("");

  const [editRoleId, setEditRoleId] = useState(null);
  const [editRoleName, setEditRoleName] = useState("");

  const [viewRole, setViewRole] = useState(null);

  const baseUrl = "https://localhost:7000/api/Role"; // Replace with your actual endpoint

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(baseUrl);
      setRoles(response.data.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleAddRole = async () => {
    if (newRole.trim()) {
      try {
        await axios.post(baseUrl, { name: newRole });
        setNewRole("");
        setShowAddModal(false);
        fetchRoles();
      } catch (error) {
        console.error("Add error:", error);
      }
    }
  };

  const handleDeleteRole = (id, name) => {
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
          fetchRoles();
          Swal.fire("Deleted!", `"${name}" deleted`, "success");
        } catch (error) {
          console.error("Delete error:", error);
        }
      }
    });
  };

  const handleEditRole = (role) => {
    setEditRoleId(role.id);
    setEditRoleName(role.name);
  };

  const handleUpdateRole = async () => {
    if (editRoleName.trim()) {
      try {
        await axios.put(`${baseUrl}`, {
          id: editRoleId,
          name: editRoleName,
        });
        setEditRoleId(null);
        setEditRoleName("");
        fetchRoles();
        Swal.fire("Updated!", "Role updated", "success");
      } catch (error) {
        console.error("Update error:", error);
      }
    }
  };

  const handleDownload = () => {
    const csv = roles.map((r) => `${r.id},${r.name}`).join("\n");
    const blob = new Blob([`ID,Role\n${csv}`], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "Roles.csv";
    link.click();
  };

  const filteredRoles = roles.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRoles = filteredRoles.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filteredRoles.length / pageSize);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">🛡️ Role Management</h4>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-plus-lg"></i> Add Role
        </button>
      </div>

      <div className="row g-2 mb-3 align-items-center">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search..."
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
            <th>Role Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRoles.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td>
                <button className="btn btn-link p-0 me-2" onClick={() => handleEditRole(r)}>
                  <i className="bi bi-pencil-fill text-primary fs-5"></i>
                </button>
                <button className="btn btn-link p-0 me-2" onClick={() => handleDeleteRole(r.id, r.name)}>
                  <i className="bi bi-trash-fill text-danger fs-5"></i>
                </button>
                <button className="btn btn-link p-0" onClick={() => setViewRole(r)}>
                  <i className="bi bi-eye-fill text-success fs-5"></i>
                </button>
              </td>
            </tr>
          ))}
          {paginatedRoles.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center">No roles found.</td>
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
                  <h5 className="modal-title">Add Role</h5>
                  <button className="btn-close" onClick={() => setShowAddModal(false)}></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Role Name"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleAddRole}>Save</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* Edit Modal */}
      {editRoleId !== null && (
        <>
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Role</h5>
                  <button className="btn-close" onClick={() => setEditRoleId(null)}></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control"
                    value={editRoleName}
                    onChange={(e) => setEditRoleName(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setEditRoleId(null)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleUpdateRole}>Update</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* View Modal */}
      {viewRole && (
        <>
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">Role Details</h5>
                  <button className="btn-close" onClick={() => setViewRole(null)}></button>
                </div>
                <div className="modal-body">
                  <p><strong>ID:</strong> {viewRole.id}</p>
                  <p><strong>Name:</strong> {viewRole.name}</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setViewRole(null)}>Close</button>
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

export default Role;
