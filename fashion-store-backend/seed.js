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
      password: 'admin_password',
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
    const sizeM = await Size.create({ name: 'M', type: 'CLOTHES', status: 1 });
    const sizeL = await Size.create({ name: 'L', type: 'CLOTHES', status: 1 });
    const sizeXL = await Size.create({ name: 'XL', type: 'CLOTHES', status: 1 });
    const size42 = await Size.create({ name: '42', type: 'SHOES', status: 1 });

    // Colors
    const colorBlack = await Color.create({ name: 'Black', hex_code: '#000000', status: 1 });
    const colorWhite = await Color.create({ name: 'White', hex_code: '#FFFFFF', status: 1 });
    const colorRed = await Color.create({ name: 'Red', hex_code: '#FF0000', status: 1 });
    const colorBlue = await Color.create({ name: 'Blue', hex_code: '#0000FF', status: 1 });

    // ========================================
    // PRODUCTS & VARIANTS (5 test items)
    // ========================================

    // Product 1: Nike T-Shirt
    const prod1 = await Product.create({
      name: 'Nike White T-Shirt',
      slug: 'nike-white-tshirt',
      description: 'Comfortable white cotton t-shirt from Nike',
      price: 250000,
      discount_price: 200000,
      gender: 'Male',
      material: 'Cotton 100%',
      category_id: catClothes.id,
      brand_id: brandNike.id,
      status: 1
    });

    // P1 Variants
    await sequelize.models.ProductVariant.create({
      product_id: prod1.id,
      size_id: sizeM.id,
      color_id: colorWhite.id,
      sku: 'NIKE-TSHIRT-M-WHITE',
      stock: 50,
      status: 1
    });

    await sequelize.models.ProductVariant.create({
      product_id: prod1.id,
      size_id: sizeL.id,
      color_id: colorWhite.id,
      sku: 'NIKE-TSHIRT-L-WHITE',
      stock: 45,
      status: 1
    });

    // Product 2: Adidas Black T-Shirt
    const prod2 = await Product.create({
      name: 'Adidas Black T-Shirt',
      slug: 'adidas-black-tshirt',
      description: 'Premium black t-shirt from Adidas',
      price: 300000,
      discount_price: 250000,
      gender: 'Male',
      material: 'Cotton',
      category_id: catClothes.id,
      brand_id: brandAdidas.id,
      status: 1
    });

    // P2 Variants
    await sequelize.models.ProductVariant.create({
      product_id: prod2.id,
      size_id: sizeL.id,
      color_id: colorBlack.id,
      sku: 'ADIDAS-TSHIRT-L-BLACK',
      stock: 30,
      status: 1
    });

    await sequelize.models.ProductVariant.create({
      product_id: prod2.id,
      size_id: sizeXL.id,
      color_id: colorBlack.id,
      sku: 'ADIDAS-TSHIRT-XL-BLACK',
      stock: 25,
      status: 1
    });

    // Product 3: Nike Red T-Shirt
    const prod3 = await Product.create({
      name: 'Nike Red Performance T-Shirt',
      slug: 'nike-red-performance-tshirt',
      description: 'Performance t-shirt perfect for sports',
      price: 350000,
      discount_price: 280000,
      gender: 'Unisex',
      material: 'Polyester Blend',
      category_id: catClothes.id,
      brand_id: brandNike.id,
      status: 1
    });

    // P3 Variants
    await sequelize.models.ProductVariant.create({
      product_id: prod3.id,
      size_id: sizeM.id,
      color_id: colorRed.id,
      sku: 'NIKE-PERF-M-RED',
      stock: 60,
      status: 1
    });

    // Product 4: Adidas Blue T-Shirt
    const prod4 = await Product.create({
      name: 'Adidas Casual Blue Shirt',
      slug: 'adidas-casual-blue-shirt',
      description: 'Casual blue shirt for everyday wear',
      price: 320000,
      discount_price: 260000,
      gender: 'Female',
      material: 'Cotton 80% Polyester 20%',
      category_id: catClothes.id,
      brand_id: brandAdidas.id,
      status: 1
    });

    // P4 Variants
    await sequelize.models.ProductVariant.create({
      product_id: prod4.id,
      size_id: sizeM.id,
      color_id: colorBlue.id,
      sku: 'ADIDAS-CASUAL-M-BLUE',
      stock: 40,
      status: 1
    });

    // Product 5: Nike Sports Shoes
    const prod5 = await Product.create({
      name: 'Nike Sports Shoes Black',
      slug: 'nike-sports-shoes-black',
      description: 'Professional sports shoes for running and training',
      price: 1200000,
      discount_price: 950000,
      gender: 'Unisex',
      material: 'Synthetic leather + Mesh',
      category_id: catShoes.id,
      brand_id: brandNike.id,
      status: 1
    });

    // P5 Variant
    await sequelize.models.ProductVariant.create({
      product_id: prod5.id,
      size_id: size42.id,
      color_id: colorBlack.id,
      sku: 'NIKE-SHOES-42-BLACK',
      stock: 20,
      status: 1
    });

    const variants = await sequelize.models.ProductVariant.findAll({
      include: { model: Product, attributes: ['name', 'price'] }
    });

    console.log('\n========================================');
    console.log('✅ Seed completed successfully!');
    console.log('========================================\n');
    console.log('📋 Product Variants for Testing:\n');
    variants.forEach((v, idx) => {
      console.log(`${idx + 1}. ID: ${v.id} | ${v.Product.name} | Size: ${v.size_id} | Stock: ${v.stock}`);
    });
    console.log('\n========================================');
    console.log('🔑 Login Credentials:');
    console.log('  Admin:  admin@gmail.com / admin_password');
    console.log('  User:   user@gmail.com / user_password');
    console.log('========================================\n');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seed();
