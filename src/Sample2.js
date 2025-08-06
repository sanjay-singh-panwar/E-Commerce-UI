import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function StateManagement() {
  // Static country options
  const countries = [
    { id: 1, name: "India" },
    { id: 2, name: "USA" },
  ];

  // States array with countryId
  const [states, setStates] = useState([
    { id: 1, name: "California", countryId: 2 },
    { id: 2, name: "Texas", countryId: 2 },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newState, setNewState] = useState("");
  const [newStateCountryId, setNewStateCountryId] = useState(countries[0].id);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [editStateId, setEditStateId] = useState(null);
  const [editStateName, setEditStateName] = useState("");
  const [editStateCountryId, setEditStateCountryId] = useState(countries[0].id);
  const [viewState, setViewState] = useState(null);

  const handleAddState = () => {
    if (newState.trim() !== "") {
      const newId = states.length > 0 ? Math.max(...states.map(s => s.id)) + 1 : 1;
      setStates([
        ...states,
        { id: newId, name: newState, countryId: newStateCountryId },
      ]);
      setNewState("");
      setNewStateCountryId(countries[0].id);
      setShowAddModal(false);
    }
  };

  const handleDeleteState = (id) => {
    const state = states.find(s => s.id === id);
    Swal.fire({
      title: `Delete "${state.name}"?`,
      text: "This cannot be undone.",
      icon: "warning",
      iconColor: "#f39c12",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#95a5a6",
      width: "300px",
      padding: "1em",
      backdrop: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setStates(states.filter(s => s.id !== id));
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `"${state.name}" deleted`,
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }
    });
  };

  const handleEditState = (state) => {
    setEditStateId(state.id);
    setEditStateName(state.name);
    setEditStateCountryId(state.countryId);
  };

  const handleUpdateState = () => {
    if (editStateName.trim() !== "") {
      setStates(
        states.map(s =>
          s.id === editStateId
            ? { ...s, name: editStateName, countryId: editStateCountryId }
            : s
        )
      );
      setEditStateId(null);
      setEditStateName("");
      setEditStateCountryId(countries[0].id);
    }
  };

  const handleDownload = () => {
    const csv = states
      .map(s => {
        const countryName = countries.find(c => c.id === s.countryId)?.name || "";
        return `${s.name},${countryName}`;
      })
      .join("\n");
    const blob = new Blob([`State,Country\n${csv}`], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "states.csv";
    link.click();
  };

  const filteredStates = states.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedStates = filteredStates.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filteredStates.length / pageSize);

  return (
    <div className="container mt-4">
      {/* Heading and Add Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">🏛️ State Management</h4>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowAddModal(true)}
        >
          <i className="bi bi-plus-lg"></i> Add State
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
          <button
            className="btn btn-success btn-sm"
            onClick={handleDownload}
            title="Download CSV"
          >
            <i className="bi bi-download"></i> Export
          </button>
        </div>
        <div className="col-md-4 text-md-end">
          <label className="form-label me-2 mb-0">Items per page:</label>
          <select
            className="form-select form-select-sm d-inline-block w-auto"
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>State Name</th>
            <th>Country</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedStates.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{countries.find(c => c.id === s.countryId)?.name}</td>
              <td>
                <button
                  className="border-0 bg-transparent me-2"
                  title="Edit"
                  onClick={() => handleEditState(s)}
                >
                  <i className="bi bi-pencil-fill text-primary fs-5"></i>
                </button>
                <button
                  className="border-0 bg-transparent me-2"
                  title="Delete"
                  onClick={() => handleDeleteState(s.id)}
                >
                  <i className="bi bi-trash-fill text-danger fs-5"></i>
                </button>
                <button
                  className="border-0 bg-transparent"
                  title="View"
                  onClick={() => setViewState(s)}
                >
                  <i className="bi bi-eye-fill text-success fs-5"></i>
                </button>
              </td>
            </tr>
          ))}
          {paginatedStates.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">
                No states found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <nav>
        <ul className="pagination pagination-sm justify-content-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li
              key={page}
              className={`page-item ${currentPage === page ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Add Modal */}
      {showAddModal && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add State</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label">Country</label>
                    <select
                      className="form-select"
                      value={newStateCountryId}
                      onChange={(e) => setNewStateCountryId(parseInt(e.target.value))}
                    >
                      {countries.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="State Name"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleAddState}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* Edit Modal */}
      {editStateId !== null && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit State</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setEditStateId(null);
                      setEditStateName("");
                      setEditStateCountryId(countries[0].id);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label">Country</label>
                    <select
                      className="form-select"
                      value={editStateCountryId}
                      onChange={(e) => setEditStateCountryId(parseInt(e.target.value))}
                    >
                      {countries.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    value={editStateName}
                    onChange={(e) => setEditStateName(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditStateId(null);
                      setEditStateName("");
                      setEditStateCountryId(countries[0].id);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleUpdateState}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* View Modal */}
      {viewState && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">State Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setViewState(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p><strong>ID:</strong> {viewState.id}</p>
                  <p><strong>Name:</strong> {viewState.name}</p>
                  <p><strong>Country:</strong> {countries.find(c => c.id === viewState.countryId)?.name}</p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setViewState(null)}
                  >
                    Close
                  </button>
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

export default StateManagement;
