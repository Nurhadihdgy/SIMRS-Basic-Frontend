import React from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

export default function Profile() {
  const username = localStorage.getItem("username");

  const menuCards = [
    {
      title: "Manage Doctors",
      desc: "Add, edit, or delete doctor data.",
      path: "/doctor",
      icon: "bi bi-person-badge",
      color: "#0d6efd",
    },
    {
      title: "Manage Poliklinik",
      desc: "Control all Poliklinik information.",
      path: "/poliklinik",
      icon: "bi bi-building",
      color: "#6610f2",
    },
    {
      title: "Manage Schedule",
      desc: "Set and manage doctor schedules.",
      path: "/schedule",
      icon: "bi bi-calendar-week",
      color: "#20c997",
    },
  ];

  return (
    <>
      <Sidebar />
      <div
        className="container-fluid d-flex justify-content-center align-items-center vh-100"
        style={{
          marginLeft: "240px",
          background: "linear-gradient(135deg, #f8f9fa 0%, #eef2ff 100%)",
        }}
      >
        <div
          className="card shadow-lg p-4"
          style={{
            borderRadius: "16px",
            maxWidth: "700px",
            width: "100%",
            backgroundColor: "white",
          }}
        >
          <div className="text-center mb-4">
            <h3 className="fw-bold text-primary">Welcome, {username} 👋</h3>
            <p className="text-muted">
              Select one of the management menus below to get started.
            </p>
          </div>

          <div className="row">
            {menuCards.map((menu) => (
              <div key={menu.path} className="col-md-4 mb-3">
                <Link
                  to={menu.path}
                  className="text-decoration-none"
                >
                  <div
                    className="card h-100 text-center shadow-sm p-3 border-0"
                    style={{
                      borderRadius: "12px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-5px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    <div
                      className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3"
                      style={{
                        width: "60px",
                        height: "60px",
                        backgroundColor: `${menu.color}22`,
                      }}
                    >
                      <i
                        className={`${menu.icon}`}
                        style={{ color: menu.color, fontSize: "1.8rem" }}
                      ></i>
                    </div>
                    <h6 className="fw-semibold text-dark">{menu.title}</h6>
                    <p
                      className="text-muted"
                      style={{ fontSize: "0.9rem", lineHeight: "1.2rem" }}
                    >
                      {menu.desc}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
