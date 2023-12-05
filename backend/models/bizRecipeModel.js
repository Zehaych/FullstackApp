
const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
  user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true
  },
  feedback: {
      type: String,
      required: true
  },
  additionalComment: {
      type: String
  },
  reportedAt: {
      type: Date,
      default: Date.now
  }
});

const bizRecipeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    instructions: {
      type: [String],
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    submitted_by: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isReported: {
      type: Boolean,
      default: false
    },
    reportedBy: [reportSchema]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BizRecipe", bizRecipeSchema);
