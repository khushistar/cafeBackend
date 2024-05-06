const foodModel = require("../models/foodModel");
const Orderschema = require("../Orderschema");
const fs = require("fs");
const dotenv = require("dotenv");

const braintree = require("braintree");
dotenv.config();
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

const foodsController = async (req, res) => {
  try {
    const fooddata = await foodModel.find({}).select("-photo");
    // console.log(fooddata)
    res.status(200).send({
      success: true,
      massage: "Geting items successfully",
      fooddata,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      massage: "Error while geting food items",
      error,
    });
  }
};

const getsingleFoodController = async (req, res) => {
  try {
    const product = await foodModel.findById({ _id: req.params.id });
    res.status(201).send({
      success: true,
      massage: "getting item successfully",
      product,
    });
  } catch (error) {
    console.log(error);
  }
};

const createFoodController = async (req, res) => {
  try {
    const { name, description, price, category } = req.fields;
    const { photo } = req.files;
    if (!name) {
      return res.send({ massage: "name is required" });
    }
    if (!description) {
      return res.send({ massage: "description is required" });
    }
    if (!price) {
      return res.send({ massage: "price is required" });
    }
    if (!category) {
      return res.send({ massage: "category is required" });
    }
    if (photo && photo.size > 1000000) {
      return res.send({
        massage: "photo is required and should be less than 1000000",
      });
    }
    const product = new foodModel({
      ...req.fields,
    });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(201).send({
      success: true,
      massage: "successfully created food",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      massage: "error while creating fooditem",
    });
  }
};

const getphotoController = async (req, res) => {
  try {
    const productPhoto = await foodModel
      .findById(req.params.pid)
      .select("photo");
    if (productPhoto.photo.data) {
      res.set("Content-Type", productPhoto.photo.contentType);
      return res.status(201).send(productPhoto.photo.data);
    }
    res.status(201).send({
      success: true,
      massage: "getting photo successfully",
      productPhoto,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      massage: "Error while getting photo",
    });
  }
};

const generatetokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

// braintreepayment Controller

const braintreepaymentController = async (req, res) => {
  try {
    const { order_data, nonce, email } = req.body;
    let total = 0;
    order_data.map((item) => {
      total += item.price;
    });

    gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      async function (error, result) {
        if (result) {
          await order_data.splice(0, 0, { order_date: req.body.order_date });
          await order_data.splice(1, 0, { order_total: total });
          let eId = await Orderschema.findOne({ email: email });
          if (eId === null) {
            try {
              let result = new Orderschema({
                email: email,
                order_data: [order_data],
              });
              result = await result.save();
              res.json({ success: true, result });
            } catch (error) {
              res.send("Server Error", error);
            }
          } else {
            try {
              await Orderschema.findOneAndUpdate(
                { email: email },
                { $push: { order_data: order_data } }
              ).then(() => {
                res.json({ success: true });
              });
            } catch (error) {
              res.send("Server Error", error);
            }
          }
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  foodsController,
  createFoodController,
  getphotoController,
  getsingleFoodController,
  generatetokenController,
  braintreepaymentController,
};
