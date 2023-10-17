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
  const email = req.body.email;

  //   const passwordConfirmation = req.body.passwordConfirmation;

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
  else if (!email) {
    return res.status(400).json({ message: "Please enter your email address" });
  } else if (password.length < 6)
    return res
      .status(400)
      .json({ message: "Please enter a password more than 6 characters" });
  //   else if (password !== passwordConfirmation) {
  //     return res
  //       .status(400)
  //       .json({ message: "Password and confirmation do not match" });
  //   }

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
      age: 0,
      height: 0,
      weight: 0,
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
