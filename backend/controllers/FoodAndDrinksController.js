const mongoose = require("mongoose");

const asyncHandler = require("express-async-handler");

const FoodAndDrink = require("../models/FoodAndDrinksModel");

//@desc     GET all Food and Drinks
//@route    GET /FoodAndDrinks
//@access   public
exports.getFoodAndDrinks = asyncHandler(async (req, res) => {
    const FoodAndDrinks = await FoodAndDrink.find();
    res.json(FoodAndDrinks);
});

//@desc     GET a single food or drink item
//@route    GET /FoodAndDrinks/:FoodAndDrinksId
//@access public
// exports.getFoodAndDrinksId = asyncHandler(async (req, res) => {
//     const FoodAndDrinksId = req.params.FoodAndDrinksId;
//     const FoodAndDrinks = await FoodAndDrink.findById(FoodAndDrinksId);
//     res.status(200).json(FoodAndDrinks);
// });