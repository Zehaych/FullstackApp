const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");

//GET user testing to see if database deployed delete later
router.get("/", userController.getUsers);

//user -> POST
router.post("/register", userController.register);


module.exports = router;