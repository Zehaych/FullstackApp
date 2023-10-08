const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const Recipe = require("../models/recipeModel");

//@desc GET all recipe items
//@route GET /recipe
//@access public
exports.getRecipe = asyncHandler(async (req, res) => {
  const recipes = await Recipe.find();
  res.json(recipes);
});

//@desc GET a single recipe item based on id
//@route POST /recipe/:recipeId
//@access public
exports.getRecipeId = asyncHandler(async (req, res) => {
    const recipeId = req.params.recipeId;
    const recipes = await Recipe.findById(recipeId);
    res.status(200).json(recipes);
  });
  