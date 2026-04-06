const { User, Role } = require('../models');

const getUsers = async () => {
  return await User.findAll({
    include: Role,
    attributes: { exclude: ['password'] }
  });
};

const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    include: Role,
    attributes: { exclude: ['password'] }
  });
  if (!user) throw new Error('User not found');
  return user;
};

const updateUserStatus = async (id, status) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found');
  user.status = status;
  await user.save();
  return user;
};

const updateUserRole = async (id, roleId) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error('User not found');
  user.role_id = roleId;
  await user.save();
  return user;
};

module.exports = {
  getUsers,
  getUserById,
  updateUserStatus,
  updateUserRole
};
