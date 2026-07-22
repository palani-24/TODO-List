const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;
  const localUri = 'mongodb://127.0.0.1:27017/cttms';

  if (primaryUri) {
    try {
      await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 3000 });
      console.log('✅ Connected to MongoDB Atlas:', primaryUri);
      return;
    } catch (err) {
      console.warn('⚠️ Atlas connection failed, trying local MongoDB...');
    }
  }

  try {
    await mongoose.connect(localUri, { serverSelectionTimeoutMS: 3000 });
    console.log('✅ Connected to local MongoDB:', localUri);
  } catch (err) {
    console.error('❌ Could not connect to local MongoDB. Proceeding in offline mock mode.');
  }
};

module.exports = connectDB;
