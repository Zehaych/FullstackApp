import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { fetchRecipeDetails, fetchRecipeIngredients } from '../assets/Api';

const OnlineRecipeInfoScreen = ({ route }) => {
    const { recipeId } = route.params;
    const [recipeDetails, setRecipeDetails] = useState(null);
    const [recipeIngredients, setRecipeIngredients] = useState(null);

    useEffect(() => {
        // Fetch meal details by id
        fetchRecipeDetails(recipeId)
            .then((data) => setRecipeDetails(data))
            .catch((error) => console.error('Error fetching recipe details:', error));
        
        // Fetch recipe ingredients by id
        fetchRecipeIngredients(recipeId)
            .then((data) => setRecipeIngredients(data))
            .catch((error) => console.error('Error fetching recipe details:', error));
        
    }, [recipeId]);
  
    return (
        <ScrollView>
            {recipeDetails ? (
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: recipeDetails.image }}style={styles.image}/> 
                    </View>
                    <Text style={styles.customHeadings}>{recipeDetails.title}</Text>
                    {recipeIngredients !== null ? (     //check if recipeIngredients is not null
                        <View>
                            <Text style={styles.customHeadings}>Ingredients:</Text>
                            {recipeIngredients.map((ingredient, index) => (
                                <Text key={index} style={styles.customText}>
                                    {ingredient.name} - {ingredient.amount.metric.value} {ingredient.amount.metric.unit}
                                </Text>
                            ))}
                        </View>
                    ) : (
                        <Text>Loading recipe ingredients...</Text>
                    )}
                    <Text style={styles.customHeadings}>Instructions:</Text>
                    <Text style={styles.customText}>{recipeDetails.instructions}</Text>
                    <Text></Text>
                </View>
            ) : (
                <Text>Loading recipe details...</Text>
            )}
        </ScrollView>
    );
};
    
export default OnlineRecipeInfoScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        fontFamily: "Roboto",
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',  // Center the image vertically
        alignItems: 'center',  // Center the image horizontally
    },
    image: {
        width: '100%',  // Occupy the entire width
        height: 200,  // Fixed height
    },
    customHeadings:{
        fontWeight: 'bold',
        fontSize: 20,
        margin: 10,

    },
    customText:{
        fontSize: 16,
        textAlign: 'left',
        margin: 10,
    }
  });