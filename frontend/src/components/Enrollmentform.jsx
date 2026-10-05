import { useEffect, useState } from "react";
import {
  getStudents,
  getCourses,
  createEnrollment,
} from "../services/api";

function EnrollmentForm({ onSuccess, onCancel }) {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    student_id: "",
    course_id: "",
    enrollment_date: new Date().toISOString().split("T")[0],
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoadingData(true);
      setError("");

      const [studentsResponse, coursesResponse] = await Promise.all([
        getStudents(),
        getCourses(),
      ]);

      setStudents(studentsResponse.data.data || []);
      setCourses(coursesResponse.data.data || []);
    } catch (err) {
      console.error("Enrollment form data error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load students and courses."
      );
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.student_id ||
      !formData.course_id ||
      !formData.enrollment_date
    ) {
      setError(
        "Please select student, course and enrollment date."
      );
      return;
    }

    try {
      setLoading(true);

      await createEnrollment({
        student_id: Number(formData.student_id),
        course_id: Number(formData.course_id),
        enrollment_date: formData.enrollment_date,
      });

      onSuccess();
    } catch (err) {
      console.error("Enrollment error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to enroll student."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="loading">
        Loading students and courses...
      </div>
    );
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Enroll Student</h2>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="student_id">
          Select Student
        </label>

        <select
          id="student_id"
          name="student_id"
          value={formData.student_id}
          onChange={handleChange}
          required
        >
          <option value="">
            -- Select Student --
          </option>

          {students.map((student) => (
            <option
              key={student.id}
              value={student.id}
            >
              {student.name} - {student.email}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="course_id">
          Select Course
        </label>

        <select
          id="course_id"
          name="course_id"
          value={formData.course_id}
          onChange={handleChange}
          required
        >
          <option value="">
            -- Select Course --
          </option>

          {courses.map((course) => (
            <option
              key={course.id}
              value={course.id}
            >
              {course.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="enrollment_date">
          Enrollment Date
        </label>

        <input
          id="enrollment_date"
          type="date"
          name="enrollment_date"
          value={formData.enrollment_date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading
            ? "Enrolling..."
            : "Enroll Student"}
        </button>
      </div>
    </form>
  );
}

export default EnrollmentForm;
