/**
 * models/notificationModel.js
 * Placeholder model for notifications. Replace with MySQL implementation.
 */

export const NotificationModel = {
  async findAll() {
    return [];
  },
  async create({ title, message }) {
    return { id: Date.now(), title, message, created_at: new Date().toISOString() };
  },
  async markAsRead(id) {
    return true;
  }
};
