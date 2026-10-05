import { useState } from "react";
import {
  createStudent,
  updateStudent,
} from "../services/api";

function StudentForm({ student, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: student?.name || "",
    email: student?.email || "",
    phone: student?.phone || "",
    date_of_joining: student?.date_of_joining
      ? String(student.date_of_joining).split("T")[0]
      : "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Phone is required.");
      return;
    }

    if (!form.date_of_joining) {
      setError("Date of joining is required.");
      return;
    }

    try {
      setLoading(true);

      const studentData = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        date_of_joining: form.date_of_joining,
      };

      if (student) {
        await updateStudent(student.id, studentData);
      } else {
        await createStudent(studentData);
      }

      onSuccess();
    } catch (err) {
      console.error("Student save error:", err);

      setError(
        err.response?.data?.message ||
          "Something went wrong while saving the student."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>
            {student ? "Edit Student" : "Add Student"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            disabled={loading}
          >
            ×
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="student-name">
              Name
            </label>

            <input
              id="student-name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter student name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="student-email">
              Email
            </label>

            <input
              id="student-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter student email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="student-phone">
              Phone
            </label>

            <input
              id="student-phone"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter 10 digit phone number"
              maxLength="10"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="student-date">
              Date of Joining
            </label>

            <input
              id="student-date"
              type="date"
              name="date_of_joining"
              value={form.date_of_joining}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : student
                ? "Update Student"
                : "Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentForm;
