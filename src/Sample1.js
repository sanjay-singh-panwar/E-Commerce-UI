import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function Sample1() {
  const [countries, setCountries] = useState([
    { id: 1, name: "India" },
    { id: 2, name: "USA" },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCountry, setNewCountry] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [editCountryId, setEditCountryId] = useState(null);
  const [editCountryName, setEditCountryName] = useState("");
  const [viewCountry, setViewCountry] = useState(null);

  const handleAddCountry = () => {
    if (newCountry.trim() !== "") {
      const newId =
        countries.length > 0
          ? Math.max(...countries.map((c) => c.id)) + 1
          : 1;
      setCountries([...countries, { id: newId, name: newCountry }]);
      setNewCountry("");
      setShowAddModal(false);
    }
  };

  const handleDeleteCountry = (id) => {
    const country = countries.find((c) => c.id === id);

    Swal.fire({
      title: `Delete "${country.name}"?`,
      text: "This cannot be undone.",
      icon: "warning",
      iconColor: "#f39c12",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#95a5a6",
      customClass: {
        popup: "swal2-small-popup",
        title: "swal2-title-custom",
        confirmButton: "swal2-confirm-custom",
        cancelButton: "swal2-cancel-custom",
      },
      width: "300px",
      padding: "1em",
      backdrop: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setCountries(countries.filter((c) => c.id !== id));
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `"${country.name}" deleted`,
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }
    });
  };

  const handleEditCountry = (country) => {
    setEditCountryId(country.id);
    setEditCountryName(country.name);
  };

  const handleUpdateCountry = () => {
    if (editCountryName.trim() !== "") {
      setCountries(
        countries.map((c) =>
          c.id === editCountryId ? { ...c, name: editCountryName } : c
        )
      );
      setEditCountryId(null);
      setEditCountryName("");
    }
  };

  const handleDownload = () => {
    const csv = countries.map((c) => c.name).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "countries.csv";
    link.click();
  };

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCountries = filteredCountries.slice(
    startIndex,
    startIndex + pageSize
  );

  const totalPages = Math.ceil(filteredCountries.length / pageSize);

  return (
    <div className="container mt-4">
      {/* Heading and Add Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">🌍 Country Management</h4>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowAddModal(true)}
        >
          <i className="bi bi-plus-lg"></i> Add Country
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
            <th>Country Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCountries.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>
                <button
                  className="border-0 bg-transparent me-2"
                  title="Edit"
                  onClick={() => handleEditCountry(c)}
                >
                  <i className="bi bi-pencil-fill text-primary fs-5"></i>
                </button>
                <button
                  className="border-0 bg-transparent me-2"
                  title="Delete"
                  onClick={() => handleDeleteCountry(c.id)}
                >
                  <i className="bi bi-trash-fill text-danger fs-5"></i>
                </button>
                <button
                  className="border-0 bg-transparent"
                  title="View"
                  onClick={() => setViewCountry(c)}
                >
                  <i className="bi bi-eye-fill text-success fs-5"></i>
                </button>
              </td>
            </tr>
          ))}
          {paginatedCountries.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center">
                No countries found.
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
                  <h5 className="modal-title">Add Country</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Country Name"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleAddCountry}>
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
      {editCountryId !== null && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Country</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setEditCountryId(null);
                      setEditCountryName("");
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control"
                    value={editCountryName}
                    onChange={(e) => setEditCountryName(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditCountryId(null);
                      setEditCountryName("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleUpdateCountry}
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
      {viewCountry && (
        <>
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">Country Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setViewCountry(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    <strong>ID:</strong> {viewCountry.id}
                  </p>
                  <p>
                    <strong>Name:</strong> {viewCountry.name}
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setViewCountry(null)}
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

export default Sample1;
