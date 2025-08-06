import React, { useState, useEffect } from "react";
import axios from "axios";

function ReportPage() {

  const [items] = useState([
    {
      id: 1,
      name: "T-Shirt",
      categoryId: 1,
      price: 500,
      quantity: 100,
      available: 60,
      sold: 40,
      image: "https://via.placeholder.com/60",
    },
    {
      id: 2,
      name: "Shoes",
      categoryId: 2,
      price: 1500,
      quantity: 50,
      available: 30,
      sold: 20,
      image: "https://via.placeholder.com/60",
    },
  ]);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [viewItem, setViewItem] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
      try {
        const response = await axios.get("https://localhost:7000/api/Category"); // Replace with your API endpoint
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };

  const handleView = () => {
    const result = items.filter(
      (item) => item.categoryId === parseInt(selectedCategory)
    );
    setFilteredItems(result);
    setCurrentPage(1);
  };

  const handleExport = () => {
    const csv = filteredItems
      .map(
        (item) =>
          `${item.name},${item.price},${item.quantity},${item.available},${item.sold}`
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "Report.csv";
    link.click();
  };

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filteredItems.length / pageSize);

  return (
    <div className="container mt-4">
      {/* Header Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            <i className="bi bi-bar-chart me-2"></i>Report Management
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label fw-semibold">
                📂 Select Category
              </label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Choose Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-success bt-sm"
                onClick={handleView}
                disabled={!selectedCategory}
              >
                <i className="bi bi-eye me-2"></i>View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      {/* Table Section */}
      {filteredItems.length > 0 ? (
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0 fw-bold">
                📋 Report List —{" "}
                {
                  categories.find((c) => c.id === parseInt(selectedCategory))
                    ?.name
                }
              </h6>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={handleExport}
                >
                  <i className="bi bi-download me-1"></i> Export
                </button>
                <label className="form-label mb-0 fw-semibold">Items</label>
                <select
                  className="form-select form-select-sm w-auto"
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
                  <th>Image</th>
                  <th>Item Name</th>
                  <th>Price (₹)</th>
                  <th>Quantity</th>
                  <th>Available</th>
                  <th>Sold</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-thumbnail rounded"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>₹{item.price}</td>
                    <td>{item.quantity}</td>
                    <td>{item.available}</td>
                    <td>{item.sold}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => setViewItem(item)}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <nav>
              <ul className="pagination pagination-sm justify-content-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <li
                      key={page}
                      className={`page-item ${
                        currentPage === page ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </nav>
          </div>
        </div>
      ) : (
        selectedCategory && (
          <div className="alert alert-warning text-center">
            No items found for selected category.
          </div>
        )
      )}

      {/* View Modal */}
      {viewItem && (
        <>
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content shadow">
                <div className="modal-header bg-info text-white">
                  <h5 className="modal-title">Item Details</h5>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setViewItem(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <img
                    src={viewItem.image}
                    alt={viewItem.name}
                    className="img-thumbnail mb-3"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                  <p>
                    <strong>Name:</strong> {viewItem.name}
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{viewItem.price}
                  </p>
                  <p>
                    <strong>Total Quantity:</strong> {viewItem.quantity}
                  </p>
                  <p>
                    <strong>Available:</strong> {viewItem.available}
                  </p>
                  <p>
                    <strong>Sold:</strong> {viewItem.sold}
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setViewItem(null)}
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

export default ReportPage;
