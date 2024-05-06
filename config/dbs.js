const mongoose = require("mongoose");
const connectdb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Connection successfull on host ${conn.connection.host}`
    );
  } catch (error) {
    console.log(`Error in mongodb ${error}`);
  }
};

module.exports = connectdb;