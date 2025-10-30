import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";
window.bootstrap = bootstrap; // ✅ agar modal bisa berfungsi

export default function Poliklinik() {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    pol_id: "",
    pol_name: "",
    pol_description: "",
  });
  const [editMode, setEditMode] = useState(false);

  // 🔹 Ambil data dari backend
  const fetchData = async () => {
    try {
      const res = await API.get("/poliklinik");
      setData(res.data.polikliniks);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Buka modal
  const openModal = () => {
    const modal = new window.bootstrap.Modal(
      document.getElementById("poliklinikModal")
    );
    modal.show();
  };

  // 🔹 Tutup modal
  const closeModal = () => {
    const modal = window.bootstrap.Modal.getInstance(
      document.getElementById("poliklinikModal")
    );
    modal.hide();
  };

  // 🔹 Tambah atau Update data
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      Swal.fire({
        title: editMode ? "Updating..." : "Saving...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      if (editMode) {
        await API.put(`/poliklinik/${form.pol_id}`, form);
        Swal.fire("Success!", "Poliklinik updated successfully.", "success");
      } else {
        await API.post("/poliklinik", form);
        Swal.fire("Success!", "Poliklinik added successfully.", "success");
      }

      setForm({ pol_id: "", pol_name: "", pol_description: "" });
      setEditMode(false);
      closeModal();
      fetchData();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 422 && err.response?.data?.errors) {
        const errorList = Object.values(err.response.data.errors)
          .map((msgs) => msgs.join(", "))
          .join("\n");
        Swal.fire("Validation Error", errorList, "warning");
      } else {
        Swal.fire(
          "Error!",
          err.response?.data?.message || "Failed to save Poliklinik.",
          "error"
        );
      }
    }
  };

  // 🔹 Edit data
  const handleEdit = (item) => {
    setForm(item);
    setEditMode(true);
    openModal();
  };

  // 🔹 Hapus data
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This Poliklinik will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`/poliklinik/${id}`);
        Swal.fire("Deleted!", "Poliklinik deleted successfully.", "success");
        fetchData();
      } catch (err) {
        Swal.fire(
          "Error!",
          err.response?.data?.message || "Failed to delete Poliklinik.",
          "error"
        );
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
            <h3 className="fw-bold text-primary mb-3">🏥 Poliklinik Management</h3>
            <button
              className="btn btn-primary"
              onClick={() => {
                setForm({ pol_id: "", pol_name: "", pol_description: "" });
                setEditMode(false);
                openModal();
              }}
            >
              <i className="bi bi-plus-circle me-1"></i> Add Poliklinik
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
                    <th>Description</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((p) => (
                      <tr key={p.pol_id}>
                        <td>{p.pol_id}</td>
                        <td>{p.pol_name}</td>
                        <td>{p.pol_description || "-"}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => handleEdit(p)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(p.pol_id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-3">
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
        id="poliklinikModal"
        tabIndex="-1"
        aria-labelledby="poliklinikModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="poliklinikModalLabel">
                {editMode ? "Edit Poliklinik" : "Add Poliklinik"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {!editMode && (
                  <input
                    className="form-control mb-3"
                    placeholder="Poliklinik ID (10 chars)"
                    value={form.pol_id}
                    onChange={(e) =>
                      setForm({ ...form, pol_id: e.target.value })
                    }
                    required
                  />
                )}
                <input
                  className="form-control mb-3"
                  placeholder="Poliklinik Name"
                  value={form.pol_name}
                  onChange={(e) =>
                    setForm({ ...form, pol_name: e.target.value })
                  }
                  required
                />
                <textarea
                  className="form-control mb-3"
                  placeholder="Description (optional)"
                  value={form.pol_description}
                  onChange={(e) =>
                    setForm({ ...form, pol_description: e.target.value })
                  }
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
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
