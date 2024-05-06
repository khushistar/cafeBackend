const userModel = require("../models/userModel");
const { hashPassword, comparePassword } = require("./../helper/authhelper");
const JWT = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const { name, email, password, location } = req.body;

    // validations
    if (!name) {
      return res.send({ massage: "name is required" });
    }
    if (!email) {
      return res.send({ massage: "email is required" });
    }
    if (!password) {
      return res.send({ massage: "password is required" });
    }
    if (!location) {
      return res.send({ massage: "location is required" });
    }

    // check user existing
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        massage: "User already register login please",
      });
    }
    // insert user data
    const hashedPassword = await hashPassword(password);

    const user = await new userModel({
      name,
      email,
      location,
      password: hashedPassword,
    }).save();
    res.status(201).send({
      success: true,
      massage: "User register successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      massage: "error in registeration",
      error,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(401).send({
        success: false,
        massage: "user not exist",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      res.status(401).send({
        success: false,
        massage: "invalid password",
      });
    }

    const token = JWT.sign({ _id: user._id }, process.env.JWT_KEY, {
      expiresIn: "15d",
    });

    console.log(token);
    res.status(200).send({
      success: true,
      massage: "User login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
      },
      token,
    });
    console.log(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      massage: "Error while use login",
      error,
    });
  }
};

module.exports = { registerController, loginController };
