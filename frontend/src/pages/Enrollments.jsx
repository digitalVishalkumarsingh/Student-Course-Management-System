import { useEffect, useState } from "react";
import {
  getEnrollments,
  deleteEnrollment,
} from "../services/api";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import EnrollmentForm from "../components/Enrollmentform";

function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getEnrollments();

      setEnrollments(response.data.data || []);
    } catch (err) {
      console.error("Enrollments error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load enrollments."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this enrollment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteEnrollment(id);

      await loadEnrollments();
    } catch (err) {
      console.error("Delete enrollment error:", err);

      alert(
        err.response?.data?.message ||
          "Unable to delete enrollment."
      );
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <main className="page">
          <div className="page-header">
            <div>
              <h1>Enrollments</h1>

              <p>
                Manage student course enrollments
              </p>
            </div>

            <button
              className="primary-btn"
              onClick={() => setShowForm(true)}
            >
              + Enroll Student
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="content-card">
            {loading ? (
              <div className="loading">
                Loading enrollments...
              </div>
            ) : enrollments.length === 0 ? (
              <div className="empty-state">
                <div style={{ fontSize: "40px" }}>
                  📝
                </div>

                <h3>No enrollments found</h3>

                <p>
                  No students are enrolled in any course yet.
                </p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Student</th>
                      <th>Email</th>
                      <th>Course</th>
                      <th>Duration</th>
                      <th>Fee</th>
                      <th>Enrollment Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {enrollments.map((enrollment) => (
                      <tr key={enrollment.id}>
                        <td>
                          #{enrollment.id}
                        </td>

                        <td>
                          <strong>
                            {enrollment.student_name}
                          </strong>
                        </td>

                        <td>
                          {enrollment.student_email}
                        </td>

                        <td>
                          {enrollment.course_name}
                        </td>

                        <td>
                          {enrollment.duration || "-"}
                        </td>

                        <td>
                          {enrollment.fee !== null &&
                          enrollment.fee !== undefined
                            ? `₹${enrollment.fee}`
                            : "-"}
                        </td>

                        <td>
                          {formatDate(
                            enrollment.enrollment_date
                          )}
                        </td>

                        <td>
                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(
                                enrollment.id
                              )
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {showForm && (
        <EnrollmentForm
          onCancel={() => setShowForm(false)}
          onSuccess={async () => {
            setShowForm(false);
            await loadEnrollments();
          }}
        />
      )}
    </div>
  );
}

export default Enrollments;
