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
// app.use("/api/v1/category" ,)

app.get("/cateitems", async (req, res) => {
  const cateitem = await cateitems.find();
  // console.log(cateitem)
  res.status(200).send(cateitem);
});

// ---------------------------------------------------------------------------------Orderschema-------------

// app.post("/order", async (req, res) => {
//   let data = req.body.order_data;
//   await data.splice(0, 0, { order_date: req.body.order_date });

//   let eId = await Orderschema.findOne({ email: req.body.email });
//   if (eId === null) {
//     try {
//       let result = new Orderschema({
//         email: req.body.email,
//         order_data: [data],
//       });
//       result = await result.save();
//       res.json({ success: true, result });
//     } catch (error) {
//       res.send("Server Error", error);
//     }
//   } else {
//     try {
//       await Orderschema.findOneAndUpdate(
//         { email: req.body.email },
//         { $push: { order_data: data } }
//       ).then(() => {
//         res.json({ success: true });
//       });
//     } catch (error) {
//       res.send("Server Error", error);
//     }
//   }
// });
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
