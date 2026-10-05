const db = require("../config/db");

const createUser = async (name, email, password) => {
  const [result] = await db.pool.query(
    `
    INSERT INTO users
    (name, email, password, role)
    VALUES (?, ?, ?, 'student')
    `,
    [name, email, password]
  );

  return result.insertId;
};

const findUserByEmail = async (email) => {
  const [rows] = await db.pool.query(
    `
    SELECT
      id,
      name,
      email,
      password,
      role
    FROM users
    WHERE email = ?
    `,
    [email]
  );

  return rows[0];
};

module.exports = {
  createUser,
  findUserByEmail
};
