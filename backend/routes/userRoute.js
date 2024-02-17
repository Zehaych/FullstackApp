const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

//GET user testing to see if database deployed delete later
router.get("/getUsers", userController.getUsers);
router.get("/getUserTypes", userController.getUserTypes);

//user -> POST
router.post("/validateAdminPassword", userController.validateAdminPassword);
router.post("/suspend/:id", userController.suspendUser);
router.patch("/unsuspend/:id", userController.unsuspendUser);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/editUserHealth/:id", userController.editUserHealth);
router.put("/editUsername/:id", userController.editUsername);
router.put("/editEmail/:id", userController.editEmail);
router.put("/editPassword/:id", userController.editPassword);
router.put("/updateUsername/:id", userController.updateUsername);

router.delete("/deleteUser/:id", userController.deleteUser);
router.delete(
  "/deleteBusinessPartner/:id",
  userController.deleteBusinessPartner
);
router.delete("/deleteUser/:id", userController.deleteUser);

// router.put("/editUsernameAndEmail/:id", userController.editUsernameAndEmail);
router.get("/getUserById/:id", userController.getUserById);
router.put("/postCalories/:id", userController.postCalories);
//router.get("/user/allergies", userController.getUserAllergies);
router.patch("/updateFavorites/:id", userController.updateFavorites);
router.patch("/updateBizFavorites/:id", userController.updateBizFavorites);
router.patch("/updateBizCart/:id", userController.updateBizCart);
router.delete("/clearBizCart/:id", userController.clearBizCart);
router.get("/getUserCart/:id", userController.getUserCart);

router.get("/getFoodRecognition/:id", userController.getFoodRecognition);
router.patch("/updateFoodRecognition/:id", userController.updateFoodRecognition)

module.exports = router;
