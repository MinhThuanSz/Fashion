const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const variantRoutes = require('./routes/variantRoutes');
const imageRoutes = require('./routes/imageRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const sizeColorRoutes = require('./routes/sizeColorRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Dashboard
const roleRoutes = require('./routes/roleRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes registration
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/variants', variantRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/catalog', sizeColorRoutes); // For sizes and colors
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', adminRoutes);
app.use('/api/roles', roleRoutes);

app.get('/', (req, res) => {
  res.send('Fashion Store API is running...');
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
