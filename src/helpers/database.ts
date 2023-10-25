import mongoose from 'mongoose';

export default mongoose.connect(process.env.MONGODB_URI, {});

async function testDatabaseConnection() {
  try {
    // Connect to the MongoDB database
    const db = await mongoose.connect(process.env.MONGODB_URI, {});
    console.log('Connected to MongoDB successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
//testDatabaseConnection()