import { useEffect, useState } from "react";
import {
  getStudents,
  deleteStudent,
} from "../services/api";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Modal from "../components/Modal";
import StudentForm from "../components/StudentForm";

function Students() {
  const [students, setStudents] = useState([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingStudent, setEditingStudent] =
    useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async (searchValue = search) => {
    try {
      setLoading(true);
      setError("");

      const response = await getStudents(searchValue);

      setStudents(response.data.data || []);
    } catch (err) {
      console.error(
        "Students error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load students."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;

    setSearch(value);

    try {
      const response = await getStudents(value);

      setStudents(
        response.data.data || []
      );
    } catch (err) {
      console.error(
        "Student search error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to search students."
      );
    }
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setShowModal(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowModal(true);
  };

  const handleDeleteStudent = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteStudent(id);

      await loadStudents();
    } catch (err) {
      console.error(
        "Delete student error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to delete student."
      );
    }
  };

  const handleStudentSaved = async () => {
    setShowModal(false);
    setEditingStudent(null);

    await loadStudents();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStudent(null);
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <main className="page">

          <div className="page-header">
            <div>
              <h1>Students</h1>

              <p>
                Manage students and their course
                enrollment.
              </p>
            </div>

            <button
              type="button"
              className="primary-btn"
              onClick={handleAddStudent}
            >
              + Add Student
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="toolbar">
            <input
              type="text"
              className="search-input"
              placeholder="Search students..."
              value={search}
              onChange={handleSearch}
            />
          </div>

          <div className="content-card">

            {loading ? (
              <div className="loading">
                Loading students...
              </div>
            ) : students.length === 0 ? (
              <div className="empty-state">
                <div
                  style={{
                    fontSize: "40px",
                  }}
                >
                  👨‍🎓
                </div>

                <h3>
                  No students found
                </h3>

                <p>
                  Add a student to get started.
                </p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Course</th>
                      <th>Date of Joining</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map(
                      (student) => (
                        <tr
                          key={student.id}
                        >
                          <td>
                            #{student.id}
                          </td>

                          <td>
                            <strong>
                              {student.name}
                            </strong>
                          </td>

                          <td>
                            {student.email}
                          </td>

                          <td>
                            {student.phone ||
                              "-"}
                          </td>

                          <td>
                            {student.course ||
                              "-"}
                          </td>

                          <td>
                            {formatDate(
                              student.date_of_joining
                            )}
                          </td>

                          <td>
                            <div className="table-actions">

                              <button
                                type="button"
                                className="edit-btn"
                                onClick={() =>
                                  handleEditStudent(
                                    student
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                className="delete-btn"
                                onClick={() =>
                                  handleDeleteStudent(
                                    student.id
                                  )
                                }
                              >
                                Delete
                              </button>

                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>

                </table>
              </div>
            )}

          </div>
        </main>
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={
          editingStudent
            ? "Edit Student"
            : "Add Student"
        }
        size="medium"
      >
        <StudentForm
          student={editingStudent}
          onSuccess={handleStudentSaved}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
}

export default Students;
