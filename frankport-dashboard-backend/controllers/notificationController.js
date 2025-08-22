import db from "../config/db.js";

export const createNotification = async (req, res) => {
  const { title, message } = req.body;

  if (!title || !message) return res.status(400).json({ message: "Title and message required" });

  try {
    await db.query("INSERT INTO notifications (title, message) VALUES (?, ?)", [title, message]);
    res.json({ message: "Notification created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM notifications ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
