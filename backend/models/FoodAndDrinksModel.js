const mongoose = require("mongoose");


const FoodAndDrinksSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    calories: {
        type: Number,
        required: true,
    },
    protein: {
        type: Number,
        required: true,
    },
    fats: {
        type: Number,
        required: true,
    },
    carbs: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("FoodAndDrink", FoodAndDrinksSchema);