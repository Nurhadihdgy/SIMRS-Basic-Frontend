import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";
window.bootstrap = bootstrap; // agar modal Bootstrap berfungsi

export default function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]); // 🔹 daftar dokter
  const [polikliniks, setPolikliniks] = useState([]); // 🔹 daftar poliklinik

  const [form, setForm] = useState({
    doctor_id: "",
    pol_id: "",
    schedule_date: "",
    schedule_start: "",
    schedule_end: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Ambil data dari backend
  const fetchSchedules = async () => {
    try {
      const res = await API.get("/schedule");
      setSchedules(res.data.schedules || []);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch schedules", "error");
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await API.get("/doctor");
      setDoctors(res.data.doctors || []);
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
    }
  };

  const fetchPolikliniks = async () => {
    try {
      const res = await API.get("/poliklinik");
      setPolikliniks(res.data.polikliniks || []);
    } catch (err) {
      console.error("Failed to fetch polikliniks:", err);
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchDoctors();
    fetchPolikliniks();
  }, []);

  // Modal
  const openModal = () => {
    const modal = new window.bootstrap.Modal(
      document.getElementById("scheduleModal")
    );
    modal.show();
  };

  const closeModal = () => {
    const modal = window.bootstrap.Modal.getInstance(
      document.getElementById("scheduleModal")
    );
    modal.hide();
  };

  // Validasi
  const validateForm = () => {
    const today = new Date();
    const selectedDate = new Date(form.schedule_date);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (selectedDate < tomorrow) {
      Swal.fire("Error", "Schedule date must be at least tomorrow.", "error");
      return false;
    }

    if (form.schedule_start < "06:00" || form.schedule_end < "06:00") {
      Swal.fire("Error", "Schedule time must start from 06:00 AM.", "error");
      return false;
    }

    if (form.schedule_end <= form.schedule_start) {
      Swal.fire("Error", "End time must be after start time.", "error");
      return false;
    }

    if (!form.doctor_id || !form.pol_id) {
      Swal.fire("Error", "Please select Doctor and Poliklinik.", "error");
      return false;
    }

    return true;
  };

  // Tambah / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      Swal.fire({
        title: editingId ? "Updating..." : "Saving...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      // Pastikan waktu diformat jadi H:i (tanpa detik)
      const formattedForm = {
        ...form,
        schedule_start: form.schedule_start.slice(0, 5),
        schedule_end: form.schedule_end.slice(0, 5),
      };

      if (editingId) {
        await API.put(`/schedule/${editingId}`, formattedForm);
        Swal.fire("Updated!", "Schedule updated successfully.", "success");
      } else {
        await API.post("/schedule", formattedForm);
        Swal.fire("Added!", "Schedule created successfully.", "success");
      }

      setForm({
        doctor_id: "",
        pol_id: "",
        schedule_date: "",
        schedule_start: "",
        schedule_end: "",
      });
      setEditingId(null);
      closeModal();
      fetchSchedules();
    } catch (err) {
      console.error(err.response?.data);
      Swal.fire(
        "Error!",
        err.response?.data?.message || "Failed to save schedule.",
        "error"
      );
    }
  };

  // Edit
  const handleEdit = (item) => {
    setEditingId(item.schedule_id);
    setForm({
      doctor_id: item.doctor_id,
      pol_id: item.pol_id,
      schedule_date: item.schedule_date,
      schedule_start: item.schedule_start,
      schedule_end: item.schedule_end,
    });
    openModal();
  };

  // Delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This schedule will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "Deleting...",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        await API.delete(`/schedule/${id}`);
        fetchSchedules();

        Swal.fire("Deleted!", "Schedule deleted successfully.", "success");
      } catch (err) {
        Swal.fire(
          "Error!",
          err.response?.data?.message || "Failed to delete schedule.",
          "error"
        );
      }
    }
  };

  return (
    <>
      <Sidebar />

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
            <h3 className="fw-bold text-primary mb-3">
              📅 Schedule Management
            </h3>
            <button
              className="btn btn-primary"
              onClick={() => {
                setForm({
                  doctor_id: "",
                  pol_id: "",
                  schedule_date: "",
                  schedule_start: "",
                  schedule_end: "",
                });
                setEditingId(null);
                openModal();
              }}
            >
              <i className="bi bi-plus-circle me-1"></i> Add Schedule
            </button>
          </div>

          <div className="card shadow-sm p-3 border-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-primary">
                  <tr>
                    <th>#</th>
                    <th>Doctor</th>
                    <th>Poliklinik</th>
                    <th>Date</th>
                    <th>Start</th>
                    <th>End</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.length > 0 ? (
                    schedules.map((s, i) => (
                      <tr key={s.schedule_id}>
                        <td>{i + 1}</td>
                        <td>{s.doctor_id}</td>
                        <td>{s.pol_id}</td>
                        <td>{s.schedule_date}</td>
                        <td>{s.schedule_start}</td>
                        <td>{s.schedule_end}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => handleEdit(s)}
                            disabled={new Date(s.schedule_date) < new Date()}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(s.schedule_id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-3">
                        No schedules available
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
        id="scheduleModal"
        tabIndex="-1"
        aria-labelledby="scheduleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="scheduleModalLabel">
                {editingId ? "Edit Schedule" : "Add Schedule"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {!editingId && (
                  <>
                    {/* 🔹 Dropdown Doctor */}
                    <select
                      className="form-select mb-3"
                      value={form.doctor_id}
                      onChange={(e) =>
                        setForm({ ...form, doctor_id: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Doctor</option>
                      {doctors.map((d) => (
                        <option key={d.doctor_id} value={d.doctor_id}>
                          {d.doctor_name} ({d.doctor_id})
                        </option>
                      ))}
                    </select>

                    {/* 🔹 Dropdown Poliklinik */}
                    <select
                      className="form-select mb-3"
                      value={form.pol_id}
                      onChange={(e) =>
                        setForm({ ...form, pol_id: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Poliklinik</option>
                      {polikliniks.map((p) => (
                        <option key={p.pol_id} value={p.pol_id}>
                          {p.pol_name} ({p.pol_id})
                        </option>
                      ))}
                    </select>
                  </>
                )}

                <input
                  type="date"
                  className="form-control mb-3"
                  value={form.schedule_date}
                  onChange={(e) =>
                    setForm({ ...form, schedule_date: e.target.value })
                  }
                  required
                />
                <div className="row">
                  <div className="col-md-6">
                    <input
                      type="time"
                      className="form-control mb-3"
                      value={form.schedule_start}
                      onChange={(e) =>
                        setForm({ ...form, schedule_start: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="time"
                      className="form-control mb-3"
                      value={form.schedule_end}
                      onChange={(e) =>
                        setForm({ ...form, schedule_end: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
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
                  {editingId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
