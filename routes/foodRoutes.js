const express = require("express");
const formidable = require("express-formidable");
const {
  foodsController,
  createFoodController,
  getphotoController,
  getsingleFoodController,
  generatetokenController,
  braintreepaymentController
} = require("../controllers/foodController");

const router = express.Router();

router.get("/fooditems", foodsController);
router.post("/create-fooditem", formidable(), createFoodController);
router.get("/get-photo/:pid", getphotoController);
router.get("/getsingleitem/:id", getsingleFoodController);

// #payment routes
// #token

router.get("/braintree/token", generatetokenController)

// #payment

router.post("/braintree/payment", braintreepaymentController)

module.exports = router;
