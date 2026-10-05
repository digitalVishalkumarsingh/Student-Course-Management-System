const db = require("../config/db");

const getAllStudents = async (search = "") => {
  const searchValue = `%${search}%`;

  const [rows] = await db.pool.query(
    `
    SELECT
      s.id,
      s.name,
      s.email,
      s.phone,
      s.date_of_joining,
      s.created_at
    FROM students s
    WHERE s.name LIKE ?
       OR s.email LIKE ?
       OR s.phone LIKE ?
    ORDER BY s.id DESC
    `,
    [
      searchValue,
      searchValue,
      searchValue
    ]
  );

  return rows;
};

const getStudentById = async (id) => {
  const [rows] = await db.pool.query(
    `
    SELECT
      s.id,
      s.name,
      s.email,
      s.phone,
      s.date_of_joining,
      s.created_at
    FROM students s
    WHERE s.id = ?
    `,
    [id]
  );

  return rows[0];
};

const createStudent = async (data) => {
  const {
    name,
    email,
    phone,
    date_of_joining
  } = data;

  const [result] = await db.pool.query(
    `
    INSERT INTO students
    (name, email, phone, date_of_joining)
    VALUES (?, ?, ?, ?)
    `,
    [
      name,
      email,
      phone,
      date_of_joining
    ]
  );

  return result.insertId;
};

const updateStudent = async (id, data) => {
  const {
    name,
    email,
    phone,
    date_of_joining
  } = data;

  const [result] = await db.pool.query(
    `
    UPDATE students
    SET
      name = ?,
      email = ?,
      phone = ?,
      date_of_joining = ?
    WHERE id = ?
    `,
    [
      name,
      email,
      phone,
      date_of_joining,
      id
    ]
  );

  return result.affectedRows;
};

const deleteStudent = async (id) => {
  const [result] = await db.pool.query(
    `
    DELETE FROM students
    WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows;
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
