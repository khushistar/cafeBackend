const bookingModel = require("../models/tablebookingModel");
const nodemailer = require("nodemailer");
const tablebookingController = async (req, res) => {
  try {
    const { name, email, date, numberofperson } = req.body;
    // validations
    if (!name) {
      return res.send({ massage: "name is required" });
    }
    if (!email) {
      return res.send({ massage: "email is required" });
    }
    if (!date) {
      return res.send({ massage: "date is required" });
    }
    if (!numberofperson) {
      return res.send({ massage: "numberofperson is required" });
    }

    const bookingdata = await new bookingModel(req.body).save();

    res.status(201).send({
      success: true,
      massage: "Wait for confirm your booking",
      bookingdata,
    });
  } catch (error) {
    res.status({
      success: false,
      massage: "Error: while booking table",
      error,
    });
  }
};

const getbookingdataController = async (req, res) => {
  try {
    const allbookings = await bookingModel.find();
    res.status(201).send({
      success: true,
      massage: "getting bookings successfully",
      allbookings,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      massage: "Error:while getting bookings",
      error,
    });
  }
};

const confirmBookingsController = async (req, res) => {
  try {
    const booking = await bookingModel.findById(req.params.id);
    booking.status = "confirmed";
    await booking.save();

    // send Confirmation email

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "khushikunwar201595@gmail.com",
        pass: "rlphjmihfdytfomp",
      },
    });

    const info = await transporter.sendMail({
      from: "khushikunwar201595@gmail.com",
      to: `${booking.email}`,
      subject: "Table booked successfully",
      text: `Your table booked for ${booking.date}`,
      html: `<b>Your table booking for ${booking.date}</b>`,
    });

    console.log("email sent" + info.response);

    res.status(201).send({
      success: true,
      massage: "Your table has booked",
      booking,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      massage: "Error:while confirmbooking",
      error,
    });
  }
};

module.exports = {
  tablebookingController,
  getbookingdataController,
  confirmBookingsController,
};
