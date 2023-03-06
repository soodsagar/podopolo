const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const DATABASE_URL = process.env.MONGODB_URI || "mongodb://localhost:27017/podopolo"
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DATABASE_URL);
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
}


module.exports = connectDB;