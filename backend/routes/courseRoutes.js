const express = require("express");

const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
} = require("../controllers/courseController");

const {
  authenticate
} = require("../middleware/authMiddleware");

const {
  requireRole
} = require("../middleware/roleMiddleware");

const router = express.Router();

// Admin + Student
router.get(
  "/",
  authenticate,
  requireRole("admin", "student"),
  getCourses
);

router.get(
  "/:id",
  authenticate,
  requireRole("admin", "student"),
  getCourse
);

// Admin only
router.post(
  "/",
  authenticate,
  requireRole("admin"),
  createCourse
);

router.put(
  "/:id",
  authenticate,
  requireRole("admin"),
  updateCourse
);

router.delete(
  "/:id",
  authenticate,
  requireRole("admin"),
  deleteCourse
);

module.exports = router;
