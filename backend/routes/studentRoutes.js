const express = require("express");

const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent
} = require("../controllers/studentController");

const {
  authenticate
} = require("../middleware/authMiddleware");

const {
  requireRole
} = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  authenticate,
  requireRole("admin"),
  getStudents
);

router.post(
  "/",
  authenticate,
  requireRole("admin"),
  createStudent
);

router.get(
  "/:id",
  authenticate,
  requireRole("admin"),
  getStudent
);

router.put(
  "/:id",
  authenticate,
  requireRole("admin"),
  updateStudent
);

router.delete(
  "/:id",
  authenticate,
  requireRole("admin"),
  deleteStudent
);

module.exports = router;
