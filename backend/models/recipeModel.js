const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  additionalComment: {
    type: String,
  },
  reportedAt: {
    type: Date,
    default: Date.now,
  },
});

const recipeSchema = mongoose.Schema(
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
    submitted_by: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isReported: {
      type: Boolean,
      default: false,
    },
    reportedBy: [reportSchema],
    reviewsAndRatings: [
      {
        name: {
          type: mongoose.Types.ObjectId,
          ref: "User",
          required: true,
        },
        reviews: {
          type: String,
          required: true,
        },
        ratings: {
          type: Number,
          required: true,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Recipe", recipeSchema);
