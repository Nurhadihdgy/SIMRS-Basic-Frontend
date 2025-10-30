import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";
window.bootstrap = bootstrap;

export default function Doctor() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    doctor_id: "",
    doctor_name: "",
    doctor_gender: "M",
    doctor_phone_number: "",
    doctor_address: "",
    doctor_email: "",
    doctor_bio: "",
  });
  const [editMode, setEditMode] = useState(false);

  // 🔹 Fetch data dokter
  const fetchData = async () => {
    try {
      const res = await API.get("/doctor");
      setData(res.data.doctors);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Buka Modal
  const openModal = () => {
    const modal = new window.bootstrap.Modal(document.getElementById("doctorModal"));
    modal.show();
  };

  // 🔹 Tutup Modal
  const closeModal = () => {
    const modal = window.bootstrap.Modal.getInstance(document.getElementById("doctorModal"));
    modal.hide();
  };

  // 🔹 Tambah / Update Dokter
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      Swal.fire({
        title: editMode ? "Updating..." : "Saving...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      if (editMode) {
        await API.put(`/doctor/${form.doctor_id}`, form);
        Swal.fire("Updated!", "Doctor updated successfully.", "success");
      } else {
        await API.post("/doctor", form);
        Swal.fire("Added!", "Doctor added successfully.", "success");
      }

      setForm({
        doctor_id: "",
        doctor_name: "",
        doctor_gender: "M",
        doctor_phone_number: "",
        doctor_address: "",
        doctor_email: "",
        doctor_bio: "",
      });
      setEditMode(false);
      closeModal();
      fetchData();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 422 && err.response?.data?.errors) {
        const errorList = Object.values(err.response.data.errors)
          .map((messages) => messages.join(", "))
          .join("\n");
        Swal.fire("Validation Error", errorList, "warning");
      } else {
        Swal.fire("Error!", err.response?.data?.message || "Something went wrong.", "error");
      }
    }
  };

  // 🔹 Edit Dokter
  const handleEdit = (item) => {
    setForm(item);
    setEditMode(true);
    openModal();
  };

  // 🔹 Hapus Dokter
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This doctor will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`/doctor/${id}`);
        Swal.fire("Deleted!", "Doctor has been deleted.", "success");
        fetchData();
      } catch (err) {
        Swal.fire("Error!", err.response?.data?.message || "Failed to delete", "error");
      }
    }
  };

  return (
    <>
      <Sidebar />

      {/* ===== Content Area ===== */}
      <div
        className="content-wrapper"
        style={{
          marginLeft: "250px",
          padding: "30px",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f8f9fa 0%, #eef2ff 100%)",
        }}
      >
        <div className="container-fluid">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
            <h3 className="fw-bold text-primary mb-3">👨‍⚕️ Doctor Management</h3>
            <button
              className="btn btn-primary"
              onClick={() => {
                setForm({
                  doctor_id: "",
                  doctor_name: "",
                  doctor_gender: "M",
                  doctor_phone_number: "",
                  doctor_address: "",
                  doctor_email: "",
                  doctor_bio: "",
                });
                setEditMode(false);
                openModal();
              }}
            >
              <i className="bi bi-plus-circle me-1"></i> Add Doctor
            </button>
          </div>

          {/* ===== Table Section ===== */}
          <div className="card shadow-sm p-3 border-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-primary">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Email</th>
                    <th>Bio</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((d) => (
                      <tr key={d.doctor_id}>
                        <td>{d.doctor_id}</td>
                        <td>{d.doctor_name}</td>
                        <td>{d.doctor_gender === "M" ? "Male" : "Female"}</td>
                        <td>{d.doctor_phone_number}</td>
                        <td>{d.doctor_address}</td>
                        <td>{d.doctor_email}</td>
                        <td>{d.doctor_bio}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => handleEdit(d)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(d.doctor_id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center text-muted py-3">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Modal Form ===== */}
      <div
        className="modal fade"
        id="doctorModal"
        tabIndex="-1"
        aria-labelledby="doctorModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="doctorModalLabel">
                {editMode ? "Edit Doctor" : "Add Doctor"}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {!editMode && (
                  <input
                    className="form-control mb-3"
                    placeholder="Doctor ID (15 chars)"
                    value={form.doctor_id}
                    onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
                    required
                  />
                )}
                <input
                  className="form-control mb-3"
                  placeholder="Doctor Name"
                  value={form.doctor_name}
                  onChange={(e) => setForm({ ...form, doctor_name: e.target.value })}
                  required
                />
                <select
                  className="form-select mb-3"
                  value={form.doctor_gender}
                  onChange={(e) => setForm({ ...form, doctor_gender: e.target.value })}
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
                <input
                  className="form-control mb-3"
                  placeholder="Phone Number"
                  value={form.doctor_phone_number}
                  onChange={(e) => setForm({ ...form, doctor_phone_number: e.target.value })}
                  required
                />
                <input
                  className="form-control mb-3"
                  placeholder="Address"
                  value={form.doctor_address}
                  onChange={(e) => setForm({ ...form, doctor_address: e.target.value })}
                />
                <input
                  className="form-control mb-3"
                  placeholder="Email"
                  type="email"
                  value={form.doctor_email}
                  onChange={(e) => setForm({ ...form, doctor_email: e.target.value })}
                  required
                />
                <textarea
                  className="form-control mb-3"
                  placeholder="Bio"
                  value={form.doctor_bio}
                  onChange={(e) => setForm({ ...form, doctor_bio: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editMode ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
