const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const BizRecipe = require("../models/bizRecipeModel");

//@desc GET all business recipe items
//@route GET /bizRecipe
//@access public
exports.getBizRecipe = asyncHandler(async (req, res) => {
  const bizRecipes = await BizRecipe.find();
  res.json(bizRecipes);
});

//@desc GET a single business recipe item based on id
//@route POST /bizRecipe/:bizRecipeId
//@access public
exports.getBizRecipeId = asyncHandler(async (req, res) => {
  const bizRecipeId = req.params.bizRecipeId;
  const bizRecipes = await BizRecipe.findById(bizRecipeId);
  res.status(200).json(bizRecipes);
});

//@desc     POST 1 food
//@route    POST /bizRecipe/postBizRecipe
//@access   public
exports.postBizRecipe = asyncHandler(async (req, res) => {
  if (
    !req.body.name ||
    !req.body.ingredients ||
    !req.body.instructions ||
    !req.body.calories ||
    !req.body.image ||
    !req.body.price
  ) {
    res.status(400);
    throw new Error("Please add a value for the recipe");
  }

  //check if recipe exist
  const bizRecipeExist = await BizRecipe.findOne({ name: req.body.name });

  if (bizRecipeExist) {
    res.status(400);
    throw new Error("Recipe already exist");
  }
  const bizRecipe = await BizRecipe.create({
    name: req.body.name,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    calories: req.body.calories,
    image: req.body.image,
    price: req.body.price,
    submitted_by: req.body.submitted_by,
  });

  res.status(200).json(bizRecipe);
});

exports.updateBizRecipe = asyncHandler(async (req, res) => {
  const recipeId = req.params.recipeId;

  const recipe = await BizRecipe.findById(recipeId);

  if (!recipe) {
    res.status(404);
    throw new Error("Recipe not found");
  }

  // Update the recipe with the new data
  const updatedRecipe = await BizRecipe.findByIdAndUpdate(recipeId, req.body, {
    new: true, // Return the updated document
  });

  res.status(200).json(updatedRecipe);
});

exports.deleteBizRecipe = asyncHandler(async (req, res) => {
  const recipeId = req.params.recipeId;

  const recipe = await BizRecipe.findByIdAndRemove(recipeId);

  if (!recipe) {
    res.status(404);
    throw new Error("Recipe not found");
  }

  res.status(200).json({ message: "Recipe deleted successfully" });
});

// Report recipe
exports.reportBizRecipe = asyncHandler(async (req, res) => {
  const recipeId = req.params.recipeId;
  const { userId, feedback, additionalComment } = req.body; 

  const recipe = await BizRecipe.findById(recipeId);

  if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
  }

  recipe.isReported = true;
  recipe.reportedBy.push({ user: userId, feedback, additionalComment});

  await recipe.save();

  res.status(200).json({ message: "Recipe reported successfully" });
});