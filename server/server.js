import dotenv from 'dotenv';
import cron from 'node-cron';
import app from './app.js';
import connectDB from './config/db.js';
import Report from './models/Report.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);

    cron.schedule('0 * * * *', async () => {
      await Report.deleteMany({
        expiresAt: { $lte: new Date() },
      });
    });

    app.listen(PORT, () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Server running on port ${PORT}`);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
