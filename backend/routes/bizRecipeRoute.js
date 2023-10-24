const express = require("express");
const router = express.Router();
const bizRecipeController = require("../controllers/bizRecipeController");

//food => GET
router.get("/", bizRecipeController.getBizRecipe);

//food => POST
router.post("/", bizRecipeController.postBizRecipe);

module.exports = router;
