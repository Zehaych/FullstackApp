const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ingredients:{
      type: [String],
      required: true,
    },
    instructions: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Recipe", recipeSchema);
