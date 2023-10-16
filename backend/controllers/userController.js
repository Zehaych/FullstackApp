const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

// const bcrypt = require("bcryptjs");

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

// exports.register = async(req, res) => {
//     const userName = req.body.userName;

//     //check if user exist
//     const userExist = await User.findOne({username: username});

//     if (userExist)
//     return res.status(400).json({message: "Username already taken"});

//     if (req.body.password.length < 6)
//     return res.status(400).json({message: "Please enter a password more than 6 characters"});

//     bcrypt.hash(req.body.password, 10).then(async(hash) => {
//         await User.create({
//             username: userName,
//             password: hash,
//             email: email,
//             userType: req.body.userType,
//             isActive: true,
//             isValidated: true,
//             hasAccess: false,
//             allergies: [],
//             age: 0,
//             height: 0,
//             weight: 0,
//         })
//         .then((user) => 
//             res.status(200).json({
//                 message: "User created successfully",
//                 user,
//             })
//         )
//         .catch((err) => 
//             res.status(400).json({
//                 message: "User not created",
//                 error: err.message,
//             })
//         );
//     });
// };