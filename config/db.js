const { connect, connection, set } = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB, connection, set };
