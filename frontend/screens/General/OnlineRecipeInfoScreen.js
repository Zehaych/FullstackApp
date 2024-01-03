import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { fetchRecipeDetails, fetchRecipeIngredients } from "../../services/Api";
import { Context } from "../../store/context";

const OnlineRecipeInfoScreen = ({ route }) => {
  const { recipeId } = route.params;
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [recipeIngredients, setRecipeIngredients] = useState(null);

  const [currentUser, setCurrentUser] = useContext(Context);

  useEffect(() => {
    // Fetch meal details by id
    fetchRecipeDetails(recipeId)
      .then((data) => {
        console.log("Recipe details data:", data);
        setRecipeDetails(data);
      })
      .catch((error) => console.error("Error fetching recipe details:", error));

    // Fetch recipe ingredients by id
    fetchRecipeIngredients(recipeId)
      .then((data) => setRecipeIngredients(data))
      .catch((error) => console.error("Error fetching recipe details:", error));
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
            <Image source={{ uri: recipeDetails.image }} style={styles.image} />
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
              <Text style={styles.smallText}>
                {recipeDetails.readyInMinutes}
              </Text>
            </View>
            <View style={styles.rightComponent}>
              <Text style={styles.smallHeadings}>Calories</Text>
              <Text style={styles.smallText}>
                {recipeDetails.nutrition.nutrients[0].amount} kcal
              </Text>
            </View>
          </View>
          <View style={styles.mainBox}>
            {currentUser.foodRestrictions.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.customHeadings}>Disclaimer: </Text>
                <Text style={styles.customText}>
                  Based on your medical history, it is recommended to minimize
                  or abstain from using{" "}
                  <Text style={{ color: "red", fontWeight: "bold" }}>
                    {currentUser.foodRestrictions.join(", ")}
                  </Text>{" "}
                  when preparing the recipe. {"\n"}
                </Text>
              </View>
            )}
            {/* ingredients */}
            <View style={styles.section}>
              <Text style={styles.customHeadings}>Ingredients:</Text>
              {recipeDetails.extendedIngredients ? ( //recipeDetails.extendedIngredients !== null
                <View>
                  {recipeDetails.extendedIngredients.map(
                    (ingredient, index) => (
                      <View key={index}>
                        <Text style={styles.customText}>
                          {ingredient.name} - {ingredient.amount}{" "}
                          {ingredient.unit}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              ) : (
                <Text>Loading recipe ingredients...</Text>
              )}
            </View>

            {/* instructions */}
            <Text style={styles.customHeadings}>Instructions:</Text>
            {recipeDetails.instructions ? (
              <View>
                <Text style={styles.customText}>
                  {recipeDetails.instructions}
                </Text>
              </View>
            ) : (
              <Text style={styles.customText}>
                No instructions available. So just do it.
              </Text>
            )}
          </View>
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
    padding: 20,
  },
  //title
  title: {
    fontWeight: "bold",
    fontSize: 24,
    margin: 10,
    textAlign: "center",
  },
  //image
  imageContainer: {
    flex: 1,
    justifyContent: "center", // Center the image vertically
    alignItems: "center", // Center the image horizontally
  },
  image: {
    width: "100%", // Occupy the entire width
    height: 300, // Fixed height
    borderRadius: 20,

    //resizeMode: "center",
  },

  // image: {
  //   flex: 1,
  //   width: 310,
  //   height: 310,
  //   resizeMode: "contain",
  //   borderRadius: 20,
  // },
  //spoonocular score
  scoreRating: {
    flexDirection: "row", // Arrange icon in a row
    justifyContent: "center", // Center the icon
    alignItems: "center", // Center vertically
    margin: 10,
  },
  //component
  componentContainer: {
    flexDirection: "row", // Arrange components horizontally from left to right
    justifyContent: "space-between", // Space them evenly
    alignItems: "center", // Center them vertically
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
  customHeadings: {
    fontWeight: "bold",
    fontSize: 20,
    margin: 10,
  },
  smallHeadings: {
    fontSize: 12,
    textAlign: "center",
    //margin: 10,
  },
  //text
  customText: {
    fontSize: 16,
    textAlign: "left",
    margin: 10,
  },
  smallText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  //ingredient
  ingredientContainer: {
    flexDirection: "row", // Arrange components horizontally from left to right
    justifyContent: "space-between", // Space them evenly
    alignItems: "center", // Center them vertically
    paddingTop: 10,
    paddingBottom: 10,
  },
  ingredientImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    borderRadius: 10,
  },
  mainBox: {
    borderWidth: 2,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    padding: 10,
    marginBottom: 30,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    paddingBottom: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    paddingBottom: 10,
  },
});

/*
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
                    



                    <View>
                        <Text style={styles.customText}>{recipeDetails.extendedIngredients}</Text>
                    </View>
*/
