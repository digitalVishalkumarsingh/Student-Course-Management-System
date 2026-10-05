import { useEffect, useState } from "react";
import {
  getCourses,
  deleteCourse,
} from "../services/api";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CourseForm from "../components/CourseForm";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const role = user?.role;
  const isAdmin = role === "admin";

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async (searchValue = search) => {
    try {
      setLoading(true);
      setError("");

      const response = await getCourses(searchValue);

      setCourses(response.data.data || []);
    } catch (err) {
      console.error("Courses error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load courses."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;

    setSearch(value);

    try {
      const response = await getCourses(value);

      setCourses(response.data.data || []);
    } catch (err) {
      console.error("Course search error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to search courses."
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCourse(id);

      await loadCourses();
    } catch (err) {
      console.error("Delete course error:", err);

      alert(
        err.response?.data?.message ||
          "Unable to delete course."
      );
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCourse(null);
  };

  const handleFormSuccess = async () => {
    closeForm();
    await loadCourses();
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-section">
        <Navbar />

        <main className="main-content">
          <div className="page-header">
            <div>
              <h1>
                {isAdmin ? "Courses" : "My Courses"}
              </h1>

              <p>
                {isAdmin
                  ? "Manage available courses"
                  : "Browse available courses"}
              </p>
            </div>

            {isAdmin && (
              <button
                className="primary-btn"
                onClick={() => {
                  setEditingCourse(null);
                  setShowForm(true);
                }}
              >
                + Add Course
              </button>
            )}
          </div>

          <div className="toolbar">
            <input
              type="text"
              className="search-input"
              placeholder="Search courses..."
              value={search}
              onChange={handleSearch}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {loading ? (
            <div className="loading">
              Loading courses...
            </div>
          ) : courses.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: "40px" }}>
                📚
              </div>

              <h3>No courses found</h3>

              <p>
                {search
                  ? "Try a different search term."
                  : "No courses are available yet."}
              </p>
            </div>
          ) : (
            <div className="course-grid">
              {courses.map((course) => (
                <div
                  className="course-card"
                  key={course.id}
                >
                  <div className="course-card-top">
                    <span className="course-icon">
                      📚
                    </span>

                    <span className="course-id">
                      #{course.id}
                    </span>
                  </div>

                  <h2>{course.name}</h2>

                  <p>
                    {course.description ||
                      "No description available."}
                  </p>

                  <div className="course-info">
                    <span>
                      Duration: {course.duration}
                    </span>

                    <strong>
                      ₹{Number(course.fee || 0).toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  {isAdmin && (
                    <div className="course-actions">
                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() => {
                          setEditingCourse(course);
                          setShowForm(true);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(course.id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {isAdmin && showForm && (
        <CourseForm
          course={editingCourse}
          onCancel={closeForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

export default Courses;
