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

exports.updateRecipe = asyncHandler(async (req, res) => {
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
  recipe.reportedBy.push({ user: userId, feedback, additionalComment });

  await recipe.save();

  res.status(200).json({ message: "Recipe reported successfully" });
});

// Get the reported Recipes
exports.getReportedRecipes = asyncHandler(async (req, res) => {
  const reportedRecipes = await Recipe.find({ isReported: true }).populate(
    "reportedBy.user",
    "username"
  );
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

// PATCH reviews and ratings on a recipe
// exports.postRating = asyncHandler(async (req, res) => {
//   const rating = await Recipe.findByIdAndUpdate(
//     { _id: req.body.id },
//     {
//       $push: {
//         reviewsAndRatings: {
//           name: req.body.name,
//           reviews: req.body.reviews,
//           ratings: req.body.ratings,
//         },
//       },
//     }
//   );
//   res.status(200).json(rating);
// });
// PATCH reviews and ratings on a recipe
exports.postRating = asyncHandler(async (req, res) => {
  const recipeId = req.body.id;
  const userId = req.body.name; // Assuming this is the user's ID
  const userReview = req.body.reviews;
  const userRating = req.body.ratings;

  try {
    // Find the recipe by ID and push the new rating
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    recipe.reviewsAndRatings.push({
      name: userId,
      reviews: userReview,
      ratings: userRating,
    });

    // Calculate the new average rating and total ratings
    const totalRatings = recipe.reviewsAndRatings.length;
    const sumRatings = recipe.reviewsAndRatings.reduce(
      (acc, curr) => acc + curr.ratings,
      0
    );
    const averageRating = sumRatings / totalRatings;

    recipe.averageRating = averageRating;
    recipe.totalRatings = totalRatings;

    await recipe.save();

    res.status(200).json(recipe);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating recipe ratings", error: error.message });
  }
});

// Edit a review
exports.editRating = asyncHandler(async (req, res) => {
  const { recipeId, reviewId, newReview, newRating } = req.body;

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Find and update the specific review
    const reviewIndex = recipe.reviewsAndRatings.findIndex((r) =>
      r._id.equals(reviewId)
    );
    if (reviewIndex !== -1) {
      recipe.reviewsAndRatings[reviewIndex].reviews = newReview;
      recipe.reviewsAndRatings[reviewIndex].ratings = newRating;
    } else {
      return res.status(404).json({ message: "Review not found" });
    }

    const totalRatings = recipe.reviewsAndRatings.length;
    const sumRatings = recipe.reviewsAndRatings.reduce(
      (acc, curr) => acc + curr.ratings,
      0
    );
    const averageRating = sumRatings / totalRatings;

    recipe.averageRating = averageRating;
    recipe.totalRatings = totalRatings;

    await recipe.save();
    res.status(200).json(recipe);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating review", error: error.message });
  }
});

// Delete a review
exports.deleteRating = asyncHandler(async (req, res) => {
  const recipeId = req.params.recipeId;
  const reviewId = req.body.reviewId;

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Remove the review
    recipe.reviewsAndRatings = recipe.reviewsAndRatings.filter(
      (review) => !review._id.equals(reviewId)
    );

    // Recalculate average rating and total ratings
    const totalRatings = recipe.reviewsAndRatings.length;
    const sumRatings = recipe.reviewsAndRatings.reduce(
      (acc, curr) => acc + curr.ratings,
      0
    );
    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    recipe.averageRating = averageRating;
    recipe.totalRatings = totalRatings;

    await recipe.save();
    res.status(200).json(recipe);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting review", error: error.message });
  }
});
