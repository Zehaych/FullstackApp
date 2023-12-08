const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const BizRecipe = require("../models/bizRecipeModel");

const User = require("../models/userModel");

//@desc GET all business recipe items
//@route GET /bizRecipe
//@access public
exports.getBizRecipe = asyncHandler(async (req, res) => {
  const bizRecipes = await BizRecipe.find().populate(
    "submitted_by",
    "username"
  );
  res.json(bizRecipes);
});

//@desc GET a single business recipe item based on id
//@route POST /bizRecipe/:bizRecipeId
//@access public
exports.getBizRecipeId = asyncHandler(async (req, res) => {
  const bizRecipeId = req.params.bizRecipeId;
  const bizRecipe = await BizRecipe.findById(bizRecipeId).populate(
    "submitted_by",
    "username"
  );
  res.status(200).json(bizRecipe);
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
  recipe.reportedBy.push({ user: userId, feedback, additionalComment });

  await recipe.save();

  res.status(200).json({ message: "Recipe reported successfully" });
});

// Get the reported Biz Recipes
exports.getReportedBizRecipes = asyncHandler(async (req, res) => {
  const reportedRecipes = await BizRecipe.find({ isReported: true }).populate(
    "reportedBy.user",
    "username"
  );
  res.json(reportedRecipes);
});

//Dismiss report
exports.dismissReport = asyncHandler(async (req, res) => {
  const recipeId = req.params.recipeId;

  const recipe = await BizRecipe.findById(recipeId);
  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }

  recipe.isReported = false;
  recipe.reportedBy = []; // Optionally clear the reportedBy array
  await recipe.save();

  res.status(200).json({ message: "Report dismissed successfully" });
});

// @desc Submit an order for a business recipe
// @route POST
// @access public (or private if you require authentication)
const SERVICE_FEE = 4.0; // A fixed service fee

exports.submitOrder = asyncHandler(async (req, res) => {
  const { bizRecipeId } = req.params;
  const {
    userId,
    quantity,
    preferences,
    timeToDeliver,
    dateToDeliver,
    deliveryAddress,
  } = req.body;

  // Find the recipe by ID
  const bizRecipe = await BizRecipe.findById(bizRecipeId);

  if (!bizRecipe) {
    res.status(404);
    throw new Error("Recipe not found");
  }

  // Calculate total price including the service fee
  const totalPrice = bizRecipe.price * quantity + SERVICE_FEE;

  // Create order object
  const order = {
    name: userId,
    quantity: quantity,
    totalPrice: totalPrice,
    preferences: preferences,
    timeToDeliver: timeToDeliver,
    dateToDeliver: dateToDeliver,
    deliveryAddress: deliveryAddress,
  };

  // Add order to the recipe
  bizRecipe.orderedBy.push(order);

  // Save the updated recipe
  await bizRecipe.save();

  res
    .status(200)
    .json({ message: "Order submitted successfully", order: order });
});

// Assuming this is added in your existing backend controller file

//@desc GET all orders sorted by date (newest first)
//@route GET /bizRecipe/getOrders
//@access public (or private if authentication is needed)
//@desc GET all orders with recipe names
//@route GET /bizRecipe/orders
//@access public
exports.getOrders = asyncHandler(async (req, res) => {
  const recipes = await BizRecipe.find()
    // .sort({ "orderedBy.dateToDeliver": -1 })
    .populate("orderedBy.name", "username"); // Populate the user details

  const ordersWithRecipeName = recipes
    .map((recipe) => {
      return recipe.orderedBy.map((order) => {
        return {
          ...order._doc, // Spread all properties of the order
          recipeName: recipe.name, // Add the recipe name to each order
        };
      });
    })
    .flat();

  res.json(ordersWithRecipeName);
});
