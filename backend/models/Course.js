const db = require("../config/db");

const getAllCourses = async (search = "") => {
  const searchValue = `%${search}%`;

  const [rows] = await db.pool.query(
    `
    SELECT *
    FROM courses
    WHERE name LIKE ?
       OR description LIKE ?
    ORDER BY id DESC
    `,
    [searchValue, searchValue]
  );

  return rows;
};

const getCourseById = async (id) => {
  const [rows] = await db.pool.query(
    `
    SELECT *
    FROM courses
    WHERE id = ?
    `,
    [id]
  );

  return rows[0];
};

const createCourse = async (data) => {
  const {
    name,
    description,
    duration,
    fee
  } = data;

  const [result] = await db.pool.query(
    `
    INSERT INTO courses
    (name, description, duration, fee)
    VALUES (?, ?, ?, ?)
    `,
    [
      name,
      description || null,
      duration,
      fee || 0
    ]
  );

  return result.insertId;
};

const updateCourse = async (id, data) => {
  const {
    name,
    description,
    duration,
    fee
  } = data;

  const [result] = await db.pool.query(
    `
    UPDATE courses
    SET
      name = ?,
      description = ?,
      duration = ?,
      fee = ?
    WHERE id = ?
    `,
    [
      name,
      description || null,
      duration,
      fee || 0,
      id
    ]
  );

  return result.affectedRows;
};

const deleteCourse = async (id) => {
  const [result] = await db.pool.query(
    `
    DELETE FROM courses
    WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows;
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
};
