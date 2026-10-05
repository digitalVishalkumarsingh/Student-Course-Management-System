import { useEffect, useState } from "react";
import { createCourse, updateCourse } from "../services/api";

function CourseForm({ course, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    fee: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData({
      name: course?.name || "",
      description: course?.description || "",
      duration: course?.duration || "",
      fee: course?.fee ?? "",
    });

    setError("");
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const name = formData.name.trim();
    const description = formData.description.trim();
    const duration = formData.duration.trim();

    if (!name || !duration) {
      setError("Course name and duration are required.");
      return;
    }

    if (
      formData.fee !== "" &&
      (Number.isNaN(Number(formData.fee)) ||
        Number(formData.fee) < 0)
    ) {
      setError("Fee must be a valid positive number.");
      return;
    }

    const data = {
      name,
      description,
      duration,
      fee: formData.fee === "" ? 0 : Number(formData.fee),
    };

    try {
      setLoading(true);

      if (course) {
        await updateCourse(course.id, data);
      } else {
        await createCourse(data);
      }

      onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong while saving the course."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>{course ? "Edit Course" : "Add Course"}</h2>

      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="course-name">Course Name</label>

        <input
          id="course-name"
          type="text"
          name="name"
          placeholder="Enter course name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="course-description">
          Description
        </label>

        <textarea
          id="course-description"
          name="description"
          placeholder="Enter course description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
        />
      </div>

      <div className="form-group">
        <label htmlFor="course-duration">
          Duration
        </label>

        <input
          id="course-duration"
          type="text"
          name="duration"
          placeholder="Example: 6 Months"
          value={formData.duration}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="course-fee">
          Course Fee
        </label>

        <input
          id="course-fee"
          type="number"
          name="fee"
          placeholder="Enter course fee"
          min="0"
          step="0.01"
          value={formData.fee}
          onChange={handleChange}
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
            ? "Saving..."
            : course
            ? "Update Course"
            : "Add Course"}
        </button>
      </div>
    </form>
  );
}

export default CourseForm;