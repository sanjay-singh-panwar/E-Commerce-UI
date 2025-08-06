import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function OrderStatus() {
  const [statuses, setStatuses] = useState([]);
  const [newStatus, setNewStatus] = useState("");
  const [editStatusId, setEditStatusId] = useState(null);
  const [editStatusName, setEditStatusName] = useState("");
  const [viewStatus, setViewStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [showAddModal, setShowAddModal] = useState(false);

  const baseUrl = "https://localhost:7000/api/OrderStatus"; // Update if needed

  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      const res = await axios.get(baseUrl);
      setStatuses(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleAddStatus = async () => {
    try {
      await axios.post(baseUrl, { name: newStatus });
      setNewStatus("");
      setShowAddModal(false);
      fetchStatuses();
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await axios.put(`${baseUrl}`, {
        id: editStatusId,
        name: editStatusName,
      });
      setEditStatusId(null);
      setEditStatusName("");
      fetchStatuses();
      Swal.fire("Updated!", "Order Status updated", "success");
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleDeleteStatus = (id, name) => {
    Swal.fire({
      title: `Delete "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseUrl}/${id}`);
          fetchStatuses();
          Swal.fire("Deleted!", "Order Status deleted", "success");
        } catch (err) {
          console.error("Delete error:", err);
        }
      }
    });
  };

  const filtered = statuses.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const handleDownload = () => {
    const csv = statuses.map(s => `${s.id},${s.name}`).join("\n");
    const blob = new Blob([`ID,Order Status\n${csv}`], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "order_status.csv";
    link.click();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h4>📦 Order Status Management</h4>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-plus"></i> Add Status
        </button>
      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <input
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
          <label className="form-label me-2">Page Size:</label>
          <select
            className="form-select form-select-sm d-inline-block w-auto"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[3, 5, 10].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Status Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>
                <button
                  className="btn btn-link p-0 me-2"
                  onClick={() => {
                    setEditStatusId(s.id);
                    setEditStatusName(s.name);
                  }}
                >
                  <i className="bi bi-pencil-fill text-primary"></i>
                </button>
                <button
                  className="btn btn-link p-0 me-2"
                  onClick={() => handleDeleteStatus(s.id, s.name)}
                >
                  <i className="bi bi-trash-fill text-danger"></i>
                </button>
                <button
                  className="btn btn-link p-0"
                  onClick={() => setViewStatus(s)}
                >
                  <i className="bi bi-eye-fill text-success"></i>
                </button>
              </td>
            </tr>
          ))}
          {paginated.length === 0 && (
            <tr><td colSpan="3" className="text-center">No statuses found.</td></tr>
          )}
        </tbody>
      </table>

      <nav>
        <ul className="pagination pagination-sm justify-content-center">
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Add Modal */}
      {showAddModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5>Add Order Status</h5>
                  <button className="btn-close" onClick={() => setShowAddModal(false)}></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Status Name"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleAddStatus}>Save</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* Edit Modal */}
      {editStatusId && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5>Edit Order Status</h5>
                  <button className="btn-close" onClick={() => {
                    setEditStatusId(null);
                    setEditStatusName("");
                  }}></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control"
                    value={editStatusName}
                    onChange={(e) => setEditStatusName(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => {
                    setEditStatusId(null);
                    setEditStatusName("");
                  }}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleUpdateStatus}>Update</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* View Modal */}
      {viewStatus && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5>Order Status Details</h5>
                  <button className="btn-close" onClick={() => setViewStatus(null)}></button>
                </div>
                <div className="modal-body">
                  <p><strong>ID:</strong> {viewStatus.id}</p>
                  <p><strong>Name:</strong> {viewStatus.name}</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setViewStatus(null)}>Close</button>
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

export default OrderStatus;
