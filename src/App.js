import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Profile from "./pages/Profile";
import Doctor from "./pages/Doctor";
import Poliklinik from "./pages/Poliklinik";
import Schedule from "./pages/Schedule";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login bisa diakses semua user */}
        <Route path="/" element={<Login />} />

        {/* Halaman di bawah ini hanya bisa diakses kalau sudah login */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor"
          element={
            <ProtectedRoute>
              <Doctor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/poliklinik"
          element={
            <ProtectedRoute>
              <Poliklinik />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
