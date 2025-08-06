import { useState, useEffect } from "react";
import axios from "axios";

function ViewOrder() {
  const [orders] = useState([
    {
      id: 1,
      userId: 1,
      status: "Pending",
      items: [
        {
          image: "https://via.placeholder.com/50",
          name: "Laptop",
          quantity: 1,
          price: 30000,
        },
        {
          image: "https://via.placeholder.com/50",
          name: "Mouse",
          quantity: 2,
          price: 500,
        },
      ],
    },
    {
      id: 2,
      userId: 2,
      status: "Delivered",
      items: [
        {
          image: "https://via.placeholder.com/50",
          name: "Phone",
          quantity: 1,
          price: 20000,
        },
      ],
    },
  ]);

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [viewOrder, setViewOrder] = useState(null);

  const [users, setUsers] = useState([]);
  const [statuses, setStatuses] = useState([]);


  useEffect(() => {
    fetchUsers();
    fetchStatuses();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://localhost:7000/api/User"); // Replace with actual endpoint
      setUsers(res.data.data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  const fetchStatuses = async () => {
    try {
      const res = await axios.get("https://localhost:7000/api/OrderStatus"); // Replace with actual endpoint
      setStatuses(res.data);
    } catch (err) {
      console.error("Failed to load statuses", err);
    }
  };

  const handleView = () => {
    let data = orders;
    if (selectedUser) {
      data = data.filter((o) => o.userId === parseInt(selectedUser));
    }
    if (selectedStatus) {
      data = data.filter((o) => o.status === selectedStatus);
    }
    if (searchTerm) {
      data = data.filter((o) =>
        o.items.some((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    setFilteredOrders(data);
    setCurrentPage(1);
  };

  const handleExport = () => {
    const csv = filteredOrders
      .map((o) => {
        const userName = users.find((u) => u.id === o.userId)?.name;
        return o.items
          .map(
            (i) =>
              `${userName},${o.status},${i.name},${i.quantity},${i.price},${
                i.quantity * i.price
              }`
          )
          .join("\n");
      })
      .join("\n");
    const header = "User,Status,Item,Qty,Price,Total\n";
    const blob = new Blob([header + csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Orders.csv";
    link.click();
  };

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + pageSize
  );
  const totalPages = Math.ceil(filteredOrders.length / pageSize);

  return (
    <div className="container mt-4">
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            <i className="bi bi-receipt-cutoff me-2"></i>View Orders
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-2 align-items-end mb-3">
            
            <div className="col-md-3">
        <label className="form-label fw-semibold">👤 Select User</label>
        <select
          className="form-select form-select-sm"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">All Users</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-3">
        <label className="form-label fw-semibold">📦 Order Status</label>
        <select
          className="form-select form-select-sm"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">All Status</option>
          {statuses.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">🔍 Search Item</label>
              <div className="input-group input-group-sm">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter item name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-success btn-sm"
                onClick={handleView}
                disabled={!selectedUser && !selectedStatus && !searchTerm}
              >
                <i className="bi bi-eye me-1"></i> View
              </button>
            </div>
          </div>
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-bold mb-0">📋 Order List</h6>
              <div className="d-flex gap-2 align-items-center">
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={handleExport}
                  disabled={filteredOrders.length === 0}
                >
                  <i className="bi bi-download me-1"></i> Export
                </button>
                <div className="d-flex align-items-center">
                  <label className="form-label me-2 mb-0 fw-semibold">
                    Items
                  </label>
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
            </div>

            <table className="table table-bordered table-striped">
              <thead className="table-light">
                <tr>
                  <th>User</th>
                  <th>Status</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => {
                  const userName = users.find(
                    (u) => u.id === order.userId
                  )?.name;
                  const totalAmount = order.items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                  );
                  return (
                    <tr key={order.id}>
                      <td>{userName}</td>
                      <td>{order.status}</td>
                      <td>{order.items.map((i) => i.name).join(", ")}</td>
                      <td>₹{totalAmount}</td>
                      <td>
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => setViewOrder(order)}
                        >
                          <i className="bi bi-eye-fill"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

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
        (selectedUser || selectedStatus || searchTerm) && (
          <div className="alert alert-warning text-center">
            No orders found.
          </div>
        )
      )}

      {/* View Modal */}
      {viewOrder && (
        <>
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content shadow">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">
                    Order Details -{" "}
                    {users.find((u) => u.id === viewOrder.userId)?.name}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setViewOrder(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <table className="table table-bordered table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Image</th>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <img src={item.image} alt="" width="40" />
                          </td>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>₹{item.price}</td>
                          <td>₹{item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="modal-footer bg-light">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setViewOrder(null)}
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

export default ViewOrder;
