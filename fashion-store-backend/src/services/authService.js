const { User, Role, Cart } = require('../models');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

const register = async (userData) => {
  const { full_name, email, password } = userData;

  const userExists = await User.findOne({ where: { email } });
  if (userExists) {
    throw new Error('Email already exists');
  }

  const userRole = await Role.findOne({ where: { name: 'User' } });
  if (!userRole) {
    throw new Error('Role "User" does not exist');
  }

  const user = await User.create({
    full_name,
    email,
    password,
    role_id: userRole.id
  });

  // Create default cart
  await Cart.create({ user_id: user.id });

  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    role: 'User',
    token: generateToken(user.id)
  };
};

const login = async (email, password) => {
  const user = await User.findOne({ 
    where: { email },
    include: Role
  });

  if (user && (await user.matchPassword(password))) {
    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      avatar: user.avatar,
      role: user.Role.name,
      token: generateToken(user.id)
    };
  } else {
    throw new Error('Invalid email or password');
  }
};

const updateProfile = async (userId, data) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  // Cập nhật tất cả các trường được phép, kể cả khi gửi chuỗi rỗng để xóa
  if (data.full_name !== undefined) user.full_name = data.full_name;
  if (data.phone !== undefined) user.phone = data.phone;
  if (data.address !== undefined) user.address = data.address;
  if (data.city !== undefined) user.city = data.city;
  if (data.avatar !== undefined) user.avatar = data.avatar;

  await user.save();

  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    city: user.city,
    avatar: user.avatar
  };
};

const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findByPk(userId);
  if (!user || !(await user.matchPassword(oldPassword))) {
    throw new Error('Old password is incorrect');
  }
  user.password = newPassword;
  await user.save();
  return true;
};

module.exports = {
  register,
  login,
  updateProfile,
  changePassword
};
