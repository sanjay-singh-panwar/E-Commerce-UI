import React, { useState, useEffect } from "react";
import axios from "axios";

function Payment() {

  const [payments] = useState([
    {
      id: 1,
      userId: 1,
      type: "Credit Card",
      bankName: "HDFC Bank",
      branch: "Delhi",
      cardNo: "1234 5678 9012 3456",
      cvv: "123",
      amount: 2500,
      date: "2025-07-10",
    },
    {
      id: 2,
      userId: 2,
      type: "UPI",
      bankName: "SBI",
      branch: "Mumbai",
      cardNo: "N/A",
      cvv: "N/A",
      amount: 1500,
      date: "2025-07-09",
    },
  ]);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [viewPayment, setViewPayment] = useState(null);

  useEffect(() => {
      fetchUsers();
    }, []);

    const fetchUsers = async () => {
    try {
      const res = await axios.get("https://localhost:7000/api/User"); // Replace with actual endpoint
      setUsers(res.data.data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  const handleView = () => {
    let data = payments;
    if (selectedUser) {
      data = data.filter((p) => p.userId === parseInt(selectedUser));
    }
    if (searchTerm) {
      data = data.filter((p) =>
        p.bankName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredPayments(data);
    setCurrentPage(1);
  };

  const handleExport = () => {
    const csv = filteredPayments
      .map((p) => {
        const user = users.find((u) => u.id === p.userId)?.name;
        return `${user},${p.type},${p.bankName},${p.branch},${p.cardNo},${p.cvv},${p.amount},${p.date}`;
      })
      .join("\n");
    const header = "User,Type,Bank Name,Branch,Card No,CVV,Amount,Date\n";
    const blob = new Blob([header + csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Payment_Report.csv";
    link.click();
  };

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPayments = filteredPayments.slice(
    startIndex,
    startIndex + pageSize
  );
  const totalPages = Math.ceil(filteredPayments.length / pageSize);

  // ... import React and state code same as before

return (
  <div className="container mt-4">
    {/* Header */}
    <div className="card shadow-sm mb-4 border-0">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">
          <i className="bi bi-credit-card me-2"></i>Payment Report
        </h5>
      </div>
      <div className="card-body">
        <div className="row g-2 align-items-end">

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


          <div className="col-md-5">
            <label className="form-label fw-semibold">🔍 Search Bank</label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Enter bank name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <button
              className="btn btn-success btn-sm"
              onClick={handleView}
              disabled={!selectedUser && !searchTerm}
            >
              <i className="bi bi-eye"></i> View
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Table section */}
    {filteredPayments.length > 0 ? (
      <div className="card shadow-sm">
        <div className="card-body">
          {/* Table Heading + Buttons */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold mb-0">📋 Payment List</h6>
            <div className="d-flex gap-2 align-items-center">
              <button
                className="btn btn-outline-success btn-sm"
                onClick={handleExport}
              >
                <i className="bi bi-download me-1"></i> Export
              </button>
              <div className="d-flex align-items-center">
                <label className="form-label me-2 mb-0 fw-semibold">Items</label>
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

          {/* Payment Table */}
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>User</th>
                <th>Type</th>
                <th>Bank</th>
                <th>Branch</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.map((p) => (
                <tr key={p.id}>
                  <td>{users.find((u) => u.id === p.userId)?.name}</td>
                  <td>{p.type}</td>
                  <td>{p.bankName}</td>
                  <td>{p.branch}</td>
                  <td>₹{p.amount}</td>
                  <td>{p.date}</td>
                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => setViewPayment(p)}
                    >
                      <i className="bi bi-eye-fill"></i>
                    </button>
                  </td>
                </tr>
              ))}
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
        </div>
      </div>
    ) : (
      (selectedUser || searchTerm) && (
        <div className="alert alert-warning text-center">No payments found.</div>
      )
    )}

    {/* View Modal */}
    {viewPayment && (
      <>
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content shadow">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  Payment Info -{" "}
                  {users.find((u) => u.id === viewPayment.userId)?.name}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setViewPayment(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>🧾 Payment Type:</strong> {viewPayment.type}</p>
                <p><strong>🏦 Bank Name:</strong> {viewPayment.bankName}</p>
                <p><strong>🏢 Branch:</strong> {viewPayment.branch}</p>
                <p><strong>💳 Card No:</strong> {viewPayment.cardNo}</p>
                <p><strong>🔐 CVV:</strong> {viewPayment.cvv}</p>
                <p><strong>💰 Amount:</strong> ₹{viewPayment.amount}</p>
                <p><strong>📅 Date:</strong> {viewPayment.date}</p>
              </div>
              <div className="modal-footer bg-light">
                <button
                  className="btn btn-secondary"
                  onClick={() => setViewPayment(null)}
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
export default Payment;