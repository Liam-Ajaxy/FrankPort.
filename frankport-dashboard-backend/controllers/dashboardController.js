/**
 * controllers/dashboardController.js
 * Basic dashboard metrics stub.
 */

export const getDashboardStats = (req, res) => {
  const stats = {
    totalUsers: 42,
    notificationsCount: 12,
    activeAdmins: 1
  };
  return res.json(stats);
};
