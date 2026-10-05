const express = require("express");

const {
  getEnrollments,
  createEnrollment,
  deleteEnrollment
} = require("../controllers/enrollmentController");

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
  getEnrollments
);

// Admin + Student
router.post(
  "/",
  authenticate,
  requireRole("admin", "student"),
  createEnrollment
);

// Admin only for now
router.delete(
  "/:id",
  authenticate,
  requireRole("admin"),
  deleteEnrollment
);

module.exports = router;
