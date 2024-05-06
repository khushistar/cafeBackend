const mongoose = require("mongoose")
const cateSchema =  new mongoose.Schema({})
module.exports =  mongoose.model("categories" , cateSchema)