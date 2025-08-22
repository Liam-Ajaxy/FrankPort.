// config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = await mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "frankport_dashboard",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

try {
  const [rows] = await db.query("SELECT NOW() as now");
  console.log("✅ MySQL Connected:", rows[0].now);
} catch (error) {
  console.error("❌ MySQL Connection Failed:", error.message);
}

export default db;
