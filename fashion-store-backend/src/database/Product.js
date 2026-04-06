const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const slugify = require('slugify');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(200),
    unique: true
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: false
  },
  discount_price: {
    type: DataTypes.DECIMAL(18, 2)
  },
  gender: {
    type: DataTypes.STRING(20) // Men, Women, Unisex
  },
  material: {
    type: DataTypes.STRING(100)
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  brand_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1 // 1: Active, 0: Inactive
  }
}, {
  tableName: 'products',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeCreate: (product) => {
      product.slug = slugify(product.name, { lower: true, strict: true });
    },
    beforeUpdate: (product) => {
      if (product.changed('name')) {
        product.slug = slugify(product.name, { lower: true, strict: true });
      }
    }
  }
});

module.exports = Product;
