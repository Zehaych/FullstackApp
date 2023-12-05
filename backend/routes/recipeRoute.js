const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");

//food => GET
router.get("/", recipeController.getRecipe);

//food => GET
router.get("/getRecipeId/:recipeId", recipeController.getRecipeId);
router.get("/getReportedRecipes", recipeController.getReportedRecipes);

//food => POST
router.post("/", recipeController.postRecipe);
router.post("/reportRecipe/:recipeId", recipeController.reportRecipe);

//food => PUT
router.put("/updateRecipe/:recipeId", recipeController.updateRecipe);

//food => DELETE
router.delete("/deleteRecipe/:recipeId", recipeController.deleteRecipe);

module.exports = router;
