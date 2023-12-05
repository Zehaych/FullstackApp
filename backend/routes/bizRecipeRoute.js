const express = require("express");
const router = express.Router();
const bizRecipeController = require("../controllers/bizRecipeController");

//food => GET
router.get("/", bizRecipeController.getBizRecipe);

//food => GET
router.get("/getBizRecipeId/:bizRecipeId", bizRecipeController.getBizRecipeId);

//food => POST
router.post("/", bizRecipeController.postBizRecipe);
router.post("/reportBizRecipe/:recipeId", bizRecipeController.reportBizRecipe);

//food => PUT
router.put("/updateBizRecipe/:recipeId", bizRecipeController.updateBizRecipe);

//food => DELETE
router.delete(
  "/deleteBizRecipe/:recipeId",
  bizRecipeController.deleteBizRecipe
);

module.exports = router;
