const { sequelize, Role, Category, Brand, Product, User, Size, Color, ProductVariant } = require('./src/models');
require('dotenv').config();

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('✅ Database synced (all data wiped)');

    // 1. Roles
    const adminRole = await Role.create({ name: 'Admin' });
    const userRole = await Role.create({ name: 'User' });

    // 2. Users
    const admin = await User.create({
      full_name: 'Admin User',
      email: 'admin@gmail.com',
      password: 'admin_password', // hooks handle hashing
      role_id: adminRole.id,
      status: 1
    });

    const user = await User.create({
      full_name: 'Minh Thuận',
      email: 'user@gmail.com',
      password: 'user_password',
      role_id: userRole.id,
      status: 1
    });

    // 3. Categories & Brands
    const catShoes = await Category.create({ name: 'Shoes', status: 1 });
    const catClothes = await Category.create({ name: 'Clothes', status: 1 });
    const brandNike = await Brand.create({ name: 'Nike', status: 1 });

    // 4. Products (Khớp với Frontend data/products.js)
    const productsData = [
      { id: 1, name: 'Nike Air Max 270 Premium', price: 3850000, category_id: catShoes.id, brand_id: brandNike.id, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600' },
      { id: 2, name: 'Adidas Ultraboost 22 Đen', price: 4500000, category_id: catShoes.id, brand_id: brandNike.id, image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600' },
      { id: 3, name: 'Áo Thun Oversized Essential', price: 450000, category_id: catClothes.id, brand_id: brandNike.id, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600' },
    ];

    // Tạo Sizes & Colors để có variant
    const size42 = await Size.create({ name: '42', type: 'SHOES', status: 1 });
    const colorRed = await Color.create({ name: 'Black', hex_code: '#000000', status: 1 });

    for (const p of productsData) {
      const product = await Product.create({ ...p, status: 1 });
      // Tạo ít nhất 1 variant cho mỗi sản phẩm để logic tìm kiếm không bị fail
      await ProductVariant.create({
        product_id: product.id,
        size_id: size42.id,
        color_id: colorRed.id,
        sku: `SKU-${product.id}`,
        stock: 100,
        extra_price: 0,
        status: 1
      });
    }

    console.log('✅ Initial seed completed successfully (Products & Variants included)');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seed();
