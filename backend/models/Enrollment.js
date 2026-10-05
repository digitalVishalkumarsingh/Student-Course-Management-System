const db = require("../config/db");

// ==================== GET ALL ENROLLMENTS ====================

const getAllEnrollments = async () => {
  const [rows] = await db.pool.query(`
    SELECT
      e.id,
      e.student_id,
      e.course_id,
      e.enrollment_date,

      s.name AS student_name,
      s.email AS student_email,

      c.name AS course_name,
      c.duration,
      c.fee

    FROM enrollments e

    INNER JOIN students s
      ON e.student_id = s.id

    INNER JOIN courses c
      ON e.course_id = c.id

    ORDER BY e.id DESC
  `);

  return rows;
};

// ==================== GET ENROLLMENT BY ID ====================

const getEnrollmentById = async (id) => {
  const [rows] = await db.pool.query(
    `
    SELECT
      e.id,
      e.student_id,
      e.course_id,
      e.enrollment_date,

      s.name AS student_name,
      c.name AS course_name

    FROM enrollments e

    INNER JOIN students s
      ON e.student_id = s.id

    INNER JOIN courses c
      ON e.course_id = c.id

    WHERE e.id = ?
    `,
    [id]
  );

  return rows[0];
};

// ==================== CREATE ENROLLMENT ====================

const createEnrollment = async ({
  student_id,
  course_id,
  enrollment_date
}) => {
  const [result] = await db.pool.query(
    `
    INSERT INTO enrollments
    (student_id, course_id, enrollment_date)
    VALUES (?, ?, ?)
    `,
    [
      student_id,
      course_id,
      enrollment_date
    ]
  );

  return result.insertId;
};

// ==================== DELETE ENROLLMENT ====================

const deleteEnrollment = async (id) => {
  const [result] = await db.pool.query(
    `
    DELETE FROM enrollments
    WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows;
};

// ==================== ADMIN DASHBOARD ====================

const getDashboardData = async () => {
  const [[studentCount]] = await db.pool.query(`
    SELECT COUNT(*) AS totalStudents
    FROM students
  `);

  const [[courseCount]] = await db.pool.query(`
    SELECT COUNT(*) AS totalCourses
    FROM courses
  `);

  const [[enrollmentCount]] = await db.pool.query(`
    SELECT COUNT(*) AS totalEnrollments
    FROM enrollments
  `);

  const [courseStats] = await db.pool.query(`
    SELECT
      c.id,
      c.name,
      c.duration,
      c.fee,
      COUNT(e.id) AS enrollment_count

    FROM courses c

    LEFT JOIN enrollments e
      ON c.id = e.course_id

    GROUP BY
      c.id,
      c.name,
      c.duration,
      c.fee

    ORDER BY enrollment_count DESC
  `);

  const [recentEnrollments] = await db.pool.query(`
    SELECT
      e.id,
      e.enrollment_date,

      s.name AS student_name,
      s.email AS student_email,

      c.name AS course_name

    FROM enrollments e

    INNER JOIN students s
      ON e.student_id = s.id

    INNER JOIN courses c
      ON e.course_id = c.id

    ORDER BY e.id DESC

    LIMIT 5
  `);

  return {
    totalStudents: studentCount.totalStudents,
    totalCourses: courseCount.totalCourses,
    totalEnrollments: enrollmentCount.totalEnrollments,

    courseStats,

    recentEnrollments
  };
};

// ==================== STUDENT DASHBOARD ====================

const getStudentDashboardData = async (userId) => {
  const [rows] = await db.pool.query(
    `
    SELECT
      e.id,
      e.enrollment_date,

      c.id AS course_id,
      c.name AS course_name,
      c.description,
      c.duration,
      c.fee,

      s.name AS student_name,
      s.email AS student_email,
      s.phone,
      s.date_of_joining

    FROM enrollments e

    INNER JOIN students s
      ON e.student_id = s.id

    INNER JOIN courses c
      ON e.course_id = c.id

    INNER JOIN users u
      ON u.email = s.email

    WHERE u.id = ?

    ORDER BY e.id DESC
    `,
    [userId]
  );

  return {
    student:
      rows.length > 0
        ? {
            name: rows[0].student_name,
            email: rows[0].student_email,
            phone: rows[0].phone,
            date_of_joining: rows[0].date_of_joining
          }
        : null,

    totalEnrollments: rows.length,

    enrollments: rows
  };
};

module.exports = {
  getAllEnrollments,
  getEnrollmentById,
  createEnrollment,
  deleteEnrollment,
  getDashboardData,
  getStudentDashboardData
};
