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


exports.addFoodAndDrink = async (req, res) => {
    try {
        const { name, calories, protein, fats, carbs } = req.body;

        // Check if an item with the same name already exists
        const existingItem = await FoodAndDrink.findOne({ name: name });
        if (existingItem) {
            return res.status(400).json({
                message: "An item with this name already exists in the database."
            });
        }

        const newFoodAndDrink = new FoodAndDrink({
            name,
            calories,
            protein,
            fats,
            carbs
        });

        await newFoodAndDrink.save();
        res.status(201).json({
            message: "Food and drink added successfully",
            foodAndDrink: newFoodAndDrink
        });
    } catch (error) {
        res.status(500).json({ message: "Error adding food and drink", error: error.message });
    }
};

exports.updateFoodAndDrink = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, calories, protein, fats, carbs } = req.body;

    try {
        const foodAndDrink = await FoodAndDrink.findById(id);
        if (!foodAndDrink) {
            return res.status(404).json({ message: "Food and drink item not found" });
        }

        // Update fields
        foodAndDrink.name = name || foodAndDrink.name;
        foodAndDrink.calories = calories || foodAndDrink.calories;
        foodAndDrink.protein = protein || foodAndDrink.protein;
        foodAndDrink.fats = fats || foodAndDrink.fats;
        foodAndDrink.carbs = carbs || foodAndDrink.carbs;

        await foodAndDrink.save();
        res.status(200).json({ message: "Food and drink updated successfully", foodAndDrink });
    } catch (error) {
        res.status(500).json({ message: "Error updating food and drink", error: error.message });
    }
});


exports.deleteFoodAndDrink = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const result = await FoodAndDrink.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Food and drink item not found" });
        }

        res.status(200).json({ message: "Food and drink deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting food and drink", error: error.message });
    }
});


