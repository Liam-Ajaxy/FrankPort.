/**
 * controllers/userController.js
 * Stubs for user listing.
 */

export const getUsers = (req, res) => {
  const sample = [
    { id: 1, name: "Frank Nab", role: "admin" },
    { id: 2, name: "Visitor", role: "user" }
  ];
  return res.json(sample);
};

export const getUserById = (req, res) => {
  const { id } = req.params;
  return res.json({ id, name: "Sample User", role: "user" });
};
