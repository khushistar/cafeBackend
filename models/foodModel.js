const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("fooditems", productSchema)