const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  isValidated: {
    type: Boolean,
    required: true,
  },
  hasAccess: {
    type: Boolean,
    required: true,
  },
  allergies: [
    {
      type: String,
    },
  ],
  age: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  calorie: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
