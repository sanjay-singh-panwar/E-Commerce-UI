import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function Category() {
  const [category, setCategory] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [viewCategory, setViewCategory] = useState(null);

  const baseUrl = "https://localhost:7000/api/Category"; // Replace with your actual API base URL

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    try {
      const response = await axios.get(baseUrl);
      setCategory(response.data);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() !== "") {
      try {
        await axios.post(baseUrl, { name: newCategory });
        setNewCategory("");
        setShowAddModal(false);
        fetchCategory();
      } catch (error) {
        console.error("Add error:", error);
      }
    }
  };

  const handleDeleteCategory = (id, name) => {
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
          fetchCategory();
          Swal.fire("Deleted!", `"${name}" deleted`, "success");
        } catch (error) {
          console.error("Delete error:", error);
        }
      }
    });
  };

  const handleEditCategory = (cat) => {
    setEditCategoryId(cat.id);
    setEditCategoryName(cat.name);
  };

  const handleUpdateCategory = async () => {
    if (editCategoryName.trim() !== "") {
      try {
        await axios.put(`${baseUrl}`, {
          id: editCategoryId,
          name: editCategoryName,
        });
        setEditCategoryId(null);
        setEditCategoryName("");
        fetchCategory();
        Swal.fire("Updated!", "Category updated", "success");
      } catch (error) {
        console.error("Update error:", error);
      }
    }
  };

  const handleDownload = () => {
    const csv = category.map((c) => `${c.id},${c.name}`).join("\n");
    const blob = new Blob([`ID,Category\n${csv}`], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "Category.csv";
    link.click();
  };

  const filteredCategory = category.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCategory = filteredCategory.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filteredCategory.length / pageSize);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">📁 Category Management</h4>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
          <i className="bi bi-plus-lg"></i> Add Category
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
            <th>Category Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCategory.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>
                <button className="btn btn-link p-0 me-2" onClick={() => handleEditCategory(c)}>
                  <i className="bi bi-pencil-fill text-primary fs-5"></i>
                </button>
                <button className="btn btn-link p-0 me-2" onClick={() => handleDeleteCategory(c.id, c.name)}>
                  <i className="bi bi-trash-fill text-danger fs-5"></i>
                </button>
                <button className="btn btn-link p-0" onClick={() => setViewCategory(c)}>
                  <i className="bi bi-eye-fill text-success fs-5"></i>
                </button>
              </td>
            </tr>
          ))}
          {paginatedCategory.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center">No Category found.</td>
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
                  <h5 className="modal-title">Add Category</h5>
                  <button className="btn-close" onClick={() => setShowAddModal(false)}></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Category Name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleAddCategory}>Save</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* Edit Modal */}
      {editCategoryId !== null && (
        <>
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Category</h5>
                  <button className="btn-close" onClick={() => {
                    setEditCategoryId(null);
                    setEditCategoryName("");
                  }}></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => {
                    setEditCategoryId(null);
                    setEditCategoryName("");
                  }}>Cancel</button>
                  <button className="btn btn-primary" onClick={handleUpdateCategory}>Update</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* View Modal */}
      {viewCategory && (
        <>
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">Category Details</h5>
                  <button className="btn-close" onClick={() => setViewCategory(null)}></button>
                </div>
                <div className="modal-body">
                  <p><strong>ID:</strong> {viewCategory.id}</p>
                  <p><strong>Name:</strong> {viewCategory.name}</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setViewCategory(null)}>Close</button>
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

export default Category;
