import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchRecipeDetails, fetchRecipeIngredients } from '../assets/Api';

const OnlineRecipeInfoScreen = ({ route }) => {
    const { recipeId } = route.params;
    const [recipeDetails, setRecipeDetails] = useState(null);
    const [recipeIngredients, setRecipeIngredients] = useState(null);

    useEffect(() => {
        // Fetch meal details by id
        fetchRecipeDetails(recipeId)
            .then((data) => {
                console.log("Recipe details data:", data);
                setRecipeDetails(data);})
            .catch((error) => console.error('Error fetching recipe details:', error));
        
        // Fetch recipe ingredients by id
        fetchRecipeIngredients(recipeId)
            .then((data) => setRecipeIngredients(data))
            .catch((error) => console.error('Error fetching recipe details:', error));

    }, [recipeId]);

    //handle score rating
    const handleScoreRating = (score) => {
        //console.log("Recipe Details:", recipeDetails);
        console.log("Health Score:", score);
        const fullStar = Math.floor((score / 100) * 5);
        const halfStar = (score / 100) * 5 - fullStar;
        const stars = [];
      
        for (let i = 0; i < 5; i++) {
            if (i < fullStar) {
                stars.push(<Icon key={i} name="star" size={20} color="gold" />);
            } else if (i === fullStar && halfStar >= 0.25) {
                stars.push(<Icon key={i} name="star-half-o" size={20} color="gold" />);
            } else {
                stars.push(<Icon key={i} name="star-o" size={20} color="gray" />);
            }
        }
        return stars;
    };
  
    return (
        <ScrollView>
            {recipeDetails ? (
                <View style={styles.container}>
                    {/* image */}
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: recipeDetails.image }}style={styles.image}/> 
                    </View>
                    {/* name */}
                    <Text style={styles.title}>{recipeDetails.title}</Text>
                    {/* spoonacular score */}
                    <Text style={styles.smallText}>Health Score</Text>
                    <View style={styles.scoreRating}>
                        {handleScoreRating(recipeDetails.healthScore)}
                    </View>
                    {/* servings, time taken, calories */}
                    <View style={styles.componentContainer}>
                        <View style={styles.leftComponent}>
                            <Text style={styles.smallHeadings}>Servings</Text>
                            <Text style={styles.smallText}>{recipeDetails.servings}</Text>
                        </View>
                        <View style={styles.middleComponent}>
                            <Text style={styles.smallHeadings}>Time Taken</Text>
                            <Text style={styles.smallText}>{recipeDetails.readyInMinutes}</Text>
                        </View>
                        <View style={styles.rightComponent}>
                            <Text style={styles.smallHeadings}>Calories</Text>
                            <Text style={styles.smallText}>{recipeDetails.nutrition.nutrients[0].amount} kcal</Text>
                        </View>
                    </View>
                    {/* ingredients */}
                    <Text style={styles.customHeadings}>Ingredients:</Text>
                    {recipeIngredients ? (     //recipeIngredients !== null  check if recipeIngredients is not null
                        <View>
                            
                            {recipeIngredients.map((ingredient, index) => (
                                <Text key={index} style={styles.customText}>
                                    {ingredient.name} - {ingredient.amount.metric.value} {ingredient.amount.metric.unit}
                                </Text>
                            ))}
                        </View>
                    ) : (
                        <Text>Loading recipe ingredients...</Text>
                    )}
                    {/* instructions */}
                    <Text style={styles.customHeadings}>Instructions:</Text>
                    {recipeDetails.instructions ? (
                        <View>
                            
                            <Text style={styles.customText}>{recipeDetails.instructions}</Text>
                        </View>
                    ) : (
                        <Text style={styles.customText}>No instructions available. So just do it.</Text>
                    )}
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
        backgroundColor: "#FCFCD3",
        fontFamily: "Roboto",
    },
    //title
    title: {
        fontWeight: 'bold',
        fontSize: 24,
        margin: 10,
        textAlign: 'center',
    },
    //image
    imageContainer: {
        flex: 1,
        justifyContent: 'center',  // Center the image vertically
        alignItems: 'center',  // Center the image horizontally
    },
    image: {
        width: '100%',  // Occupy the entire width
        height: 300,  // Fixed height
    },
    //spoonocular score
    scoreRating: {
        flexDirection: 'row', // Arrange icon in a row
        justifyContent: 'center', // Center the icon
        alignItems: 'center', // Center vertically
        margin: 10,
    },
    //component
    componentContainer: {
        flexDirection: 'row', // Arrange components horizontally from left to right
        justifyContent: 'space-between', // Space them evenly
        alignItems: 'center', // Center them vertically
        paddingTop: 10,
        paddingBottom: 10,
    },
    leftComponent: {
        flex: 1, // Takes up 1/3 of the available space
        //backgroundColor: 'lightblue',
        paddingTop: 10,
        paddingBottom: 10,
    },
    middleComponent: {
        flex: 1, // Takes up 1/3 of the available space
        //backgroundColor: 'lightgreen',
        paddingTop: 10,
        paddingBottom: 10,
    },
    rightComponent: {
        flex: 1, // Takes up 1/3 of the available space
        //backgroundColor: 'lightyellow',
        paddingTop: 10,
        paddingBottom: 10,
    },
    //headers
    customHeadings:{
        fontWeight: 'bold',
        fontSize: 20,
        margin: 10,

    },
    smallHeadings:{
        fontSize: 12,
        textAlign: 'center',
        //margin: 10,
    },
    //text
    customText:{
        fontSize: 16,
        textAlign: 'left',
        margin: 10,
    },
    smallText:{
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
  });