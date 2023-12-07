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

exports.rejectFoodRequest = asyncHandler(async (req, res) => {
    const requestId = req.params.id;

    const foodRequest = await FoodRequest.findById(requestId);
    if (!foodRequest) {
        return res.status(404).json({ message: "Food request not found" });
    }

    foodRequest.status = 'rejected';
    await foodRequest.save();

    res.status(200).json({ 
        message: "Food request rejected successfully",
        foodRequest: foodRequest 
    });
});

exports.approveFoodRequest = asyncHandler(async (req, res) => {
    const requestId = req.params.id;

    const foodRequest = await FoodRequest.findById(requestId);
    if (!foodRequest) {
        return res.status(404).json({ message: "Food request not found" });
    }

    foodRequest.status = 'approved';
    await foodRequest.save();

    res.status(200).json({ 
        message: "Food request approved successfully",
        foodRequest: foodRequest 
    });
});

