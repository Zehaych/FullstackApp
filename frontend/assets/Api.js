export async function fetchRecipes(letter) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
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