//https://api.spoonacular.com/recipes/complexSearch

// const API_KEY = "4c52cb82f761490fa7dbf7bb39a6dfb1";
// const API_KEY = "c340febd6b744850a0a6b615ae95899b";
// const API_KEY = "f4991d4623324aaaaad5a221c320c38f";
const API_KEY = "a0e96efb400344959ce64a39e0b5c786";
// const API_KEY = "16b4790ed40a4172a9f8981cd5a333db";
// const API_KEY = "0a379b4c97a648aeb0051120265dcfca";
// const API_KEY = "896cbe4ca4d04cbaa770db45e4221a86";
//  const API_KEY = "dcdece78ff304c2c8458ae107c8d6435";
// const API_KEY = "58a60f0d87ed4b93910367fe8a51d35d";

//search recipes by query
// export async function fetchRecipes(query) {
//   try {
//     const response = await fetch(
//       `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${query}`
//     );

//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }

//     const data = await response.json();
//     return data.results;
//   } catch (error) {
//     console.error("Error fetching recipes:", error);
//     throw error;
//   }
// }

// search recipes by query and allergies
export async function fetchRecipes(query, allergies) {
  let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${query}`;

  // Gather all intolerances into an array
  const intolerances = [
    "Egg",
    "Dairy",
    "Gluten",
    "Grain",
    "Peanut",
    "Seafood",
    "Sesame",
    "Shellfish",
    "Soy",
    "Sulfite",
    "Tree Nut",
    "Wheat",
  ]
    .filter((intolerance) => allergies.includes(intolerance))
    .join(",");

  // If there are any intolerances, append them to the URL
  if (intolerances.length > 0) {
    url += `&intolerances=${intolerances}`;
  }

  // commented as of today for testing
  // if (foodRestrictions.includes("Sodium")) {
  //   url += "&maxSodium=30";
  // }
  // if (foodRestrictions.includes("Saturated Fat")) {
  //   url += "&maxSaturatedFat=0.2";
  // }
  // if (foodRestrictions.includes("Sugar")) {
  //   url += "&maxSugar=0.3";
  // }
  // if (foodRestrictions.includes("Cholesterol")) {
  //   url += "&maxCholesterol=0";
  // }
  // end of comment today

  // // Define an object to map food restrictions to URL parameters
  // const restrictionParams = {
  //   Sodium: "maxSodium=30",
  //   "Saturated Fat": "maxSaturatedFat=0.2",
  //   Sugar: "maxSugar=0.3",
  //   Cholesterol: "maxCholesterol=0",
  // };

  // // Iterate through the object to check each restriction and add the URL parameter if needed
  // for (let restriction in restrictionParams) {
  //   if (foodRestrictions.includes(restriction)) {
  //     url += `&${restrictionParams[restriction]}`;
  //   }
  // }

  // commented as of today for testing
  // if (foodRestrictions.includes("Spicy")) {
  //   url += "&excludeIngredients=curry,chilli,pepper,allspice";
  // }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Additional client-side filtering
    const filteredData = data.results.filter((recipe) => {
      // Check if the recipe title includes any of the user's allergies
      const containsAllergy = allergies.some((allergy) =>
        recipe.title.toLowerCase().includes(allergy.toLowerCase())
      );

      // Extra validation for some of the allergy products
      const containsDairy =
        allergies.includes("Dairy") &&
        (recipe.title.toLowerCase().includes("milk") ||
          recipe.title.toLowerCase().includes("cheese") ||
          recipe.title.toLowerCase().includes("yogurt") ||
          recipe.title.toLowerCase().includes("cheesy"));

      const containsEgg =
        allergies.includes("Egg") &&
        (recipe.title.toLowerCase().includes("egg") ||
          recipe.title.toLowerCase().includes("eggs"));

      // Filter out recipes that contain any allergy
      return !containsAllergy && !containsDairy && !containsEgg;
    });

    return filteredData;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
}

//https://api.spoonacular.com/recipes/716429/information?includeNutrition=false
//recipe Details by id
export async function fetchRecipeDetails(recipeId) {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}&includeNutrition=true`
    );

    if (!response.ok) {
      console.error(
        `Error fetching recipe details for ID ${recipeId}. Status: ${response.status}`
      );
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching recipe details:", error);
    throw error;
  }
}

//https://api.spoonacular.com/recipes/random
//random recipes
export async function fetchRandomRecipes(numberOfRecipes) {
  try {
    // const response = await fetch(
    //   `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=10`
    // );
    const response = await fetch(
      `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=${numberOfRecipes}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.recipes;
  } catch (error) {
    console.error("Error fetching random recipes:", error);
    throw error;
  }
}

//GET https://api.spoonacular.com/recipes/1003464/ingredientWidget.json
//ingredients by id
export async function fetchRecipeIngredients(recipeId) {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${recipeId}/ingredientWidget.json?apiKey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.ingredients;
  } catch (error) {
    console.error("Error fetching recipe ingredients:", error);
    throw error;
  }
}

// GET https://api.spoonacular.com/mealplanner/generate?timeFrame=day&targetCalories=2000
// 1 day 3 meals with targetCalories
// export async function fetchRecommendations(targetCalories) {
//   try {
//     const response = await fetch(
//       `https://api.spoonacular.com/mealplanner/generate?apiKey=${API_KEY}&timeFrame=day&targetCalories=${targetCalories}`
//     );

//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }

//     const data = await response.json();
//     const recommendations = data.meals.map((meal) => meal.title);
//     return recommendations;
//   } catch (error) {
//     console.error("Error fetching meal recommendations:", error);
//     throw error;
//   }
// }

// GET https://api.spoonacular.com/mealplanner/generate?timeFrame=day&targetCalories=2000
// 1 day 3 meals with targetCalories
// export async function fetchRecommendations(targetCalories) {
//   try {
//     const response = await fetch(
//       `https://api.spoonacular.com/mealplanner/generate?apiKey=${API_KEY}&timeFrame=day&targetCalories=${targetCalories}`
//     );

//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }

//     const data = await response.json();
//     const recommendations = data.meals.map((meal) => meal.title);
//     const totalCalories = data.nutrients.calories; // Fetching total calories from the nutrients object
//     return { recommendations, totalCalories };
//   } catch (error) {
//     console.error("Error fetching meal recommendations:", error);
//     throw error;
//   }
// }

export async function fetchRecommendations(targetCalories, allergies) {
  let url = `https://api.spoonacular.com/mealplanner/generate?apiKey=${API_KEY}&timeFrame=day&targetCalories=${targetCalories}`;

  // Gather all intolerances into an array and append them to the URL if they exist
  const intolerances = [
    "Egg",
    "Dairy",
    "Gluten",
    "Grain",
    "Peanut",
    "Seafood",
    "Sesame",
    "Shellfish",
    "Soy",
    "Sulfite",
    "Tree Nut",
    "Wheat",
  ]
    .filter((intolerance) => allergies.includes(intolerance))
    .join(",");

  if (intolerances.length > 0) {
    url += `&exclude=${intolerances}`;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching meal recommendations:", error);
    throw error;
  }
}

// export async function fetchRecommendations(targetCalories, foodRestrictions) {
//   try {
//     // Build the excludeIngredients string based on food restrictions
//     const excludedIngredients = foodRestrictions.join(",");

//     const response = await fetch(
//       `https://api.spoonacular.com/recipes/findByNutrients?apiKey=${API_KEY}&minCalories=${
//         targetCalories - 200
//       }&maxCalories=${
//         targetCalories + 200
//       }&excludeIngredients=${excludedIngredients}`
//     );

//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }

//     const data = await response.json();
//     const recommendations = data.map((recipe) => recipe.title);
//     const totalCalories = recommendations.reduce(
//       (sum, recipe) =>
//         sum +
//         recipe.nutrition.nutrients.find((n) => n.title === "Calories").amount,
//       0
//     );
//     return { recommendations, totalCalories };
//   } catch (error) {
//     console.error("Error fetching meal recommendations:", error);
//     throw error;
//   }
// }
