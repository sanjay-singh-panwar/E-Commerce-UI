import React, {useEffect, useState } from "react";
import axios from "axios";

function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    rating: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [ratings, setRatings] = useState([]);
  // const [viewFeedback, setViewFeedback] = useState(null);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    axios.get("https://localhost:7000/api/Rating") // replace with your actual API URL
      .then(res => setRatings(res.data))
      .catch(err => console.error("Error fetching ratings:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Email is invalid";
    if (!form.rating) newErrors.rating = "Rating is required";
    if (!form.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validateErrors = validate();
    if (Object.keys(validateErrors).length > 0) {
      setErrors(validateErrors);
      return;
    }
    const newFeedback = {
      ...form,
      id: Date.now(),
      date: new Date().toLocaleString(),
    };
    setFeedbacks([newFeedback, ...feedbacks]);
    setForm({ name: "", email: "", rating: "", message: "" });
  };

  // const handleExport = () => {
  //   const csv = feedbacks
  //     .map((f) => `${f.name},${f.email},${f.rating},${f.message},${f.date}`)
  //     .join("\n");
  //   const header = "Name,Email,Rating,Message,Date\n";
  //   const blob = new Blob([header + csv], { type: "text/csv" });
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = "Feedback_Report.csv";
  //   link.click();
  // };

  // const startIndex = (currentPage - 1) * pageSize;
  // const paginated = feedbacks.slice(startIndex, startIndex + pageSize);
  // const totalPages = Math.ceil(feedbacks.length / pageSize);

  return (
    <div className="container mt-4">
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0"><i className="bi bi-chat-dots me-2"></i>Feedback Form</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Name</label>
              <input
                type="text"
                className={`form-control ${errors.name && "is-invalid"}`}
                name="name"
                value={form.name}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.name}</div>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className={`form-control ${errors.email && "is-invalid"}`}
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              <div className="invalid-feedback">{errors.email}</div>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Rating</label>
              
              <select
  className={`form-select ${errors.rating && "is-invalid"}`}
  name="rating"
  value={form.rating}
  onChange={handleChange}
>
  <option value="">Choose Rating</option>
  {ratings.map((r) => (
    <option key={r.id} value={r.id}>{r.name}</option>
  ))}
</select>
<div className="invalid-feedback">{errors.rating}</div>


              <div className="invalid-feedback">{errors.rating}</div>
            </div>

            <div className="col-md-12">
              <label className="form-label fw-semibold">Message</label>
              <textarea
                rows="3"
                className={`form-control ${errors.message && "is-invalid"}`}
                name="message"
                value={form.message}
                onChange={handleChange}
              ></textarea>
              <div className="invalid-feedback">{errors.message}</div>
            </div>

            <div className="col-md-12 text-end">
              <button className="btn btn-primary">
                <i className="bi bi-send me-1"></i> Submit Feedback
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Feedback Table */}
      {/* {feedbacks.length > 0 && (
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between mb-2">
              <h6 className="fw-bold mb-0">Recent Feedbacks</h6>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={handleExport}
                >
                  <i className="bi bi-download me-1"></i>Export
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
            </div> */}
            {/* <table className="table table-bordered table-striped">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Rating</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((fb) => (
                  <tr key={fb.id}>
                    <td>{fb.name}</td>
                    <td>{fb.email}</td>
                    <td>{fb.rating} ⭐</td>
                    <td>{fb.message.slice(0, 20)}...</td>
                    <td>{fb.date}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => setViewFeedback(fb)}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table> */}

            {/* Pagination */}
            {/* <nav>
              <ul className="pagination pagination-sm justify-content-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                ))}
              </ul>
            </nav> */}
          {/* </div>
        </div>
      )} */}

      {/* View Modal */}
      {/* {viewFeedback && (
        <>
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content shadow">
                <div className="modal-header bg-info text-white">
                  <h5 className="modal-title">Feedback Details</h5>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setViewFeedback(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p><strong>Name:</strong> {viewFeedback.name}</p>
                  <p><strong>Email:</strong> {viewFeedback.email}</p>
                  <p><strong>Rating:</strong> {viewFeedback.rating} ⭐</p>
                  <p><strong>Message:</strong> {viewFeedback.message}</p>
                  <p><strong>Date:</strong> {viewFeedback.date}</p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setViewFeedback(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )} */}
    </div>
  );
}

export default FeedbackPage;
