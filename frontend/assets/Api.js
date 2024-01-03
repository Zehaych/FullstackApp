//https://api.spoonacular.com/recipes/complexSearch

// const API_KEY = "4c52cb82f761490fa7dbf7bb39a6dfb1";
// const API_KEY = "c340febd6b744850a0a6b615ae95899b";
// const API_KEY = "f4991d4623324aaaaad5a221c320c38f";
// const API_KEY = "a0e96efb400344959ce64a39e0b5c786";
// const API_KEY = "16b4790ed40a4172a9f8981cd5a333db";
// const API_KEY = "0a379b4c97a648aeb0051120265dcfca";
// const API_KEY = "896cbe4ca4d04cbaa770db45e4221a86";
//  const API_KEY = "dcdece78ff304c2c8458ae107c8d6435";
// const API_KEY = "58a60f0d87ed4b93910367fe8a51d35d";
const API_KEY = "2bae20929e0a41c5ad10d0da59c10e61";
//const API_KEY = "72cf1577b57441a7abf14ae4fbc0b3a6";

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

// search recipes by query and foodRestrictions
export async function fetchRecipes(query, foodRestrictions) {
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
    .filter((intolerance) => foodRestrictions.includes(intolerance))
    .join(",");

  // If there are any intolerances, append them to the URL
  if (intolerances.length > 0) {
    url += `&intolerances=${intolerances}`;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Additional client-side filtering
    const filteredData = data.results.filter((recipe) => {
      // Check if the recipe title includes any of the user's foodRestrictions
      const containsFoodRestrictions = foodRestrictions.some(
        (foodRestriction) =>
          recipe.title.toLowerCase().includes(foodRestriction.toLowerCase())
      );

      // Extra validation for some of the allergy products
      const containsDairy =
        foodRestrictions.includes("Dairy") &&
        (recipe.title.toLowerCase().includes("milk") ||
          recipe.title.toLowerCase().includes("cheese") ||
          recipe.title.toLowerCase().includes("yogurt") ||
          recipe.title.toLowerCase().includes("cheesy") ||
          recipe.title.toLowerCase().includes("butter") ||
          recipe.title.toLowerCase().includes("cream cheese") ||
          recipe.title.toLowerCase().includes("ghee") ||
          recipe.title.toLowerCase().includes("whey"));

      const containsEgg =
        foodRestrictions.includes("Egg") &&
        recipe.title.toLowerCase().includes("eggs");

      const containsSpicy =
        foodRestrictions.includes("Spicy") &&
        (recipe.title.toLowerCase().includes("spice") ||
          recipe.title.toLowerCase().includes("spices") ||
          recipe.title.toLowerCase().includes("chili") ||
          recipe.title.toLowerCase().includes("chilli") ||
          recipe.title.toLowerCase().includes("pepper") ||
          recipe.title.toLowerCase().includes("curry") ||
          recipe.title.toLowerCase().includes("hot") ||
          recipe.title.toLowerCase().includes("allspice"));

      const containsSugar =
        foodRestrictions.includes("Sugar") &&
        (recipe.title.toLowerCase().includes("sweet") ||
          recipe.title.toLowerCase().includes("sugary") ||
          recipe.title.toLowerCase().includes("sugared") ||
          recipe.title.toLowerCase().includes("honey") ||
          recipe.title.toLowerCase().includes("syrup") ||
          recipe.title.toLowerCase().includes("molasses") ||
          recipe.title.toLowerCase().includes("cake") ||
          recipe.title.toLowerCase().includes("candy") ||
          recipe.title.toLowerCase().includes("chocolate") ||
          recipe.title.toLowerCase().includes("candies") ||
          recipe.title.toLowerCase().includes("chocolates"));

      const containsSalt =
        foodRestrictions.includes("Sodium") &&
        (recipe.title.toLowerCase().includes("salt") ||
          recipe.title.toLowerCase().includes("salty") ||
          recipe.title.toLowerCase().includes("salted") ||
          recipe.title.toLowerCase().includes("brine") ||
          recipe.title.toLowerCase().includes("soy sauce"));

      const containsSaturatedFat =
        foodRestrictions.includes("SaturatedFat") &&
        (recipe.title.toLowerCase().includes("butter") ||
          recipe.title.toLowerCase().includes("cheese") ||
          recipe.title.toLowerCase().includes("fatty meat") ||
          recipe.title.toLowerCase().includes("cream") ||
          recipe.title.toLowerCase().includes("lard") ||
          recipe.title.toLowerCase().includes("palm oil") ||
          recipe.title.toLowerCase().includes("coconut oil"));

      const containsCholesterol =
        (foodRestrictions.includes("Cholesterol") &&
          (recipe.title.toLowerCase().includes("egg") ||
            recipe.title.toLowerCase().includes("cheese") ||
            recipe.title.toLowerCase().includes("butter") ||
            recipe.title.toLowerCase().includes("red meat") ||
            recipe.title.toLowerCase().includes("pork") ||
            recipe.title.toLowerCase().includes("chicken") ||
            recipe.title.toLowerCase().includes("beef"))) ||
        recipe.title.toLowerCase().includes("shrimp") ||
        recipe.title.toLowerCase().includes("lobster") ||
        recipe.title.toLowerCase().includes("lamb");

      // Filter out recipes that contain any allergy
      return (
        !containsFoodRestrictions &&
        !containsDairy &&
        !containsEgg &&
        !containsSpicy &&
        !containsSugar &&
        !containsSalt &&
        !containsSaturatedFat &&
        !containsCholesterol
      );
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

export async function fetchRecommendations(targetCalories, foodRestrictions) {
  let url = `https://api.spoonacular.com/mealplanner/generate?apiKey=${API_KEY}&timeFrame=day&targetCalories=${targetCalories}`;

  // // Gather all intolerances into an array and append them to the URL if they exist
  // const intolerances = [
  //   "Egg",
  //   "Dairy",
  //   "Gluten",
  //   "Grain",
  //   "Peanut",
  //   "Seafood",
  //   "Sesame",
  //   "Shellfish",
  //   "Soy",
  //   "Sulfite",
  //   "Tree Nut",
  //   "Wheat",
  // ]
  //   .filter((intolerance) => allergies.includes(intolerance))
  //   .join(",");

  // if (intolerances.length > 0) {
  //   url += `&exclude=${intolerances}`;
  // }

  const restrictionMap = {
    Dairy: [
      "milk",
      "cheese",
      "yogurt",
      "butter",
      "cream cheese",
      "ghee",
      "whey",
      "dairy",
    ],
    Egg: ["egg", "eggs"],
    Spicy: [
      "spice",
      "spices",
      "chili",
      "chilli",
      "pepper",
      "curry",
      "hot",
      "allspice",
      "spicy",
    ],
    Sugar: [
      "sweet",
      "sugary",
      "sugared",
      "honey",
      "syrup",
      "molasses",
      "cake",
      "candy",
      "chocolate",
      "candies",
      "chocolates",
      "sugar",
    ],
    Sodium: ["salt", "salty", "salted", "brine", "soy sauce", "sodium"],
    "Saturated Fat": [
      "fatty meat",
      "cream",
      "lard",
      "palm oil",
      "coconut oil",
      "saturated fat",
    ],
    Cholesterol: [
      "red meat",
      "pork",
      "chicken",
      "beef",
      "shrimp",
      "lobster",
      "lamb",
      "cholesterol",
    ],
    Soy: ["soy"],
    Peanut: ["peanut"],
    Seafood: ["seafood"],
    Sulfite: ["sulfite"],
    Gluten: ["gluten"],
    Sesame: ["sesame"],
    "Tree Nut": ["tree nut"],
    Grain: ["grain"],
    Shellfish: ["shellfish"],
    Wheat: ["wheat"],
  };

  // Gather all ingredients to exclude based on foodRestrictions
  const exclusions = foodRestrictions
    .flatMap((restriction) => {
      return restrictionMap[restriction] || [];
    })
    .join(",");

  // Append the exclusions to the URL
  if (exclusions.length > 0) {
    url += `&exclude=${exclusions}`;
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

export async function fetchWeeklyRecommendations(foodRestrictions) {
  let url = `https://api.spoonacular.com/mealplanner/generate?apiKey=${API_KEY}&timeFrame=week`;

  // Gather all intolerances into an array and append them to the URL if they exist
  // const intolerances = [
  //   "Egg",
  //   "Dairy",
  //   "Gluten",
  //   "Grain",
  //   "Peanut",
  //   "Seafood",
  //   "Sesame",
  //   "Shellfish",
  //   "Soy",
  //   "Sulfite",
  //   "Tree Nut",
  //   "Wheat",
  // ]
  //   .filter((intolerance) => foodRestrictions.includes(intolerance))
  //   .join(",");

  // if (intolerances.length > 0) {
  //   url += `&exclude=${intolerances}`;
  // }

  // Map of foodRestrictions to their corresponding ingredients
  const restrictionMap = {
    Dairy: [
      "milk",
      "cheese",
      "yogurt",
      "butter",
      "cream cheese",
      "ghee",
      "whey",
      "dairy",
    ],
    Egg: ["egg", "eggs"],
    Spicy: [
      "spice",
      "spices",
      "chili",
      "chilli",
      "pepper",
      "curry",
      "hot",
      "allspice",
      "spicy",
    ],
    Sugar: [
      "sweet",
      "sugary",
      "sugared",
      "honey",
      "syrup",
      "molasses",
      "cake",
      "candy",
      "chocolate",
      "candies",
      "chocolates",
      "sugar",
    ],
    Sodium: ["salt", "salty", "salted", "brine", "soy sauce", "sodium"],
    "Saturated Fat": [
      "fatty meat",
      "cream",
      "lard",
      "palm oil",
      "coconut oil",
      "saturated fat",
    ],
    Cholesterol: [
      "red meat",
      "pork",
      "chicken",
      "beef",
      "shrimp",
      "lobster",
      "lamb",
      "cholesterol",
    ],
    Soy: ["soy"],
    Peanut: ["peanut"],
    Seafood: ["seafood"],
    Sulfite: ["sulfite"],
    Gluten: ["gluten"],
    Sesame: ["sesame"],
    "Tree Nut": ["tree nut"],
    Grain: ["grain"],
    Shellfish: ["shellfish"],
    Wheat: ["wheat"],
  };

  // Gather all ingredients to exclude based on foodRestrictions
  const exclusions = foodRestrictions
    .flatMap((restriction) => {
      return restrictionMap[restriction] || [];
    })
    .join(",");

  // Append the exclusions to the URL
  if (exclusions.length > 0) {
    url += `&exclude=${exclusions}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    // Create a Set to track unique recipe IDs
    const uniqueIds = new Set();

    // Flatten the meals for each day into a single array and filter duplicates
    const allMeals = Object.values(data.week)
      .flatMap((day) => day.meals)
      .filter((meal) => {
        const isDuplicate = uniqueIds.has(meal.id);
        uniqueIds.add(meal.id);
        return !isDuplicate;
      });

    return allMeals;
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
