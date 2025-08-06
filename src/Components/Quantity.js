import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

function Quantity() {
  const [items] = useState([
  { id: 1, name: "Shoes", price: 1000 },
  { id: 2, name: "T-shirt", price: 500 },
]);


  const [quantities, setQuantities] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [addedQuantity, setAddedQuantity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [editId, setEditId] = useState(null);
  const [editQty, setEditQty] = useState(null);
  const [viewQty, setViewQty] = useState(null);

  const handleAddQuantity = () => {
    if (!selectedItemId || !addedQuantity || isNaN(addedQuantity)) return;

    const item = items.find((i) => i.id === parseInt(selectedItemId));
    const existing = quantities.find((q) => q.itemId === item.id);

    if (existing) {
      setQuantities(
        quantities.map((q) =>
          q.itemId === item.id
            ? {
                ...q,
                total: q.total + parseInt(addedQuantity),
                available: q.available + parseInt(addedQuantity),
              }
            : q
        )
      );
    } else {
      const newId = quantities.length > 0 ? Math.max(...quantities.map((q) => q.id)) + 1 : 1;
      setQuantities([
        ...quantities,
        {
          id: newId,
          itemId: item.id,
          itemName: item.name,
          total: parseInt(addedQuantity),
          available: parseInt(addedQuantity),
          sold: 0,
        },
      ]);
    }

    setSelectedItemId("");
    setAddedQuantity("");
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    const record = quantities.find((q) => q.id === id);
    Swal.fire({
      title: `Delete "${record.itemName}"?`,
      text: "This will remove the quantity record.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#7f8c8d",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        setQuantities(quantities.filter((q) => q.id !== id));
        Swal.fire("Deleted!", `"${record.itemName}" record removed.`, "success");
      }
    });
  };

  const handleEdit = (record) => {
    setEditId(record.id);
    setEditQty({ ...record });
  };

  const handleUpdate = () => {
    setQuantities(
      quantities.map((q) => (q.id === editId ? { ...editQty, id: editId } : q))
    );
    setEditId(null);
    setEditQty(null);
  };

  const handleDownload = () => {
    const csv = quantities
      .map((q) => `${q.itemName},${q.total},${q.available},${q.sold}`)
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "Quantity.csv";
    link.click();
  };

  const filtered = quantities.filter((q) =>
    q.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const paginated = filtered.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">📦 Quantity Management</h4>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowAddModal(true)}
        >
          <i className="bi bi-plus-lg"></i> Add Quantity
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

      <table className="table table-bordered">
        <thead className="table-light">
  <tr>
    <th>ID</th>
    <th>Item Name</th>
    <th>Total Quantity</th>
    <th>Available</th>
    <th>Sold</th>
    <th>% Sold</th>
    <th>Status</th>
    <th>Total Value</th>
    <th>Actions</th>
  </tr>
</thead>

        
            <tbody>
  {paginated.map((q) => {
    const item = items.find((i) => i.id === q.itemId);
    const price = item?.price || 0;
    const percentSold = q.total > 0 ? ((q.sold / q.total) * 100).toFixed(1) : "0";

    return (
      <tr key={q.id}>
        <td>{q.id}</td>
        <td>{q.itemName}</td>
        <td>{q.total}</td>
        <td>{q.available}</td>
        <td>{q.sold}</td>

        {/* % Sold Column */}
        <td>{percentSold}%</td>

        {/* Stock Status Column */}
        <td>
          {q.available === 0 ? (
            <span className="badge bg-danger">Out of Stock</span>
          ) : q.available < 5 ? (
            <span className="badge bg-warning text-dark">Low Stock</span>
          ) : (
            <span className="badge bg-success">In Stock</span>
          )}
        </td>

        {/* Total Value Column */}
        <td>₹{(q.total * price).toFixed(2)}</td>

        <td>
          <button
            className="border-0 bg-transparent me-2"
            title="Edit"
            onClick={() => handleEdit(q)}
          >
            <i className="bi bi-pencil-fill text-primary fs-5"></i>
          </button>
          <button
            className="border-0 bg-transparent me-2"
            title="Delete"
            onClick={() => handleDelete(q.id)}
          >
            <i className="bi bi-trash-fill text-danger fs-5"></i>
          </button>
          <button
            className="border-0 bg-transparent"
            title="View"
            onClick={() => setViewQty(q)}
          >
            <i className="bi bi-eye-fill text-success fs-5"></i>
          </button>
        </td>
      </tr>
    );
  })}
  {paginated.length === 0 && (
            <tr>
              <td colSpan="9" className="text-center">
                No items found.
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
                  <h5 className="modal-title">Add Quantity</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <select
                    className="form-select mb-2"
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                  >
                    <option value="">Select Item</option>
                    {items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Quantity"
                    value={addedQuantity}
                    onChange={(e) => setAddedQuantity(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleAddQuantity}>
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
      {editId !== null && (
        <>
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Quantity</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setEditId(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    type="number"
                    className="form-control mb-2"
                    value={editQty.total}
                    onChange={(e) =>
                      setEditQty({ ...editQty, total: parseInt(e.target.value) })
                    }
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    value={editQty.available}
                    onChange={(e) =>
                      setEditQty({
                        ...editQty,
                        available: parseInt(e.target.value),
                      })
                    }
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    value={editQty.sold}
                    onChange={(e) =>
                      setEditQty({ ...editQty, sold: parseInt(e.target.value) })
                    }
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setEditId(null)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={handleUpdate}>
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
      {viewQty && (
        <>
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">Quantity Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setViewQty(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p><strong>ID:</strong> {viewQty.id}</p>
                  <p><strong>Item:</strong> {viewQty.itemName}</p>
                  <p><strong>Total:</strong> {viewQty.total}</p>
                  <p><strong>Available:</strong> {viewQty.available}</p>
                  <p><strong>Sold:</strong> {viewQty.sold}</p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setViewQty(null)}
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

export default Quantity;
