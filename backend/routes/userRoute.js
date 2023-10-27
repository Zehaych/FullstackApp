const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

//GET user testing to see if database deployed delete later
router.get("/", userController.getUsers);

//user -> POST
router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/editUser/:id", userController.editUser);
router.get("/getUserById/:id", userController.getUserById);
router.put("/postCalories/:id", userController.postCalories);
//router.get("/user/allergies", userController.getUserAllergies);

module.exports = router;
