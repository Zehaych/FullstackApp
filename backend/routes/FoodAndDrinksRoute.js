const express = require("express");

const router = express.Router();

const FoodAndDrinksController = require("../controllers/FoodAndDrinksController");

//FoodAndDrinks -> GET
router.get("/getFoodAndDrinks", FoodAndDrinksController.getFoodAndDrinks);

//FoodAndDrinks -> POST
router.post('/addFoodAndDrink', FoodAndDrinksController.addFoodAndDrink);

//FoodAndDrinks -> PUT
router.put('/updateFoodAndDrink/:id', FoodAndDrinksController.updateFoodAndDrink);

//FoodAndDrinks -> DELETE
router.delete('/deleteFoodAndDrink/:id', FoodAndDrinksController.deleteFoodAndDrink);

module.exports = router;