import { useEffect, useState } from "react";
import { getDashboard } from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await getDashboard();

      console.log("DASHBOARD RESPONSE:", response.data);

      /*
        Backend response:

        {
          success: true,
          role: "admin/student",
          data: {...}
        }
      */

      setRole(response.data.role);
      setDashboard(response.data.data);
    } catch (error) {
      console.error("Dashboard error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading">
        <p>{error}</p>
      </div>
    );
  }

  // =====================================================
  // ADMIN DASHBOARD
  // Backend:
  // totalStudents
  // totalCourses
  // totalEnrollments
  // courseStats
  // recentEnrollments
  // =====================================================

  if (role === "admin") {
    const totalStudents =
      dashboard?.totalStudents || 0;

    const totalCourses =
      dashboard?.totalCourses || 0;

    const totalEnrollments =
      dashboard?.totalEnrollments || 0;

    const courseStats =
      dashboard?.courseStats || [];

    const recentEnrollments =
      dashboard?.recentEnrollments || [];

    return (
      <div className="app-layout">

        <Sidebar />

        <div className="main-section">

          <Navbar />

          <main className="main-content">

            <div className="page-header">
              <div>
                <h1>Admin Dashboard</h1>

                <p>
                  Complete Student Course Management Overview
                </p>
              </div>
            </div>

            {/* ================= STATS ================= */}

            <div className="stats-grid">

              <div className="stat-card blue">

                <div>
                  <p>Total Students</p>

                  <h2>
                    {totalStudents}
                  </h2>
                </div>

                <div className="stat-icon">
                  👨‍🎓
                </div>

              </div>

              <div className="stat-card purple">

                <div>
                  <p>Total Courses</p>

                  <h2>
                    {totalCourses}
                  </h2>
                </div>

                <div className="stat-icon">
                  📚
                </div>

              </div>

              <div className="stat-card green">

                <div>
                  <p>Total Enrollments</p>

                  <h2>
                    {totalEnrollments}
                  </h2>
                </div>

                <div className="stat-icon">
                  📝
                </div>

              </div>

            </div>

            {/* ================= COURSE STATS ================= */}

            <div className="content-card">

              <div className="card-header">

                <div>
                  <h2>
                    Course-wise Enrollment
                  </h2>

                  <p>
                    Overview of student enrollment by course
                  </p>
                </div>

              </div>

              <div className="table-wrapper">

                <table>

                  <thead>

                    <tr>
                      <th>Course</th>
                      <th>Duration</th>
                      <th>Fee</th>
                      <th>Enrollments</th>
                    </tr>

                  </thead>

                  <tbody>

                    {courseStats.length === 0 ? (

                      <tr>
                        <td colSpan="4">
                          No courses available
                        </td>
                      </tr>

                    ) : (

                      courseStats.map((course) => (

                        <tr key={course.id}>

                          <td>
                            <strong>
                              {course.name}
                            </strong>
                          </td>

                          <td>
                            {course.duration}
                          </td>

                          <td>
                            ₹{course.fee}
                          </td>

                          <td>
                            <span className="badge">
                              {course.enrollment_count}
                            </span>
                          </td>

                        </tr>

                      ))

                    )}

                  </tbody>

                </table>

              </div>

            </div>

            {/* ================= RECENT ENROLLMENTS ================= */}

            <div className="content-card">

              <div className="card-header">

                <div>
                  <h2>
                    Recent Enrollments
                  </h2>

                  <p>
                    Latest student course enrollments
                  </p>
                </div>

              </div>

              <div className="table-wrapper">

                <table>

                  <thead>

                    <tr>
                      <th>Student</th>
                      <th>Email</th>
                      <th>Course</th>
                      <th>Date</th>
                    </tr>

                  </thead>

                  <tbody>

                    {recentEnrollments.length === 0 ? (

                      <tr>
                        <td colSpan="4">
                          No enrollments available
                        </td>
                      </tr>

                    ) : (

                      recentEnrollments.map(
                        (item) => (

                          <tr key={item.id}>

                            <td>
                              <strong>
                                {item.student_name}
                              </strong>
                            </td>

                            <td>
                              {item.student_email}
                            </td>

                            <td>
                              {item.course_name}
                            </td>

                            <td>
                              {item.enrollment_date
                                ? new Date(
                                    item.enrollment_date
                                  ).toLocaleDateString()
                                : "-"}
                            </td>

                          </tr>

                        )
                      )

                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </main>

        </div>

      </div>
    );
  }

  // =====================================================
  // STUDENT DASHBOARD
  // Backend:
  // student
  // totalEnrollments
  // enrollments
  // =====================================================

  const student =
    dashboard?.student;

  const enrollments =
    dashboard?.enrollments || [];

  const totalEnrollments =
    dashboard?.totalEnrollments || 0;

  return (
    <div className="app-layout">

      <Sidebar />

      <div className="main-section">

        <Navbar />

        <main className="main-content">

          <div className="page-header">

            <div>

              <h1>
                Welcome,{" "}
                {student?.name ||
                  user?.name ||
                  "Student"}{" "}
                👋
              </h1>

              <p>
                Here is your course and enrollment information.
              </p>

            </div>

          </div>

          {/* ================= STUDENT INFO ================= */}

          {student && (

            <div className="content-card">

              <div className="card-header">

                <div>
                  <h2>
                    My Profile
                  </h2>

                  <p>
                    Your student information
                  </p>
                </div>

              </div>

              <div className="profile-info">

                <p>
                  <strong>Name:</strong>{" "}
                  {student.name}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {student.email}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {student.phone || "-"}
                </p>

                <p>
                  <strong>Date of Joining:</strong>{" "}
                  {student.date_of_joining
                    ? new Date(
                        student.date_of_joining
                      ).toLocaleDateString()
                    : "-"}
                </p>

              </div>

            </div>

          )}

          {/* ================= STATS ================= */}

          <div className="stats-grid">

            <div className="stat-card blue">

              <div>
                <p>My Enrollments</p>

                <h2>
                  {totalEnrollments}
                </h2>
              </div>

              <div className="stat-icon">
                📝
              </div>

            </div>

            <div className="stat-card purple">

              <div>
                <p>My Courses</p>

                <h2>
                  {enrollments.length}
                </h2>
              </div>

              <div className="stat-icon">
                📚
              </div>

            </div>

          </div>

          {/* ================= MY COURSES ================= */}

          <div className="content-card">

            <div className="card-header">

              <div>
                <h2>
                  My Courses
                </h2>

                <p>
                  Courses you are currently enrolled in
                </p>
              </div>

            </div>

            {enrollments.length === 0 ? (

              <div className="empty-state">

                <div style={{ fontSize: "40px" }}>
                  📚
                </div>

                <h3>
                  No courses yet
                </h3>

                <p>
                  You are not enrolled in any course yet.
                </p>

              </div>

            ) : (

              <div className="table-wrapper">

                <table>

                  <thead>

                    <tr>
                      <th>Course</th>
                      <th>Duration</th>
                      <th>Fee</th>
                      <th>Enrollment Date</th>
                    </tr>

                  </thead>

                  <tbody>

                    {enrollments.map(
                      (item) => (

                        <tr key={item.id}>

                          <td>

                            <strong>
                              {item.course_name}
                            </strong>

                            {item.description && (

                              <small
                                style={{
                                  display: "block",
                                  color: "#8993a4",
                                  marginTop: "4px",
                                }}
                              >
                                {item.description}
                              </small>

                            )}

                          </td>

                          <td>
                            {item.duration}
                          </td>

                          <td>
                            ₹{item.fee}
                          </td>

                          <td>
                            {item.enrollment_date
                              ? new Date(
                                  item.enrollment_date
                                ).toLocaleDateString()
                              : "-"}
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

    </div>
  );
}

export default Dashboard;
