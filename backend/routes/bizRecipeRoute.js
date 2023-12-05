const express = require("express");
const router = express.Router();
const bizRecipeController = require("../controllers/bizRecipeController");

//food => GET
router.get("/", bizRecipeController.getBizRecipe);

//food => GET
router.get("/getBizRecipeId/:bizRecipeId", bizRecipeController.getBizRecipeId);
router.get("/getReportedBizRecipe", bizRecipeController.getReportedBizRecipes);

//food => POST
router.post("/", bizRecipeController.postBizRecipe);
router.post("/reportBizRecipe/:recipeId", bizRecipeController.reportBizRecipe);

//food => PUT
router.put("/updateBizRecipe/:recipeId", bizRecipeController.updateBizRecipe);
router.put("/dismissReport/:recipeId", bizRecipeController.dismissReport);


//food => DELETE
router.delete(
  "/deleteBizRecipe/:recipeId",
  bizRecipeController.deleteBizRecipe
);

module.exports = router;
