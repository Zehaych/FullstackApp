export async function fetchRecipesByName(name) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.meals; // Extract the meals array from the response
    } catch (error) {
        console.error('Error fetching meals:', error);
        throw error;
    }
}

// all categories:   https://www.themealdb.com/api/json/v1/1/list.php?c=list
// all Area:   https://www.themealdb.com/api/json/v1/1/list.php?a=list
// all Ingredients:   https://www.themealdb.com/api/json/v1/1/list.php?i=list
// full meal detail by id:   https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772
// image: https://www.themealdb.com/images/media/meals/llcbn01574260722.jpg/preview

export async function fetchRecipesByArea(area) {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=${area}');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.meals; // Extract the meals array from the response
    } catch (error) {
        console.error('Error fetching meals:', error);
        throw error;
    }
}

export async function fetchRecipesByCategory(category) {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.meals; // Extract the meals array from the response
    } catch (error) {
        console.error('Error fetching meals:', error);
        throw error;
    }
}

export async function fetchRecipesByIngredient(ingredient) {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.meals; // Extract the meals array from the response
    } catch (error) {
        console.error('Error fetching meals:', error);
        throw error;
    }
}