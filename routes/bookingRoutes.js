const express = require("express")
const router = express.Router();
const {tablebookingController,getbookingdataController,confirmBookingsController} = require("../controllers/bookingController")

// booking-router
router.post("/booktable", tablebookingController)

// getAllbookings
router.get("/allbookings", getbookingdataController)

// confirmbooking
router.post("/confirmbookings/:id/confirm", confirmBookingsController)
module.exports = router;
