import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";

// --- 1. Import CartProvider ---
import { CartProvider } from './contexts/CartContext'; // Make sure this path is correct

// Layout and Modal Components
import Header from "./Layout/Header";
import Sidebar from "./Layout/Sidebar";
import ResetPassword from './Layout/ResetPassword';

// Page Components
import Dashboard from "./Components/Dashboard";
import Category from "./Components/Category";
import Item from "./Components/Item";
import Quantity from "./Components/Quantity";
import ViewOrder from "./Components/ViewOrder";
import Payment from "./Components/Payment";
import Report from "./Components/Report";
import ChangePassword from "./Components/ChangePassword";
import Feedback from "./Components/Feedback";
import Rating from "./Components/Rating";
import OrderStatus from "./Components/OrderStatus";
import Profile from "./Components/Profile";
import Collection from "./Collection";
import Sample1 from './Sample1';
import Sample2 from './Sample2';
import ForgotPassword from './Layout/ForgotPassword';

// Super Admin Components
import User from "./Super Admin/User";
import Role from "./Super Admin/Role";
import UserRole from "./Super Admin/UserRole";
import ProtectedRoute from './contexts/ProtectedRoute';
import ProductDetail from './contexts/ProductDetails';
import Cart from './contexts/Cart';

function App() {
  // ... (all your existing state and handlers remain unchanged)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      setIsLoggedIn(true);
      try {
        setUserRole(JSON.parse(role));
      } catch (error) {
        console.error("Error parsing role data:", error);
      }
    }
  }, []);

  const handleLoginSuccess = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      setIsLoggedIn(true);
      try {
        setUserRole(JSON.parse(role));
        setShowLogin(false);
        setShowSignup(false);
        setShowForgotPassword(false);
      } catch (error) {
        console.error("Error parsing role data on login:", error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setUserRole(null);
  };

  const getRoleString = (role) => {
    if (typeof role === "string") return role.toLowerCase();
    if (typeof role === "object" && role) {
      return (role.name || role.roleName || role.role || role.type || "").toLowerCase();
    }
    return "";
  };

  const roleStr = getRoleString(userRole);
  const isSuperAdmin = roleStr.includes("super admin");
  const isAdmin = roleStr.includes("admin") && !isSuperAdmin;
  const isUser = roleStr.includes("user");

  return (
    <BrowserRouter>
      {/* --- 2. Wrap your app's content with CartProvider --- */}
      <CartProvider>
        <Header
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          onLoginSuccess={handleLoginSuccess}
          showLogin={showLogin}
          setShowLogin={setShowLogin}
          showSignup={showSignup}
          setShowSignup={setShowSignup}
          showForgotPassword={showForgotPassword}
          setShowForgotPassword={setShowForgotPassword}
        />

        <div className="d-flex">
          <Sidebar isLoggedIn={isLoggedIn} isSuperAdmin={isSuperAdmin} isAdmin={isAdmin} isUser={isUser} />
          <div className="flex-grow-1 p-4">
            <Routes>
              {/* All your routes remain exactly the same */}
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/product/:id"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn} setShowLogin={setShowLogin}>
                    <ProductDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn} setShowLogin={setShowLogin}>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/sample1" element={<Sample1 />} />
              <Route path="/sample2" element={<Sample2 />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />

              {isSuperAdmin && (
                <>
                  <Route path="/user" element={<User />} />
                  <Route path="/role" element={<Role />} />
                  <Route path="/userrole" element={<UserRole />} />
                  <Route path="/changepassword" element={<ChangePassword />} />
                  <Route path="/profile" element={<Profile />} />
                </>
              )}

              {isAdmin && (
                <>
                  <Route path="/category" element={<Category />} />
                  <Route path="/item" element={<Item />} />
                  <Route path="/quantity" element={<Quantity />} />
                  <Route path="/vieworder" element={<ViewOrder />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/report" element={<Report />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/changepassword" element={<ChangePassword />} />
                  <Route path="/rating" element={<Rating />} />
                  <Route path="/orderstatus" element={<OrderStatus />} />
                  <Route path="/profile" element={<Profile />} />
                </>
              )}

              {isUser && (
                <>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/vieworder" element={<ViewOrder />} />
                  <Route path="/changepassword" element={<ChangePassword />} />
                  <Route path="/feedback" element={<Feedback />} />
                </>
              )}
              
              {isLoggedIn && <Route path="*" element={<Dashboard />} />}
            </Routes>
          </div>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;