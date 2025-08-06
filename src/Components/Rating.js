import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Rating() {
  const [ratings, setRatings] = useState([]);
  const [newRating, setNewRating] = useState("");
  const [editRatingId, setEditRatingId] = useState(null);
  const [editRatingName, setEditRatingName] = useState("");
  const [viewRating, setViewRating] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [showAddModal, setShowAddModal] = useState(false);

  const baseUrl = "https://localhost:7000/api/Rating";

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const res = await axios.get(baseUrl);
      setRatings(res.data);
    } catch (error) {
      console.error("Failed to fetch ratings:", error);
    }
  };

  const handleAddRating = async () => {
    try {
      await axios.post(baseUrl, { name: newRating });
      setNewRating("");
      setShowAddModal(false);
      fetchRatings();
    } catch (err) {
      console.error("Add failed:", err);
    }
  };

  const handleUpdateRating = async () => {
  try {
    await axios.put(`${baseUrl}`, {
      id: editRatingId,
      name: editRatingName,
    });
    setEditRatingId(null);
    setEditRatingName("");
    await fetchRatings(); // refresh list
    Swal.fire("Updated!", "Rating updated successfully", "success");
  } catch (error) {
    console.error("Update error:", error);
    Swal.fire("Error!", "Failed to update rating", "error");
  }
};


  const handleDeleteRating = (id, name) => {
  Swal.fire({
    title: `Delete "${name}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e74c3c",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`${baseUrl}/${id}`);
        await fetchRatings(); // refresh list
        Swal.fire("Deleted!", `"${name}" has been deleted.`, "success");
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire("Error!", "Failed to delete rating", "error");
      }
    }
  });
};


  const filtered = ratings.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const exportCSV = () => {
    const csv = filtered.map((r) => `${r.id},${r.name}`).join("\n");
    const blob = new Blob([`ID,Name\n${csv}`], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ratings.csv";
    link.click();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h4>⭐ Rating Management</h4>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-plus"></i> Add Rating
        </button>
      </div>

      {/* Controls */}
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
          <button className="btn btn-success btn-sm" onClick={exportCSV}>
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
            {[3, 5, 10].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td>
                <button className="btn btn-sm btn-link" onClick={() => {
                  setEditRatingId(r.id);
                  setEditRatingName(r.name);
                }}>
                  <i className="bi bi-pencil-fill text-primary"></i>
                </button>
                <button className="btn btn-sm btn-link" onClick={() => handleDeleteRating(r.id, r.name)}>
                  <i className="bi bi-trash-fill text-danger"></i>
                </button>
                <button className="btn btn-sm btn-link" onClick={() => setViewRating(r)}>
                  <i className="bi bi-eye-fill text-success"></i>
                </button>
              </td>
            </tr>
          ))}
          {paginated.length === 0 && (
            <tr><td colSpan="3" className="text-center">No Ratings Found</td></tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <nav>
        <ul className="pagination pagination-sm justify-content-center">
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </button>
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
                  <h5>Add Rating</h5>
                  <button className="btn-close" onClick={() => setShowAddModal(false)}></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter rating name"
                    value={newRating}
                    onChange={(e) => setNewRating(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleAddRating}>Save</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* Edit Modal */}
      {editRatingId && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5>Edit Rating</h5>
                  <button className="btn-close" onClick={() => {
                    setEditRatingId(null);
                    setEditRatingName("");
                  }}></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control"
                    value={editRatingName}
                    onChange={(e) => setEditRatingName(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => {
                    setEditRatingId(null);
                    setEditRatingName("");
                  }}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleUpdateRating}>Update</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* View Modal */}
      {viewRating && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5>Rating Details</h5>
                  <button className="btn-close" onClick={() => setViewRating(null)}></button>
                </div>
                <div className="modal-body">
                  <p><strong>ID:</strong> {viewRating.id}</p>
                  <p><strong>Name:</strong> {viewRating.name}</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setViewRating(null)}>Close</button>
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

export default Rating;
