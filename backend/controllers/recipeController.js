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

//@desc     POST 1 food
//@route    POST /recipe/postRecipe
//@access   public
exports.postRecipe = asyncHandler(async (req, res) => {
  if (
    !req.body.name ||
    !req.body.ingredients ||
    !req.body.instructions ||
    !req.body.calories ||
    !req.body.image
  ) {
    res.status(400);
    throw new Error("Please add a value for the recipe");
  }

  //check if recipe exist
  const recipeExist = await Recipe.findOne({ name: req.body.name });

  if (recipeExist) {
    res.status(400);
    throw new Error("Recipe already exist");
  }
  const recipe = await Recipe.create({
    name: req.body.name,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    calories: req.body.calories,
    image: req.body.image,
  });

  res.status(200).json(recipe);
});
