const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorMiddleware");

const port = process.env.PORT || 3000;

// Connect to the MongoDB database
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

//importing routes
const recipeRoute = require("./routes/recipeRoute");
const FoodAndDrinksRoute = require("./routes/FoodAndDrinksRoute");


// Middleware to handle and catch errors
app.use(errorHandler);

//setting the route naming
app.use("/recipe", recipeRoute);
app.use("/FoodAndDrinks", FoodAndDrinksRoute);


// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
