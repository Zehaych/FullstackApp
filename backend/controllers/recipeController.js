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

// @desc GET a single recipe item based on id
// @route POST /recipe/:recipeId
// @access public
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
    submitted_by: req.body.submitted_by,
  });

  res.status(200).json(recipe);
});

//@desc Update a recipe
//@route PUT /recipe/:recipeId
//@access User-specific
// exports.updateRecipe = asyncHandler(async (req, res) => {
//   const recipeId = req.params.recipeId;
//   const userId = req.user._id; // Assuming you have user info in req.user

//   const recipe = await Recipe.findById(recipeId);

//   if (!recipe) {
//     res.status(404);
//     throw new Error("Recipe not found");
//   }

//   if (recipe.submitted_by.toString() !== userId.toString()) {
//     res.status(401);
//     throw new Error("User not authorized to update this recipe");
//   }

//   const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, req.body, {
//     new: true,
//   });

//   res.status(200).json(updatedRecipe);
// });
exports.updateRecipe = asyncHandler(async (req, res) => {
  const recipeId = req.params.recipeId;

  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    res.status(404);
    throw new Error("Recipe not found");
  }

  // Update the recipe with the new data
  const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, req.body, {
    new: true, // Return the updated document
  });

  res.status(200).json(updatedRecipe);
});

//@desc Delete a recipe
//@route DELETE /recipe/:recipeId
//@access User-specific
// exports.deleteRecipe = asyncHandler(async (req, res) => {
//   const recipeId = req.params.recipeId;
//   const userId = req.user._id; // Assuming you have user info in req.user
//   console.log("Attempting to delete recipe with ID:", recipeId);

//   const recipe = await Recipe.findById(recipeId);

//   if (!recipe) {
//     console.log("Recipe not found");
//     res.status(404);
//     throw new Error("Recipe not found");
//   }

//   if (recipe.submitted_by.toString() !== userId.toString()) {
//     res.status(401);
//     throw new Error("User not authorized to delete this recipe");
//   }

//   await recipe.remove();

//   res.status(200).json({ message: "Recipe deleted successfully" });
// });

exports.deleteRecipe = asyncHandler(async (req, res) => {
  const recipeId = req.params.recipeId;

  const recipe = await Recipe.findByIdAndRemove(recipeId);

  if (!recipe) {
    res.status(404);
    throw new Error("Recipe not found");
  }

  res.status(200).json({ message: "Recipe deleted successfully" });
});

// Report recipe
exports.reportRecipe = asyncHandler(async (req, res) => {
  const recipeId = req.params.recipeId;
  const { userId, feedback, additionalComment } = req.body; 

  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
  }

  recipe.isReported = true;
  recipe.reportedBy.push({ user: userId, feedback, additionalComment});

  await recipe.save();

  res.status(200).json({ message: "Recipe reported successfully" });
});

// Get the reported Recipes
exports.getReportedRecipes = asyncHandler(async (req, res) => {
  const reportedRecipes = await Recipe.find({ isReported: true }).populate('reportedBy.user', 'username');
  res.json(reportedRecipes);
});

//Dismiss report
exports.dismissReport = asyncHandler(async (req, res) => {
  const recipeId = req.params.recipeId;

  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
  }

  recipe.isReported = false;
  recipe.reportedBy = []; // Optionally clear the reportedBy array
  await recipe.save();

  res.status(200).json({ message: "Report dismissed successfully" });
});
