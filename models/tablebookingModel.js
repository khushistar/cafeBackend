const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  date: {
    type: String,
    require: true,
  },
  time: {
    type: String,
    require: true,
  },
  numberofperson: {
    type: Number,
    require: true,
  },
  status: {
    type: String,
    default: "pending",
  }
});

module.exports = mongoose.model("booktable", bookingSchema);
