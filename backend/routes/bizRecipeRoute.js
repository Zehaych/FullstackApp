const express = require("express");
const router = express.Router();
const bizRecipeController = require("../controllers/bizRecipeController");

//food => GET
router.get("/", bizRecipeController.getBizRecipe);

//food => GET
router.get("/getBizRecipeId/:bizRecipeId", bizRecipeController.getBizRecipeId);

//food => GET
router.get("/getBizRecipeByUserId", bizRecipeController.getBizRecipeByUserId);

//food => GET
router.get(
  "/getBizRecipeIdByUserId/:bizRecipeId",
  bizRecipeController.getBizRecipeIdByUserId
);

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

router.post("/submitOrder/:bizRecipeId", bizRecipeController.submitOrder);

router.get("/getOrders", bizRecipeController.getOrders);

router.post("/updateOrder", bizRecipeController.updateOrder);

router.get("/getOrderHistory", bizRecipeController.getOrderHistory);

// submit ratings -> POST
router.post("/ratings", bizRecipeController.postRating);

// edit ratings -> PATCH
router.patch("/editRating/:bizRecipeId", bizRecipeController.editRating);

// delete ratings -> DELETE
router.delete("/deleteRating/:bizRecipeId", bizRecipeController.deleteRating);

router.post("/clearOrders", bizRecipeController.clearDoneOrRejectedOrders);

module.exports = router;
