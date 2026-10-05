const Enrollment = require("../models/Enrollment");
const db = require("../config/db");

const getEnrollments = async (req, res, next) => {
  try {
    const enrollments =
      await Enrollment.getAllEnrollments();

    res.json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    next(error);
  }
};

const createEnrollment = async (req, res, next) => {
  try {
    const {
      student_id,
      course_id,
      enrollment_date
    } = req.body;

    if (
      !student_id ||
      !course_id ||
      !enrollment_date
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Student, course and enrollment date are required"
      });
    }

    const [studentRows] = await db.query(
      "SELECT id FROM students WHERE id = ?",
      [student_id]
    );

    if (studentRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const [courseRows] = await db.query(
      "SELECT id FROM courses WHERE id = ?",
      [course_id]
    );

    if (courseRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    const [existingRows] = await db.query(
      `
      SELECT id
      FROM enrollments
      WHERE student_id = ?
        AND course_id = ?
      `,
      [student_id, course_id]
    );

    if (existingRows.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "Student is already enrolled in this course"
      });
    }

    const id =
      await Enrollment.createEnrollment({
        student_id,
        course_id,
        enrollment_date
      });

    const enrollment =
      await Enrollment.getEnrollmentById(id);

    res.status(201).json({
      success: true,
      message: "Enrollment created successfully",
      data: enrollment
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message:
          "Student is already enrolled in this course"
      });
    }

    next(error);
  }
};

const deleteEnrollment = async (req, res, next) => {
  try {
    const existing =
      await Enrollment.getEnrollmentById(
        req.params.id
      );

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found"
      });
    }

    await Enrollment.deleteEnrollment(
      req.params.id
    );

    res.json({
      success: true,
      message: "Enrollment deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEnrollments,
  createEnrollment,
  deleteEnrollment
};
