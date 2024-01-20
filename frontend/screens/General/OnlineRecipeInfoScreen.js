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
import Icon2 from "react-native-vector-icons/FontAwesome5";
import { fetchRecipeDetails, fetchRecipeIngredients } from "../../services/Api";
import { Context } from "../../store/context";

const OnlineRecipeInfoScreen = ({ route }) => {
  const { recipeId } = route.params;
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [recipeIngredients, setRecipeIngredients] = useState(null);
  const [healthScore, setHealthScore] = useState(0);

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
        stars.push(<Icon key={i} name="star" size={20} color="#ED6F21" />);
      } else if (i === fullStar && halfStar >= 0.25) {
        stars.push(<Icon key={i} name="star-half-o" size={20} color="#ED6F21" />);
      } else {
        stars.push(<Icon key={i} name="star-o" size={20} color="#ED6F21" />);
      }
    }
    return stars;
  };
  const scoreRating = (score) => {
    const rating = Math.floor((score / 100) * 5);
    return rating;
  }


  return (
    <ScrollView>
      {recipeDetails ? (
        <View style={styles.container}>
          <View style={styles.info}>
            {/* image */}
            <View style={styles.imageContainer}>
              <Image source={{ uri: recipeDetails.image }} style={styles.image} />
            </View>
            {/* name */}
            <Text style={styles.title}>{recipeDetails.title}</Text>
            
            {/* spoonacular score */}
            <View style={styles.scoreRating}>
              <Text style={styles.smallHeadings}>
                {handleScoreRating(recipeDetails.healthScore)}
              </Text>
              <Text style={styles.smallRating}>
                {"  "}{scoreRating(recipeDetails.healthScore)}
              </Text>
            </View>

            
            {/* servings, time taken, calories */}
            <View style={styles.componentContainer}>
              <View style={styles.leftComponent}>
                <Icon name="users" size={20} color="#ED6F21" style={styles.icons}/>
                <Text style={styles.smallText}>{recipeDetails.servings}</Text>
                <Text style={styles.smallHeadings}>Servings</Text>
              </View>
              <View style={styles.middleComponent}>
                <Icon name="clock-o" size={20} color="#ED6F21" style={styles.icons}/>
                <Text style={styles.smallText}>
                  {recipeDetails.readyInMinutes}
                </Text>
                <Text style={styles.smallHeadings}>Time Taken</Text>
              </View>
              <View style={styles.rightComponent}>
                <Icon2 name="fire-alt" size={20} color="#ED6F21" style={styles.icons}/>
                <Text style={styles.smallText}>
                  {recipeDetails.nutrition.nutrients[0].amount} kcal
                </Text>
                <Text style={styles.smallHeadings}>Calories</Text>
              </View>
            </View>
          </View>
          {currentUser.foodRestrictions.length > 0 && (
            <View style={styles.disclaimerBox}>
              <Text style={styles.customHeadings}>Disclaimer: </Text>
              <Text style={styles.customText}>
                Based on your medical history, it is recommended to minimize
                or abstain from using{" "}
                <Text style={{ color: "#ED6F21", fontWeight: "bold" }}>
                  {currentUser.foodRestrictions.join(", ")}
                </Text>{" "}
                when preparing the recipe. {"\n"}
              </Text>
            </View>
          )}
            {/* ingredients */}
          <View style={styles.ingredientBox}>
            <Text style={styles.customHeadings}>Ingredients:</Text>

            {recipeDetails.extendedIngredients ? ( //recipeDetails.extendedIngredients !== null
              <View style={styles.inAlign}>
                {recipeDetails.extendedIngredients.map(
                  (ingredient, index) => (
                    <View key={index} style={styles.ingredientContainer}>
                      
                      <Text style={styles.ingredientText}>•</Text>
                      
                      <Text style={styles.customText}>
                        {ingredient.name} - {ingredient.amount}{" "}{ingredient.unit}
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
          <View style={styles.instructionsBox}>
            <Text style={styles.customHeadings}>Instructions:</Text>
            
            {recipeDetails.instructions ? (
              <View style={styles.inAlign}>
                
                <Text style={styles.customTextInstructions}>
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
    backgroundColor: "#F2F2F2",
    fontFamily: "Roboto",
    padding: 20,
  },
  //infoContainer
  info: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    //padding: 20,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3.84,
    shadowOpacity: 0.25,
    elevation: 5,
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
  // icons
  icons: {
    textAlign: "center",
    marginBottom:5
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
    alignContent: "center",
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
  customTextInstructions: {
    fontSize: 16,
    textAlign: "left",
    marginVertical: 10,
  },
  smallText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  smallRating: {
    fontSize: 16,
    color: "#ED6F21",
  },
  //ingredient
  ingredientContainer: {
    flexDirection: "row", // Arrange components horizontally from left to right
    // justifyContent: "space-between", // Space them evenly
    // alignItems: "center", // Center them vertically
    // paddingTop: 10,
    // paddingBottom: 10,
  },
  ingredientImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    borderRadius: 10,
  },
  disclaimerBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3.84,
    shadowOpacity: 0.25,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    paddingBottom: 10,
  },
  ingredientBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3.84,
    shadowOpacity: 0.25,
    elevation: 5,
  },
  instructionsBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3.84,
    shadowOpacity: 0.25,
    elevation: 5,
  },
  inAlign: {
    marginLeft: 10,
    marginRight: 10,
  },
  ingredientText: {
    fontSize: 30,
    color: "#FF9130",
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
