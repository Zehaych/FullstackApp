const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

const bcrypt = require("bcryptjs");

//@desc GET
//@route GET/user
//@access public
exports.getUsers = asyncHandler(async (req, res) => {
  const user = await User.find();
  res.json(user);
});

//@desc Register a new user
//@route POST/register
//@access public

exports.register = async (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;
  const passwordConfirmation = req.body.password;
  const email = req.body.email;

  //   const passwordConfirmation = req.body.passwordConfirmation;

  const validator = require("validator");

  //check if user exist
  const userExist = await User.findOne({ username: userName });

  //check if email exist
  const emailExist = await User.findOne({ email: email });

  if (userExist)
    return res.status(400).json({ message: "Username already taken" });
  if (emailExist)
    return res.status(400).json({ message: "Email already taken" });

  if (!userName && !password && !email)
    return res.status(400).json({ message: "Empty fields are not allowed." });
  else if (!userName)
    return res.status(400).json({ message: "Please enter username" });
  else if (!email || !validator.isEmail(req.body.email)) {
    return res
      .status(400)
      .json({ message: "Please enter a proper email address" });
  } else if (password.length < 6)
    return res
      .status(400)
      .json({ message: "Please enter a password more than 6 characters" });
  else if (password !== passwordConfirmation) {
    return res
      .status(400)
      .json({ message: "Password and confirmation do not match" });
  }

  bcrypt.hash(req.body.password, 10).then(async (hash) => {
    await User.create({
      username: userName,
      password: hash,
      email: email,
      userType: req.body.userType,
      isActive: true,
      isValidated: true,
      hasAccess: false,
      allergies: [],
      medicalHistory: [],
      foodRestrictions: [],
      age: 0,
      height: 0,
      weight: 0,
      gender: " ",
      calorie: 0,
    })
      .then((user) =>
        res.status(200).json({
          message: "User created successfully",
          user,
        })
      )
      .catch((err) =>
        res.status(400).json({
          message: "User not created",
          error: err.message,
        })
      );
  });
};

// @desc Login
// @route POST/login
// @access public
exports.login = async (req, res) => {
  // const {username, password} = req.body;
  const username = req.body.username;
  const password = req.body.password;

  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      res.status(400).json({
        message: "Login unsuccessful",
        error: "User not found",
      });
    } else {
      bcrypt.compare(password, user.password).then((match) => {
        if (match) {
          res.status(200).json({
            message: "Login successful",
            user,
          });
        } else {
          res.status(400).json({
            message: "Login not successful",
            error: "Incorrect password",
          });
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Error occured",
      error: error.message,
    });
  }
};

exports.editUser = async (req, res) => {
  const { id } = req.params;
  const {
    weight,
    height,
    age,
    gender,
    calorie,
    allergies,
    medicalHistory,
    foodRestrictions,
  } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        weight,
        height,
        age,
        gender,
        calorie,
        allergies,
        medicalHistory,
        foodRestrictions,
      },
      { new: true, runValidators: true, context: "query" }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

//@desc     Get user by ID
//@route    PUT/getUserById
//@access   public

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(user);
};

/*
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  //const userId = req.params.id; 

  try{
    const user = await User.findById(id);
    if(!user){
      return res.status(404).json({message: "User not found"});
    }
    res.status(200).json({user: user});
  } catch(error){
    res.status(500).json({message: "Error fetching user", error: error.message});
  }
}


exports.getUserAllergies = async (req, res) => {
  const userId = req.params.id;
  //const userId = req.user.id; 

  try{
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({message: "User not found"});
    }
    res.status(200).json({allergies: user.allergies});
  } catch(error){
    res.status(500).json({message: "Error fetching allergies", error: error.message});
  }
};
*/
