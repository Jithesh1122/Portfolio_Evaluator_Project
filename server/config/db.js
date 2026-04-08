import mongoose from 'mongoose';

const connectDB = async (mongoUri) => {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined');
  }

  await mongoose.connect(mongoUri);

  if (process.env.NODE_ENV !== 'production') {
    console.log('MongoDB connected');
  }
};

export default connectDB;
