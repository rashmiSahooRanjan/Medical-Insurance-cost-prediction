const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    console.warn('\n⚠️ [MongoDB Atlas Warning]: MONGODB_URI / MONGO_URI is not defined in .env');
    console.warn('👉 Please set MONGODB_URI in backend/.env or your host environment variables (Render/Heroku/Vercel).');
    console.warn('   Example: MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/arogya_kavaj?retryWrites=true&w=majority\n');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`\n✅ [MongoDB Atlas Connected]: ${conn.connection.host} / Database: ${conn.connection.name}\n`);
    return true;
  } catch (error) {
    console.error(`\n❌ [MongoDB Atlas Connection Error]: ${error.message}`);
    console.warn('👉 Ensure your IP address is whitelisted (0.0.0.0/0) in MongoDB Atlas Network Access.');
    console.warn('   The server will continue running and serve API requests gracefully.\n');
    return false;
  }
};

const getDBStatus = () => ({
  connected: mongoose.connection.readyState === 1,
  host: mongoose.connection.host || null,
  name: mongoose.connection.name || null,
  readyState: mongoose.connection.readyState,
});

module.exports = { connectDB, getDBStatus };
