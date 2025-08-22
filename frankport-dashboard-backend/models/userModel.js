/**
 * models/userModel.js
 * Placeholder model that will be replaced with real MySQL queries.
 */

export const UserModel = {
  async findAll() {
    return [];
  },
  async findById(id) {
    return { id, name: "Sample User" };
  },
  async create(user) {
    // expect { email, main_password, alt_password }
    return { id: 1, ...user };
  }
};
