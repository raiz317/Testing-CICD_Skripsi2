import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/sidebar.css";
import Instockflow from "../assets/Instockflow.jpg";
import IconProfil from "../assets/icon.png";

function Sidebar(props) {
  const { user, onLogout } = props;
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [prevPathname, setPrevPathname] = useState(location.pathname);

  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    setIsDropdownOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    onLogout();
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-brand">
        <h4>
          <img src={Instockflow} alt="Logo Web" />
          InStockFlow
        </h4>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link
              className={`sidebar-link ${location.pathname === "/dashboard" ? "active" : ""}`}
              to="/dashboard"
            >
              <i className="bi bi-grid-1x2"></i> Dashboard
            </Link>
          </li>
          <li>
            <Link
              className={`sidebar-link ${location.pathname === "/products" ? "active" : ""}`}
              to="/products"
            >
              <i className="bi bi-box"></i> Products
            </Link>
          </li>
          <li>
            <Link
              className={`sidebar-link ${location.pathname === "/suppliers" ? "active" : ""}`}
              to="/suppliers"
            >
              <i className="bi bi-people"></i> Suppliers
            </Link>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div
          className={`user-dropdown ${isDropdownOpen ? "open" : ""}`}
          ref={dropdownRef}
        >
          <button
            className="dropdown-toggle-btn"
            type="button"
            onClick={handleToggleDropdown}
            aria-expanded={isDropdownOpen}
          >
            <img src={IconProfil} className="profile-avatar" alt="profile" />
            <span className="user-name">{user || "User"}</span>
          </button>

          <ul className="dropdown-menu-list">
            <li>
              <Link
                className="dropdown-item-link"
                to="/profile"
                onClick={() => setIsDropdownOpen(false)}
              >
                <i className="bi bi-person"></i> My Profile
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item-link text-danger"
                onClick={handleLogoutClick}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <i className="bi bi-box-arrow-left"></i> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
