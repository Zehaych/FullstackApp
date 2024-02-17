const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  isValidated: {
    type: Boolean,
    required: true,
  },
  hasAccess: {
    type: Boolean,
    required: true,
  },
  allergies: [
    {
      type: String,
    },
  ],
  medicalHistory: [
    {
      type: String,
    },
  ],
  foodRestrictions: [
    {
      type: String,
    },
  ],
  age: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  calorie: {
    type: Number,
    required: true,
  },
  dailyCaloriesLog: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
      total_calories: {
        type: Number,
        default: 0,
      },
    },
  ],
  foodRecognitionLog: [
    {
      date: {
        type: Date,
        default: Date.now
      },
      imageUrl: {
        type: String
      },
      food: [
        {
          name: String,
          calories: String
        }
      ]

    }
  ],
  favouriteRecipes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Recipe",
    },
  ],
  favouriteBizRecipes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "BizRecipe",
    },
  ],
  cart: [
    {
      recipeId: {
        type: mongoose.Types.ObjectId,
        ref: "BizRecipe",
      },
      recipeName: {
        type: String,
        required: true,
      },
      recipePrice: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
      preferences: {
        type: String,
        default: "",
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
