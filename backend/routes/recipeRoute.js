const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");

//food => GET
router.get("/", recipeController.getRecipe);

//food => POST
router.post("/", recipeController.postRecipe);

module.exports = router;
