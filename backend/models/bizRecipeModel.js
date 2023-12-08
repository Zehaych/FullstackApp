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
      default: false,
    },
    reportedBy: [reportSchema],
    orderedBy: [
      {
        name: {
          type: mongoose.Types.ObjectId,
          ref: "User",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
        preferences: {
          type: String,
          default: "",
        },
        timeToDeliver: {
          type: String,
          required: true,
        },
        dateToDeliver: {
          type: String,
          required: true,
        },
        deliveryAddress: {
          type: String,
          required: true,
        },
      },
    ],
    deliveredBy: [
      {
        deliveredTo: {
          type: mongoose.Types.ObjectId,
          ref: "User",
          required: true,
        },
        estimatedArrivalTime: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: [
            "Rejected",
            "Pending",
            "Preparing",
            "On the way",
            "Arriving",
            "Done",
          ],
          default: "Pending", // Set default status value to 'Pending'
        },
      },
    ],
    orderHistory: [
      {
        quantity: {
          type: Number,
          required: true,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
        timeToDeliver: {
          type: String,
          required: true,
        },
        dateToDeliver: {
          type: String,
          required: true,
        },
        dailyPriceLog: [
          {
            date: {
              type: Date,
              default: Date.now,
            },
            total_price: {
              type: Number,
              default: 0,
            },
          },
        ],
        deliveredTo: [
          {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
          },
        ],
      },
    ],
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BizRecipe", bizRecipeSchema);
