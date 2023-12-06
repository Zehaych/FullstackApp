const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const FoodRequest = require("../models/foodRequestModel");

exports.getFoodRequests = async (req, res) => {
    try {
        const foodRequests = await FoodRequest.find({});
        res.json(foodRequests);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving food requests", error: error.message });
    }
};

exports.createFoodRequest = asyncHandler(async (req, res) => {
    try {
        const { name, userId } = req.body; 

        const newFoodRequest = new FoodRequest({
            submittedBy: userId,
            name,
            calories: 0,
            protein: 0,
            fats: 0,
            carbs: 0,
            status: 'pending'
        });

        await newFoodRequest.save();
        res.status(201).json({
            message: "Food request submitted successfully",
            foodRequest: newFoodRequest
        });
    } catch (error) {
        res.status(500).json({ message: "Error submitting food request", error: error.message });
    }
});



