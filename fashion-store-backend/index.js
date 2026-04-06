const app = require('./src/index');
const { connectDB } = require('./src/config/db');
const { sequelize } = require('./src/models');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    // Database Connection
    await connectDB();

    // Sync database (Use { force: true } if you want to rebuild DB - Caution: Data loss)
    // await sequelize.sync({ alter: true });
    // console.log('✅ Database synced successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`❌ Error starting server: ${error.message}`);
    process.exit(1);
  }
};

start();
