const Course = require("../models/Course");

const validateCourse = ({
  name,
  duration,
  fee
}) => {
  if (!name || !duration) {
    return "Course name and duration are required";
  }

  if (
    fee !== undefined &&
    (Number.isNaN(Number(fee)) || Number(fee) < 0)
  ) {
    return "Fee must be a valid positive number";
  }

  return null;
};

const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.getAllCourses(
      req.query.search || ""
    );

    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

const getCourse = async (req, res, next) => {
  try {
    const course = await Course.getCourseById(
      req.params.id
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const errorMessage = validateCourse(req.body);

    if (errorMessage) {
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }

    const id = await Course.createCourse(req.body);

    const course = await Course.getCourseById(id);

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Course already exists"
      });
    }

    next(error);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const existing = await Course.getCourseById(
      req.params.id
    );

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    const errorMessage = validateCourse(req.body);

    if (errorMessage) {
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }

    await Course.updateCourse(
      req.params.id,
      req.body
    );

    const course = await Course.getCourseById(
      req.params.id
    );

    res.json({
      success: true,
      message: "Course updated successfully",
      data: course
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Course already exists"
      });
    }

    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const existing = await Course.getCourseById(
      req.params.id
    );

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    await Course.deleteCourse(req.params.id);

    res.json({
      success: true,
      message: "Course deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
};
