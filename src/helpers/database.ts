import mongoose from 'mongoose';

export default mongoose.connect('mongodb+srv://admin2:vybhdZVN9m@cluster0.gywv7oz.mongodb.net/tokenizacion_tarjetas', {});

async function testDatabaseConnection() {
  try {
    // Connect to the MongoDB database
    const db = await mongoose.connect('mongodb+srv://admin2:vybhdZVN9m@cluster0.gywv7oz.mongodb.net/tokenizacion_tarjetas', {});
    console.log('Connected to MongoDB successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
//testDatabaseConnection()