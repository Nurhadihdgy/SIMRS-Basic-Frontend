import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute digunakan untuk membatasi akses halaman
 * hanya untuk user yang sudah login (punya token di localStorage).
 * 
 * Jika belum login, user otomatis diarahkan ke halaman login (/)
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // jika belum login → redirect ke halaman login
    return <Navigate to="/" replace />;
  }

  // jika sudah login → izinkan buka halaman
  return children;
}
