import db from "../config/db.js";
import bcrypt from "bcrypt";

const userModel = {
  findByEmailOrUsername: async (email, username) => {
    // Kunci perbaikan: Wajib ada kata WHERE sebelum nama kolom email
    const [rows] = await db.query(
      "SELECT id FROM users WHERE email = ? OR username = ?",
      [email, username],
    );
    return rows;
  },

  create: async (username, email, password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    const [result] = await db.query(query, [username, email, hashedPassword]);
    return result;
  },

  checkDuplicate: async (username, email, currentUserId) => {
    const [rows] = await db.query(
      "SELECT id FROM users WHERE (email = ? OR username = ?) AND id != ?",
      [email, username, currentUserId],
    );
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query(
      "SELECT id, username, email, password FROM users WHERE id = ?",
      [id],
    );
    return rows[0];
  },

  updateProfile: async (id, username, email, newHashedPassword = null) => {
    if (newHashedPassword) {
      const query =
        "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?";
      const [result] = await db.query(query, [
        username,
        email,
        newHashedPassword,
        id,
      ]);
      return result;
    } else {
      const query = "UPDATE users SET username = ?, email = ? WHERE id = ?";
      const [result] = await db.query(query, [username, email, id]);
      return result;
    }
  },
};

export default userModel;
