const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/dbs");
const cateitems = require("./cateconn");
const Orderschema = require("./Orderschema");
const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");

dotenv.config();
connectDB();

const corsoption = {
  origin: "http://localhost:3001/",
  optionSuccessStatus: 200,
};
app.use(cors(corsoption));
// app.use(cors())

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

// ______________________________________________________routes_____________
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/foods", foodRoutes);

app.get("/cateitems", async (req, res) => {
  const cateitem = await cateitems.find();
  res.status(200).send(cateitem);
});

// ---------------------------------------------------------------------------------GET-ORDER------------------

app.post("/myorder", async (req, res) => {
  try {
    let mydata = await Orderschema.findOne({ email: req.body.email });
    res.status(200).send(mydata);
  } catch (error) {
    res.status(401).send(error);
  }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
