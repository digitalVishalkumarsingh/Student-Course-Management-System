const Student = require("../models/Student");

const validateStudent = ({
  name,
  email,
  phone,
  date_of_joining
}) => {
  if (!name || !email || !phone || !date_of_joining) {
    return "Name, email, phone and date of joining are required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "Invalid email address";
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    return "Phone number must contain exactly 10 digits";
  }

  return null;
};

const getStudents = async (req, res, next) => {
  try {
    const students = await Student.getAllStudents(
      req.query.search || ""
    );

    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

const getStudent = async (req, res, next) => {
  try {
    const student = await Student.getStudentById(
      req.params.id
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

const createStudent = async (req, res, next) => {
  try {
    const errorMessage = validateStudent(req.body);

    if (errorMessage) {
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }

    const id = await Student.createStudent(req.body);

    const student = await Student.getStudentById(id);

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Email already exists"
      });
    }

    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const existing = await Student.getStudentById(
      req.params.id
    );

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const errorMessage = validateStudent(req.body);

    if (errorMessage) {
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }

    await Student.updateStudent(
      req.params.id,
      req.body
    );

    const student = await Student.getStudentById(
      req.params.id
    );

    res.json({
      success: true,
      message: "Student updated successfully",
      data: student
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Email already exists"
      });
    }

    next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const existing = await Student.getStudentById(
      req.params.id
    );

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    await Student.deleteStudent(req.params.id);

    res.json({
      success: true,
      message: "Student deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent
};
