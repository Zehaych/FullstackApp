const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

//GET user testing to see if database deployed delete later
router.get("/getUsers", userController.getUsers);
router.get("/getUserTypes", userController.getUserTypes);

//user -> POST
router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/editUserHealth/:id", userController.editUserHealth);
router.put("/editUsername/:id", userController.editUsername);
router.put("/editEmail/:id", userController.editEmail);

// router.put("/editUsernameAndEmail/:id", userController.editUsernameAndEmail);
router.get("/getUserById/:id", userController.getUserById);
router.put("/postCalories/:id", userController.postCalories);
//router.get("/user/allergies", userController.getUserAllergies);

module.exports = router;
