import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function Item() {
  const [items, setItems] = useState([
    { id: 1, name: "AC", price: 30000 },
    { id: 2, name: "Fan", price: 3000 },
  ]);


  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    size: "",
    categoryId: "",
    image: null,
    image1: null,
    image2: null,
  });
  const [categories, setCategories] = useState([]);
  const [editItemId, setEditItemId] = useState(null);
  const [editItemData, setEditItemData] = useState({});
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

  const handleAddItem = () => {
    if (newItem.name.trim() && newItem.price) {
      const newId = items.length > 0 ? Math.max(...items.map((i) => i.id || 0)) + 1 : 1;
      const fullItem = { ...newItem, id: newId };
      setItems([...items, fullItem]);
      setNewItem({
        name: "",
        description: "",
        price: "",
        quantity: "",
        size: "",
        categoryId: "",
        image: null,
        image1: null,
        image2: null,
      });
      setShowAddModal(false);
      
    }
  };

  const handleDeleteItem = (id) => {
    const item = items.find((i) => i.id === id);
    Swal.fire({
      title: `Delete "${item.name}"?`,
      text: "This cannot be undone.",
      icon: "warning",
      iconColor: "#f39c12",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#95a5a6",
    }).then((result) => {
      if (result.isConfirmed) {
        setItems(items.filter((i) => i.id !== id));
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `"${item.name}" deleted`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleEditItem = (item) => {
    setEditItemId(item.id);
    setEditItemData({ ...item });
  };

  const handleUpdateItem = () => {
    setItems(
      items.map((i) =>
        i.id === editItemId ? { ...editItemData, id: editItemId } : i
      )
    );
    setEditItemId(null);
    setEditItemData({});
  };

  const handleDownload = () => {
    const csv = items.map((i) => `${i.name},${i.price}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "Items.csv";
    link.click();
  };

  const filteredItems = items.filter((i) =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filteredItems.length / pageSize);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">📦 Item Management</h4>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowAddModal(true)}
        >
          <i className="bi bi-plus-lg"></i> Add Item
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

      {/* Table */}
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Item Name</th>
            <th>Price</th>
            <th style={{ width: "200px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedItems.map((item) => (
            <tr key={item.id}>
                <td>{item.id}</td>
              <td>{item.name}</td>
              <td>₹ {item.price}</td>
              <td>
                <button
                  className="border-0 bg-transparent me-2"
                  title="Edit"
                  onClick={() => handleEditItem(item)}
                >
                  <i className="bi bi-pencil-fill text-primary fs-5"></i>
                </button>
                <button
                  className="border-0 bg-transparent me-2"
                  title="Delete"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <i className="bi bi-trash-fill text-danger fs-5"></i>
                </button>
                <button
                  className="border-0 bg-transparent"
                  title="View"
                  onClick={() => setViewItem(item)}
                >
                  <i className="bi bi-eye-fill text-success fs-5"></i>
                </button>
              </td>
            </tr>
          ))}
          {paginatedItems.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center">
                No items found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <nav>
        <ul className="pagination pagination-sm justify-content-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li
              key={page}
              className={`page-item ${currentPage === page ? "active" : ""}`}
            >
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
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Item</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    className="form-control mb-2"
                    placeholder="Item Name"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                  />
                  <input
                    className="form-control mb-2"
                    placeholder="Description"
                    value={newItem.description}
                    onChange={(e) =>
                      setNewItem({ ...newItem, description: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Price"
                    value={newItem.price}
                    onChange={(e) =>
                      setNewItem({ ...newItem, price: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Quantity"
                    value={newItem.quantity}
                    onChange={(e) =>
                      setNewItem({ ...newItem, quantity: e.target.value })
                    }
                  />
                  <input
                    className="form-control mb-2"
                    placeholder="Size"
                    value={newItem.size}
                    onChange={(e) =>
                      setNewItem({ ...newItem, size: e.target.value })
                    }
                  />
                  
                  <select
      className="form-select mb-2"
      value={newItem.categoryId}
      onChange={(e) =>
        setNewItem({ ...newItem, categoryId: e.target.value })
      }
    >
      <option value="">Select Category</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>

                  <input
                    type="file"
                    className="form-control mb-2"
                    onChange={(e) =>
                      setNewItem({ ...newItem, image: e.target.files[0] })
                    }
                  />
                  <input
                    type="file"
                    className="form-control mb-2"
                    onChange={(e) =>
                      setNewItem({ ...newItem, image1: e.target.files[0] })
                    }
                  />
                  <input
                    type="file"
                    className="form-control mb-2"
                    onChange={(e) =>
                      setNewItem({ ...newItem, image2: e.target.files[0] })
                    }
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleAddItem}>
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
      {editItemId !== null && (
        <>
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Item</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setEditItemId(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    className="form-control mb-2"
                    value={editItemData.name}
                    onChange={(e) =>
                      setEditItemData({ ...editItemData, name: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    value={editItemData.price}
                    onChange={(e) =>
                      setEditItemData({
                        ...editItemData,
                        price: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditItemId(null)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleUpdateItem}>
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
      {viewItem && (
        <>
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">Item Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setViewItem(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p><strong>ID:</strong> {viewItem.id}</p>
                  <p><strong>Name:</strong> {viewItem.name}</p>
                  <p><strong>Price:</strong> ₹{viewItem.price}</p>
                  <p><strong>Category:</strong> {
                    items.find(c => c.id === parseInt(viewItem.categoryId))?.name || "N/A"
                  }</p>
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

export default Item;
