import { Link, useLocation } from "react-router-dom";

function Sidebar({ isLoggedIn, isSuperAdmin, isAdmin, isUser }) {
  const location = useLocation();


  return (
    <div
      className="bg-dark text-light"
      style={{
        width: "250px",
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        paddingBottom: "1rem",
      }}
    >
      <div className="p-3">
        <ul className="nav nav-pills flex-column gap-2">
          <li className="nav-item">
            <Link
              to="/dashboard"
              className={`nav-link d-flex align-items-center ${
                location.pathname === "/dashboard" ? "active" : "text-light"
              }`}
            >
              <i className="bi bi-speedometer2 me-2"></i> Dashboard
              <span className="badge bg-info ms-auto">New</span>
            </Link>
          </li>
          <hr className="text-light" />

          {/* Super Admin Menu Items - Only show if user is logged in and is Super Admin */}
          {isLoggedIn && isSuperAdmin && (
            <>

              <li className="nav-item">
                <Link
                  to="/user"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/user" ? "active" : "text-light"
                  }`}
                >
                  <i className="bi bi-person-lines-fill me-2"></i> User
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/role"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/role" ? "active" : "text-light"
                  }`}
                >
                  <i className="bi bi-shield-check me-2"></i> Role
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/userrole"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/userrole" ? "active" : "text-light"
                  }`}
                >
                  <i className="bi bi-diagram-3 me-2"></i> User Role
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/changepassword"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/changepassword"
                      ? "active"
                      : "text-light"
                  }`}
                >
                  <i className="bi bi-shield-lock me-2"></i> Change Password
                </Link>
              </li>
            </>
          )}

          {/* Admin Menu Items - Only show if user is logged in and is Admin */}
          {isLoggedIn && isAdmin && (
            <>
              <li className="nav-item">
                <Link
                  to="/category"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/category" ? "active" : "text-light"
                  }`}
                >
                  <i className="bi bi-tags me-2"></i> Category
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/item"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/item" ? "active" : "text-light"
                  }`}
                >
                  <i className="bi bi-box me-2"></i> Item
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/quantity"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/quantity" ? "active" : "text-light"
                  }`}
                >
                  <i className="bi bi-123 me-2"></i> Quantity
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/vieworder"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/vieworder" ? "active" : "text-light"
                  }`}
                >
                  <i className="bi bi-eye-fill me-2"></i> View Order
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/payment"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/payment" ? "active" : "text-light"
                  }`}
                >
                  <i className="bi bi-credit-card me-2"></i> Payment
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/report"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/report" ? "active" : "text-light"
                  }`}
                >
                  <i className="bi bi-graph-up-arrow me-2"></i> Report
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/feedback"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/feedback" ? "active" : "text-light"
                  }`}
                >
                  <i className="bi bi-chat-dots me-2"></i> Feedback
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/changepassword"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/changepassword"
                      ? "active"
                      : "text-light"
                  }`}
                >
                  <i className="bi bi-shield-lock me-2"></i> Change Password
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/rating"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/rating" ? "active" : "text-light"
                  }`}
                >
                  <i className="bi bi-star-fill me-2"></i> Rating
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/orderstatus"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/orderstatus"
                      ? "active"
                      : "text-light"
                  }`}
                >
                  <i className="bi bi-check2-square me-2"></i> Order Status
                </Link>
              </li>
            </>
          )}


          {/* Admin Menu Items - Only show if user is logged in and is Admin */}
          {isLoggedIn && isUser && (
            <>

              <li className="nav-item">
                <Link
                  to="/feedback"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/feedback" ? "active" : "text-light"
                  }`}
                >
                  <i className="bi bi-chat-dots me-2"></i> Feedback
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/changepassword"
                  className={`nav-link d-flex align-items-center ${
                    location.pathname === "/changepassword"
                      ? "active"
                      : "text-light"
                  }`}
                >
                  <i className="bi bi-shield-lock me-2"></i> Change Password
                </Link>
              </li>
            </>
          )}


        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
