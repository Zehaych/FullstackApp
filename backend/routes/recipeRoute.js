const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");

//food => GET
router.get("/", recipeController.getRecipe);

module.exports = router;