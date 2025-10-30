import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';


export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.user.user_full_name);
      Swal.fire("Success", "Login successful", "success");
      navigate("/profile");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Login failed", "error");
        setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
  <div
    className="d-flex justify-content-center align-items-center vh-100 bg-light"
    style={{
      background: "linear-gradient(to right, #74ebd5, #ACB6E5)",
    }}
  >
    <div
      className="card shadow p-4"
      style={{
        width: "400px",
        borderRadius: "15px",
        backgroundColor: "white",
      }}
    >
      <h3 className="text-center mb-4 fw-bold text-primary">SIMRS Login</h3>

      {error && (
        <div className="alert alert-danger text-center py-2">{error}</div>
      )}

      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Username</label>
          <input
            className="form-control"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          className="btn btn-primary w-100 fw-semibold"
          style={{ borderRadius: "8px" }}
        >
          Login
        </button>
      </form>

      <div className="text-center mt-3 text-muted" style={{ fontSize: "0.9rem" }}>
        <i className="bi bi-hospital me-1 text-primary"></i>
        Sistem Informasi Rumah Sakit
      </div>
    </div>
  </div>
);
}
