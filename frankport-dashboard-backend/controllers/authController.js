import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../config/db.js";

export const login = async (req, res) => {
  const { password } = req.body;

  try {
    // Fetch admin password hash from DB
    const [rows] = await db.query("SELECT password_hash FROM admin WHERE id = 1");
    if (rows.length === 0) return res.status(400).json({ message: "No admin user found" });

    const isMatch = await bcrypt.compare(password, rows[0].password_hash);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { backupPassword } = req.body;

  try {
    const [rows] = await db.query("SELECT backup_password_hash FROM admin WHERE id = 1");
    if (rows.length === 0) return res.status(400).json({ message: "No admin user found" });

    const isMatch = await bcrypt.compare(backupPassword, rows[0].backup_password_hash);
    if (!isMatch) return res.status(401).json({ message: "Invalid backup password" });

    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
