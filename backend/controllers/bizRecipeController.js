const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const BizRecipe = require("../models/bizRecipeModel");

const User = require("../models/userModel");

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
  const bizRecipe = await BizRecipe.findById(bizRecipeId);

  if (!bizRecipe) {
    res.status(404);
    throw new Error("Recipe not found");
  }

  res.status(200).json(bizRecipe);
});

// get BizRecipe by populating
exports.getBizRecipeByUserId = asyncHandler(async (req, res) => {
  const bizRecipes = await BizRecipe.find().populate(
    "submitted_by",
    "username"
  );
  res.json(bizRecipes);
});

// get BizRecipe's ID by populating
exports.getBizRecipeIdByUserId = asyncHandler(async (req, res) => {
  const bizRecipeId = req.params.bizRecipeId;
  const bizRecipe = await BizRecipe.findById(bizRecipeId)
    .populate("submitted_by", "username")
    .populate("orderInfo.name", "username"); // Populate orderInfo array

  if (!bizRecipe) {
    res.status(404);
    throw new Error("Recipe not found");
  }

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
const SERVICE_FEE = 4.0; // fixed service fee

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
    estimatedArrivalTime: req.body.estimatedArrivalTime,
    status: req.body.status,
  };

  // Add order to the recipe
  bizRecipe.orderInfo.push(order);

  // Save the updated recipe
  await bizRecipe.save();

  res
    .status(200)
    .json({ message: "Order submitted successfully", order: order });
});

exports.getOrders = asyncHandler(async (req, res) => {
  try {
    // Fetch all BizRecipe documents and populate user details in the orderInfo
    const recipes = await BizRecipe.find().populate(
      "orderInfo.name",
      "username"
    );

    // Extract orderInfo from each BizRecipe and add the recipe name
    const ordersWithRecipeName = recipes.reduce((acc, recipe) => {
      // Check if orderInfo exists and is an array
      if (Array.isArray(recipe.orderInfo)) {
        const orders = recipe.orderInfo.map((order) => {
          return {
            ...order.toObject(), // Convert mongoose document to plain object
            recipeName: recipe.name, // Add the recipe name to each order
            userName: order.name ? order.name.username : undefined, // Add username from populated field
          };
        });
        return acc.concat(orders); // Accumulate all orders
      }
      return acc;
    }, []);

    res.json(ordersWithRecipeName);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Server Error");
  }
});

exports.updateOrder = asyncHandler(async (req, res) => {
  const { orderId, estimatedArrivalTime, status } = req.body;

  // Find the recipe containing the order
  const bizRecipe = await BizRecipe.findOne({ "orderInfo._id": orderId });

  if (!bizRecipe) {
    res.status(404).send("Order not found");
    return;
  }

  // Find the index of the order in the orderInfo array
  const orderIndex = bizRecipe.orderInfo.findIndex(
    (order) => order._id.toString() === orderId
  );

  if (orderIndex === -1) {
    res.status(404).send("Order not found in orderInfo");
    return;
  }

  // Update the order in the orderInfo array
  bizRecipe.orderInfo[orderIndex].status = status;
  bizRecipe.orderInfo[orderIndex].estimatedArrivalTime =
    estimatedArrivalTime ||
    bizRecipe.orderInfo[orderIndex].estimatedArrivalTime;

  // If the order status is 'Done', also add it to orderHistory
  if (status === "Done") {
    const completedOrder = {
      ...bizRecipe.orderInfo[orderIndex].toObject(),
      historyDate: new Date(),
    };
    bizRecipe.orderHistory.push(completedOrder); // Add to orderHistory
  }

  // Save the changes
  await bizRecipe.save();

  res.status(200).json({ message: "Order updated successfully" });
});

exports.getOrderHistory = asyncHandler(async (req, res) => {
  try {
    // Fetch all BizRecipe documents and populate user details in the orderHistory
    const recipes = await BizRecipe.find().populate(
      "orderHistory.name",
      "username"
    );

    // Extract orderHistory from each BizRecipe and add the recipe name
    const orderHistoriesWithRecipeName = recipes.reduce((acc, recipe) => {
      // Check if orderHistory exists and is an array
      if (Array.isArray(recipe.orderHistory)) {
        const histories = recipe.orderHistory.map((history) => {
          return {
            ...history.toObject(), // Convert mongoose document to plain object
            recipeName: recipe.name, // Add the recipe name to each history item
            userName: history.name ? history.name.username : undefined, // Add username from populated field
          };
        });
        return acc.concat(histories); // Accumulate all history items
      }
      return acc;
    }, []);

    res.json(orderHistoriesWithRecipeName);
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).send("Server Error");
  }
});

exports.postRating = asyncHandler(async (req, res) => {
  const recipeId = req.body.id;
  const userId = req.body.name; // Assuming this is the user's ID
  const userReview = req.body.reviews;
  const userRating = req.body.ratings;

  try {
    // Find the recipe by ID and push the new rating
    const recipe = await BizRecipe.findById(recipeId);

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
    const recipe = await BizRecipe.findById(recipeId);
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
  const recipeId = req.params.bizRecipeId;
  const reviewId = req.body.reviewId;

  try {
    const recipe = await BizRecipe.findById(recipeId);
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

exports.clearDoneOrRejectedOrders = asyncHandler(async (req, res) => {
  const userId = req.body.userId;
  try {
    await BizRecipe.updateMany(
      {
        "orderInfo.name": userId,
        "orderInfo.status": { $in: ["Done", "Rejected"] },
      },
      { $pull: { orderInfo: { status: { $in: ["Done", "Rejected"] } } } }
    );
    res.json({ success: true, message: "Orders cleared successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error clearing orders",
        error: error.message,
      });
  }
});
