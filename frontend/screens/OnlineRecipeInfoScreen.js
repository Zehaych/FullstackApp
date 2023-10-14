import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { fetchRecipesDetailsById } from '../assets/Api';

const OnlineRecipeInfoScreen = ({ route }) => {
    const { recipeId } = route.params;
    const [recipeDetails, setRecipesDetails] = useState(null);

    useEffect(() => {
        // Fetch meal details by idMeal
        fetchRecipesDetailsById(recipeId).then((data) => {
            if (data.meals && data.meals.length > 0) {
                setRecipesDetails(data.meals[0]);
            }
        })
        .catch((error) => {
            console.error('Error fetching recipe details:', error);
        });
    }, [recipeId]);
  
    return (
        <ScrollView>
            {recipeDetails && (
                <View>
                    <Image source={{ uri: recipeDetails.strMealThumb }} style={{ width: 200, height: 200 }} />
                    <Text>Name: {recipeDetails.strMeal}</Text>
                    <Text>Category: {recipeDetails.strCategory}</Text>
                    <Text>Area: {recipeDetails.strArea}</Text>
                    <Text>Instructions: {recipeDetails.strInstructions}</Text>
                    {/* Include other meal details here */}
                </View>
            )}
        </ScrollView>
    );
};
    
export default OnlineRecipeInfoScreen;