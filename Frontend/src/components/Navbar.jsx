import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ user, onLogout, onToggleSidebar }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {onToggleSidebar && (
          <button
            className="navbar-toggle"
            onClick={onToggleSidebar}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        )}
        <span>Gatepass System</span>
      </div>

      <div
        className="navbar-toggle"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
        style={{ color: "white" }}
      >
        👤
      </div>

      <div className={`navbar-menu ${mobileMenuOpen ? "open" : ""}`}>
        {user && (
          <>
            <span className="navbar-link">
              Welcome, {`${user.name}(${user.hostel})`}
            </span>
            <span className="navbar-link">
              Role: {user.role === "student" ? "Student" : "Rector"}
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-secondary navbar-link"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
