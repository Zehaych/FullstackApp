//https://api.spoonacular.com/recipes/complexSearch

const API_KEY = "4c52cb82f761490fa7dbf7bb39a6dfb1";
// const API_KEY = 'c340febd6b744850a0a6b615ae95899b';
// const API_KEY = "f4991d4623324aaaaad5a221c320c38f";
//const API_KEY = "a0e96efb400344959ce64a39e0b5c786";
// const API_KEY = "16b4790ed40a4172a9f8981cd5a333db";
// const API_KEY = "0a379b4c97a648aeb0051120265dcfca";

//search recipes by query
export async function fetchRecipes(query) {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${query}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.results;
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
export async function fetchRecommendations(targetCalories) {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/mealplanner/generate?apiKey=${API_KEY}&timeFrame=day&targetCalories=${targetCalories}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const recommendations = data.meals.map((meal) => meal.title);
    return recommendations;
  } catch (error) {
    console.error("Error fetching meal recommendations:", error);
    throw error;
  }
}
