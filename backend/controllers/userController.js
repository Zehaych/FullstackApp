const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const cron = require("node-cron");

const User = require("../models/userModel");

const bcrypt = require("bcryptjs");

//@desc GET
//@route GET/user
//@access public
exports.getUsers = asyncHandler(async (req, res) => {
  const user = await User.find();
  res.json(user);
});

exports.getUserTypes = asyncHandler(async (req, res) => {
  const userType = req.query.userType; // Retrieve the userType from query parameters
  const query = userType ? { userType: userType } : {}; // Build the query condition

  const users = await User.find(query); // Find users based on the query
  res.json(users);
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
      dailyCaloriesLog: [],
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
// exports.login = async (req, res) => {
//   // const {username, password} = req.body;
//   const username = req.body.username;
//   const password = req.body.password;
//   const isActive = req.body.isActive;

//   try {
//     const user = await User.findOne({ username: username });

//     if (!user) {
//       res.status(400).json({
//         message: "Login unsuccessful",
//         error: "User not found",
//       });
//     }
//     if (!user.isActive) {
//       return res.status(400).json({
//         message: "Account Suspended",
//         error: "Your account has been suspended",
//       });
//     } else {
//       bcrypt.compare(password, user.password).then((match) => {
//         if (match) {
//           res.status(200).json({
//             message: "Login successful",
//             user,
//           });
//         } else {
//           res.status(400).json({
//             message: "Login not successful",
//             error: "Incorrect password",
//           });
//         }
//       });
//     }
//   } catch (error) {
//     res.status(400).json({
//       message: "Error occured",
//       error: error.message,
//     });
//   }
// };
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(400).json({
        message: "Login unsuccessful",
        error: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(400).json({
        message: "Account Suspended",
        error: "Your account has been suspended",
      });
    }

    // Compare passwords asynchronously
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      return res.status(200).json({
        message: "Login successful",
        user,
      });
    } else {
      return res.status(400).json({
        message: "Login not successful",
        error: "Incorrect password",
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "Error occurred",
      error: error.message,
    });
  }
};

// exports.editUser = async (req, res) => {
//   const { id } = req.params;
//   const {
//     weight,
//     height,
//     age,
//     gender,
//     calorie,
//     allergies,
//     medicalHistory,
//     foodRestrictions,
//     email,
//     username,
//     password,
//   } = req.body;

//   // Fetch the user from the database
//   const user = await User.findById(id);

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   // Check if the provided username is already taken by another user
//   const existingUser = await User.findOne({ username: username });

//   if (existingUser && existingUser._id.toString() !== id) {
//     return res.status(400).json({ message: "Username already taken" });
//   }

//   // Compare the provided password with the hashed password in the database
//   bcrypt.compare(password, user.password, async (err, match) => {
//     if (err || !match) {
//       return res.status(400).json({ message: "Incorrect password" });
//     }

//     try {
//       // Update user details if password is correct
//       const updatedUser = await User.findByIdAndUpdate(
//         id,
//         {
//           weight,
//           height,
//           age,
//           gender,
//           calorie,
//           allergies,
//           medicalHistory,
//           foodRestrictions,
//           email,
//           username,
//           password,
//         },
//         { new: true, runValidators: true, context: "query" }
//       );

//       res
//         .status(200)
//         .json({ message: "User updated successfully", user: updatedUser });
//     } catch (error) {
//       console.error(error);
//       res
//         .status(500)
//         .json({ message: "Error updating user", error: error.message });
//     }
//   });
// };

exports.editUserHealth = async (req, res) => {
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

exports.editUsername = async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  //check if user exist
  const userExist = await User.findOne({ username: username });

  // Retrieve the user by ID
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Verify the provided password
  const passwordMatch = await bcrypt.compare(req.body.password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  if (userExist)
    return res.status(400).json({ message: "Username already taken" });

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        username,
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

exports.editEmail = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  //check if email exist
  const emailExist = await User.findOne({ email: email });

  // Retrieve the user by ID
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Verify the provided password
  const passwordMatch = await bcrypt.compare(req.body.password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  if (emailExist)
    return res.status(400).json({ message: "Email already taken" });

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        email,
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

exports.editPassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword, newPasswordConfirmation } = req.body;

  // Retrieve the user by ID
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "New password must be at least 6 characters long." });
  } else if (newPassword !== newPasswordConfirmation) {
    return res
      .status(400)
      .json({ message: "Password and confirmation do not match" });
  }

  // Verify the provided current password
  const passwordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  try {
    // Hash the new password
    const saltRounds = 10;
    const newHashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password in the database
    user.password = newHashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    res
      .status(500)
      .json({ message: "Error updating password.", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.email !== email) {
      return res.status(401).json({ message: "Invalid email." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "Account deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res
      .status(500)
      .json({ message: "Error deleting account.", error: error.message });
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

//@desc     Setting the date automatically
cron.schedule("0 0 * * *", async () => {
  // This will run at 00:00 every day
  const allUsers = await User.find({});
  allUsers.forEach(async (user) => {
    // Check if the last entry in the log is for today
    const offset = 8; //GMT +8
    const today = new Date();
    today.setHours(-offset, 0, 0, 0);

    if (
      user.dailyCaloriesLog.length === 0 ||
      user.dailyCaloriesLog[user.dailyCaloriesLog.length - 1].date.getTime() !==
        today.getTime()
    ) {
      user.dailyCaloriesLog.push({
        date: today,
        total_calories: 0,
      });
      await user.save();
    }
  });
});

exports.postCalories = async (req, res) => {
  const { id } = req.params;
  const { total_calories } = req.body;

  try {
    // Find the user by id
    const user = await User.findById(id);

    // If user not found, respond with 404 status code
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (
      user.dailyCaloriesLog.length === 0 ||
      user.dailyCaloriesLog[user.dailyCaloriesLog.length - 1].date.getTime() !==
        today.getTime()
    ) {
      user.dailyCaloriesLog.push({
        date: today,
        total_calories,
      });
    } else {
      user.dailyCaloriesLog[user.dailyCaloriesLog.length - 1].total_calories =
        total_calories;
    }

    await user.save();

    // Respond with a success message
    res.status(200).send("Updated successfully");
  } catch (error) {
    res.status(500).send("Server Error: " + error.message);
  }
};

//Suspend User 
exports.suspendUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
      return res.status(404).json({ message: "User not found" });
  }

  user.isActive = false;
  await user.save();

  res.status(200).json({ message: "User suspended successfully" });
});

//Unsuspend User
exports.unsuspendUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
      return res.status(404).json({ message: "User not found" });
  }

  user.isActive = true;
  await user.save();

  res.status(200).json({ message: "User reactivated successfully" });
});

//Validation for Admin Password meant for deleting business partners
exports.validateAdminPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  // Specific admin user in the database.
  const adminUser = await User.findOne({ username: 'testadmin' }); //Admin username

  if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, adminUser.password);

  if (!isPasswordValid) {
      return res.status(401).json({ isValid: false });
  }

  res.status(200).json({ isValid: true });
});

// Deleting Business Partner from System Admin
exports.deleteBusinessPartner = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const businessPartner = await User.findById(userId);

  if (!businessPartner) {
      return res.status(404).json({ message: "Business partner not found" });
  }

  await User.deleteOne({ _id: userId });

  res.status(200).json({ message: "Business partner deleted successfully" });
});

// Deleting User from System Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);

  if (!user) {
      return res.status(404).json({ message: "User not found" });
  }

  await User.deleteOne({ _id: userId });

  res.status(200).json({ message: "User deleted successfully" });
});



// exports.postCalories = async (req, res) => {
//   const {id} = req.params;
//   const {total_calories } = req.body;

//   // Find the user by id
//   const user = await User.findById(id);

//   // If user not found, respond with 404 status code
//   if (!user) {
//       return res.status(404).json({ message: "User not found" });
//   }

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   if (user.dailyCaloriesLog.length === 0 || user.dailyCaloriesLog[user.dailyCaloriesLog.length - 1].date.getTime() !== today.getTime()) {
//       user.dailyCaloriesLog.push({
//           date: today,
//           total_calories
//       });
//   } else {
//       user.dailyCaloriesLog[user.dailyCaloriesLog.length - 1].total_calories = total_calories;
//   }

//   await user.save();

//   // Respond with a success message
//   res.status(200).send('Updated successfully');
// };

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
