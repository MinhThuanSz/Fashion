const { sequelize, Role, Category, Brand, Product, User, Size, Color } = require('./src/models');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('✅ Database synced (all data wiped)');

    // Roles
    const adminRole = await Role.create({ name: 'Admin', description: 'Administrator' });
    const userRole = await Role.create({ name: 'User', description: 'Standard User' });

    // Users
    await User.create({
      full_name: 'Admin User',
      email: 'admin@gmail.com',
      password: 'admin_password', // hooks handle hashing
      role_id: adminRole.id,
      status: 1
    });

    await User.create({
      full_name: 'Regular Customer',
      email: 'user@gmail.com',
      password: 'user_password',
      role_id: userRole.id,
      status: 1
    });

    // Categories
    const catClothes = await Category.create({ name: 'Clothes', description: 'Fashion Clothing', status: 1 });
    const catShoes = await Category.create({ name: 'Shoes', description: 'Sport & Casual Shoes', status: 1 });

    // Brands
    const brandNike = await Brand.create({ name: 'Nike', status: 1 });
    const brandAdidas = await Brand.create({ name: 'Adidas', status: 1 });

    // Sizes
    await Size.create({ name: 'M', type: 'CLOTHES', status: 1 });
    await Size.create({ name: 'L', type: 'CLOTHES', status: 1 });
    await Size.create({ name: '42', type: 'SHOES', status: 1 });

    // Colors
    await Color.create({ name: 'Black', hex_code: '#000000', status: 1 });
    await Color.create({ name: 'White', hex_code: '#FFFFFF', status: 1 });

    console.log('✅ Initial seed completed successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seed();
