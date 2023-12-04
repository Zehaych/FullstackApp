const express = require("express");

const router = express.Router();

const FoodAndDrinksController = require("../controllers/FoodAndDrinksController");

//FoodAndDrinks -> GET
router.get("/", FoodAndDrinksController.getFoodAndDrinks);

module.exports = router;