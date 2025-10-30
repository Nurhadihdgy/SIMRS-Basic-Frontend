import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";
import Swal from "sweetalert2";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("username");

  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout",
    });

    if (confirm.isConfirmed) {
      try {
        await API.post("/auth/logout");
        localStorage.clear();
        navigate("/");
        Swal.fire(
          "Logged Out",
          "You have been logged out successfully.",
          "success"
        );
      } catch (e) {
        console.error("Logout failed:", e);
        Swal.fire("Error", "Logout failed. Please try again.", "error");
      }
    }
  };

  const menuItems = [
    { path: "/profile", label: "Profile", icon: "bi-person-circle" },
    { path: "/doctor", label: "Doctor", icon: "bi-hospital" },
    { path: "/poliklinik", label: "Poliklinik", icon: "bi-building" },
    { path: "/schedule", label: "Schedule", icon: "bi-calendar-week" },
  ];

  return (
    <div
      className="d-flex flex-column p-3 text-white shadow"
      style={{
        width: "240px",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        background: "linear-gradient(180deg, #007bff 0%, #6610f2 100%)",
        transition: "0.3s ease-in-out",
      }}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <h4 className="fw-bold mb-0">🏥 SIMRS</h4>
        <small className="text-light opacity-75">Healthcare System</small>
      </div>

      {/* User info */}
      <div
        className="text-center border-bottom border-light pb-3 mb-3"
        style={{ fontSize: "0.9rem" }}
      >
        <i className="bi bi-person-circle me-2 fs-5"></i>
        <span>Welcome,</span>
        <br />
        <strong>{username}</strong>
      </div>

      {/* Menu List */}
      <ul className="nav flex-column">
        {menuItems.map((item) => (
          <li key={item.path} className="nav-item mb-2">
            <Link
              to={item.path}
              className={`nav-link d-flex align-items-center text-primary px-3 py-2 rounded ${
                location.pathname === item.path
                  ? "active bg-white text-primary fw-semibold"
                  : "text-white opacity-85"
              }`}
              style={{
                transition: "all 0.2s ease-in-out",
              }}
            >
              <i className={`bi ${item.icon} me-2`}></i>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout */}
      <button
        className="btn btn-outline-light mt-auto w-100 d-flex align-items-center justify-content-center gap-2"
        onClick={handleLogout}
        style={{
          borderRadius: "12px",
          fontWeight: "500",
          transition: "all 0.3s ease",
        }}
      >
        <i className="bi bi-box-arrow-right"></i> Logout
      </button>

      {/* Footer */}
      <div
        className="text-center text-light mt-3"
        style={{ fontSize: "0.8rem", opacity: 0.7 }}
      >
        © 2025 SIMRS
      </div>
    </div>
  );
}
