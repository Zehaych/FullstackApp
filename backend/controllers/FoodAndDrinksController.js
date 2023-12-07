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

// exports.addFoodAndDrink = async (req, res) => {
//     try {
//         const { name, calories, protein, fats, carbs } = req.body;

//         const newFoodAndDrink = new FoodAndDrink({
//             name,
//             calories,
//             protein,
//             fats,
//             carbs
//         });

//         await newFoodAndDrink.save();
//         res.status(201).json({
//             message: "Food and drink added successfully",
//             foodAndDrink: newFoodAndDrink
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Error adding food and drink", error: error.message });
//     }
// };

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

