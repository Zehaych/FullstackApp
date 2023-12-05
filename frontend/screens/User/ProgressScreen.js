import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button } from "react-native-paper";
import { Context } from "../../store/context";
//import { ScrollView } from 'react-native-virtualized-view';
import {
  fetchRecipes,
  fetchRecipeDetails,
  fetchRecommendations,
} from "../../assets/Api";
import { useNavigation } from "@react-navigation/native";
//import { set } from "mongoose";
//import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//import MealScreen from "./MealScreen";
//import CaloriesScreen from './CaloriesScreen';  // may be implement sth like tab screen where u can switch between
//import NutrientScreen from './NutrientScreen';  // calories and nutrients and meal and show in piechart or graph or sth else

const ProgressScreen = () => {
  const [search, setSearch] = useState("");
  const [memberRecipes, setMemberRecipes] = useState([]);
  const [onlineRecipes, setOnlineRecipes] = useState([]);
  const [selectedDropdownValue, setSelectedDropdownValue] = useState("All");
  const [breakfastRecipe, setBreakfastRecipe] = useState(null);
  const [lunchRecipe, setLunchRecipe] = useState(null);
  const [dinnerRecipe, setDinnerRecipe] = useState(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null); //sparate for online and member recipe if not work
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useContext(Context);

  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  // const targetCalories = 2000; // Set your desired target calories here
  const [users, setUsers] = useState([]); // State to store the list of users

  const targetCalories = currentUser.calorie;
  // const API_KEY = "0a379b4c97a648aeb0051120265dcfca";

  const allergies = currentUser.allergies;

  // const handleGenerateRecommendations = () => {
  //   // Call the Spoonacular API to generate daily meal recommendations
  //   fetch(
  //     `https://api.spoonacular.com/mealplanner/generate?apiKey=${API_KEY}&timeFrame=day&targetCalories=${targetCalories}`
  //   )
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       // Extract the recommended recipes from the response
  //       const recommendations = data.meals.map((meal) => meal.title);
  //       setRecommendedRecipes(recommendations);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching meal recommendations:", error);
  //       setRecommendedRecipes([]);
  //     });
  // };

  // nav for recommandation
  const navigation = useNavigation();

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/user/getUserTypes?userType=user&_id=${currentUser._id}`
      );
      const data = await response.json();
      setUsers([data]); // Set the data as an array, as you're only fetching one user
    } catch (error) {
      console.error("Failed to fetch current user:", error);
    }
  };
  
  useEffect(() => {
    fetchCurrentUser();
  }, [currentUser]);

  const handleRecipeDetails = (recipeId) => {
    // Navigate to OnlineRecipeInfoScreen with the recipe details
    navigation.navigate("Online Recipe Information", { recipeId });
  };

  const handleGenerateRecommendations = () => {
    // Call the new function to fetch meal recommendations
    fetchRecommendations(targetCalories, allergies)
      .then((data) => {
        console.log("Recommendations data:", data);
        // const recommendations = data.meals.map((meal) => meal.title);
        // const totalCalories = data.nutrients.calories;
        // console.log("meals:", recommendations);
        // console.log("Total calories:", totalCalories);
        setRecommendedRecipes(data);
      })
      .catch((error) => {
        console.error("Error fetching meal recommendations:", error);
        setRecommendedRecipes([]);
      });
  };

  //member recipe data
  useEffect(() => {
    const url = `${process.env.EXPO_PUBLIC_IP}/recipe`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => setMemberRecipes(json))
      .catch((error) => console.log(error));
    //.finally(() => setLoading(false));
  }, []);

  // //online recipe data
  // useEffect(() => {
  //   if (search) {
  //     setLoading(true);

  //     // Call the fetchRecipes function from api.js
  //     fetchRecipes(search)
  //       .then((data) => setOnlineRecipes(data))
  //       .catch((error) => console.error("Error fetching recipes:", error))
  //       .finally(() => setLoading(false));
  //   }
  // }, [search]);

  // online recipe data
  useEffect(() => {
    if (search) {
      setLoading(true);

      // Call the fetchRecipes function from api.js with allergies
      fetchRecipes(search, allergies)
        .then((data) => {
          setOnlineRecipes(data);
        })
        .catch((error) => console.error("Error fetching recipes:", error))
        .finally(() => setLoading(false));
    }
  }, [search, allergies]);

  // handle breakfast meal dropdown
  const handleBreakfastSelect = (recipeId) => {
    setBreakfastRecipe(recipeId);
    setSearch("");
    setOnlineRecipes([]);
    setRecipeDetails(null);
    setSelectedRecipeId(null);
  };

  // handle lunch meal dropdown
  const handleLunchSelect = (recipeId) => {
    setLunchRecipe(recipeId);
    setSearch("");
    setOnlineRecipes([]);
    setRecipeDetails(null);
    setSelectedRecipeId(null);
  };

  // handle dinner meal dropdown
  const handleDinnerSelect = (recipeId) => {
    setDinnerRecipe(recipeId);
    setSearch("");
    setOnlineRecipes([]);
    setRecipeDetails(null);
    setSelectedRecipeId(null);
  };

  //handle search data
  const handleSearch = (text) => {
    setSearch(text);
    if (!text) {
      setOnlineRecipes([]); // Clear the recipes list
    }
  };
  // //handle search data
  // const handleSearch = (text) => {
  //   // Check if the search query matches any restricted food items
  //   if (foodRestrictions.includes(text)) {
  //     // Optionally, show an error message or handle the case differently
  //     console.error("This food item is restricted:", text);
  //     alert("This food item is restricted as per your medical history:", text);
  //     return;
  //   }

  //   setSearch(text);
  //   if (!text) {
  //     setOnlineRecipes([]); // Clear the recipes list
  //   }
  // };

  //handle item click
  const handleItemClick = (recipeId) => {
    setSelectedRecipeId(recipeId);
  };

  useEffect(() => {
    if (selectedRecipeId) {
      fetchRecipeDetails(selectedRecipeId)
        .then((data) => {
          console.log(
            "Recipe details data:",
            data.title,
            data.nutrition.nutrients[0].amount
          );
          setRecipeDetails(data);
          if (selectedDropdownValue === "bf") {
            setBreakfastRecipe(data);
          } else if (selectedDropdownValue === "lunch") {
            setLunchRecipe(data);
          } else if (selectedDropdownValue === "din") {
            setDinnerRecipe(data);
          }
        })
        .catch((error) =>
          console.error("Error fetching recipe details:", error)
        );
    }
  }, [selectedRecipeId, selectedDropdownValue]);

  //handle add member recipe through dropdown
  const handleSelectMemberRecipe = (recipeId) => {
    const selectedRecipe = memberRecipes.find(
      (recipe) => recipe._id === recipeId
    );
    setSelectedRecipeId(selectedRecipe);

    if (selectedDropdownValue === "bf") {
      setBreakfastRecipe(selectedRecipe);
    } else if (selectedDropdownValue === "lunch") {
      setLunchRecipe(selectedRecipe);
    } else if (selectedDropdownValue === "din") {
      setDinnerRecipe(selectedRecipe);
    }
  };

  // for rendering meal recipe
  const renderMealRecipe = (mealRecipe) => {
    if (mealRecipe) {
      let name, calories;
      if (mealRecipe.name) {
        //member recipe
        name = mealRecipe.name;
        calories = mealRecipe.calories;
      } else {
        //online recipe
        name = mealRecipe.title;
        calories = mealRecipe.nutrition.nutrients[0].amount;
      }
      return (
        <View style={styles.mealRecipe}>
          <Text style={styles.mealDetails}>{name}</Text>
          <Text style={styles.mealDetails}>{calories} kcal</Text>
        </View>
      );
    }
    return (
      <Text style={styles.emptyMealRecipe}>
        No recipe selected for this meal
      </Text>
    );
  };

  const handleTotalCalories = () => {
    let totalCalories = 0;
    // breakfast calories
    if (breakfastRecipe) {
      if (breakfastRecipe.calories) {
        // 4 member recipe
        totalCalories += breakfastRecipe.calories;
      } else if (
        breakfastRecipe.nutrition &&
        breakfastRecipe.nutrition.nutrients[0].amount
      ) {
        // 4 online recipe
        totalCalories += breakfastRecipe.nutrition.nutrients[0].amount;
      }
    }
    // lunch calories
    if (lunchRecipe) {
      if (lunchRecipe.calories) {
        // 4 member recipe
        totalCalories += lunchRecipe.calories;
      } else if (
        lunchRecipe.nutrition &&
        lunchRecipe.nutrition.nutrients[0].amount
      ) {
        // 4 online recipe
        totalCalories += lunchRecipe.nutrition.nutrients[0].amount;
      }
    }
    // dinner calories
    if (dinnerRecipe) {
      if (dinnerRecipe.calories) {
        // 4 member recipe
        totalCalories += dinnerRecipe.calories;
      } else if (
        dinnerRecipe.nutrition &&
        dinnerRecipe.nutrition.nutrients[0].amount
      ) {
        // 4 online recipe
        totalCalories += dinnerRecipe.nutrition.nutrients[0].amount;
      }
    }
    return totalCalories;
  };

  const handleObjectiveIcon = () => {
    const totalCalories = handleTotalCalories();
    if (totalCalories === targetCalories) {
      return (
        <Icon name="thumbs-up" size={20} color="green" style={styles.iconObj} />
      );
    } else if (totalCalories < targetCalories && totalCalories > 0) {
      return (
        <Icon
          name="thumbs-o-up"
          size={20}
          color="green"
          style={styles.iconObj}
        />
      );
    } else if (totalCalories > targetCalories) {
      return (
        <Icon name="thumbs-down" size={20} color="red" style={styles.iconObj} />
      );
    }
    return null; // Return null if no condition is met
  };

  // handle reset
  const handleReset = () => {
    setSelectedDropdownValue("none");
    setBreakfastRecipe(null);
    setLunchRecipe(null);
    setDinnerRecipe(null);
    setSearch("");
    setOnlineRecipes([]);
    setSelectedRecipeId(null);
    setRecipeDetails(null);
  };

  //handle submit
  const handleSubmit = async () => {
    try {
      const totalCalories = handleTotalCalories();
      console.log("Total Calories: ", totalCalories);
      console.log(currentUser._id);
      const url = `${process.env.EXPO_PUBLIC_IP}/user/postCalories/${currentUser._id}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          total_calories: totalCalories,
        }),
      });

      const responseData = await response.text();
      console.log(currentUser);
      console.log(responseData);
      if (response.ok && responseData === "Updated successfully") {
        Alert.alert("Calories updated!");
      } else {
        Alert.alert("Failed to update calories.");
      }
    } catch (error) {
      Alert.alert("An error occurred: " + error.message);
    }
  };

  const handleSummary = () => {
    const user = users[0];
    navigation.navigate("TabDWMScreen", { user });
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <SafeAreaView style={styles.container}>   
          {/* dropdown to choose meal */}
          <View style={styles.pickerContainer}>
            <Text style={styles.mealSelector}>Choose meal to add</Text>
            <Picker
              selectedValue={selectedDropdownValue}
              onValueChange={(itemValue) => {
                setSelectedDropdownValue(itemValue);
                if (itemValue === "bf") {
                  handleBreakfastSelect(null); // Reset breakfast
                } else if (itemValue === "lunch") {
                  handleLunchSelect(null); // Reset lunch
                } else if (itemValue === "din") {
                  handleDinnerSelect(null); // Reset dinner
                }
              }}
              style={styles.dropdown}
            >
              <Picker.Item label="Select a meal" value="none" />
              <Picker.Item label="Breakfast" value="bf" />
              <Picker.Item label="Lunch" value="lunch" />
              <Picker.Item label="Dinner" value="din" />
            </Picker>
          </View>

          {/* search for member recipe */}
          <Text style={styles.subTitle}>Available member recipes</Text>
          <Picker
            selectedValue={setSelectedRecipeId ? setSelectedRecipeId._id : null}
            onValueChange={(itemValue) => handleSelectMemberRecipe(itemValue)}
            style={styles.dropdown}
          >
            <Picker.Item label="Select a recipe" value={null} />
            {memberRecipes.map((recipe) => (
              <Picker.Item
                key={recipe._id}
                label={recipe.name}
                value={recipe._id}
              />
            ))}
          </Picker>

          {/* search for online recipe */}
          <Text style={styles.subTitle}>Available online recipes</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for online recipe"
              value={search}
              onChangeText={(text) => handleSearch(text)}
            />
          </View>

          {/* list of recipes */}
          <View style={styles.searchList}>
            {loading ? (
              <Text>Loading...</Text>
            ) : (
              <ScrollView>
                {onlineRecipes.map((item) => (
                  <TouchableOpacity
                    key={item.id.toString()}
                    onPress={() => handleItemClick(item.id)}
                  >
                    <Text>{item.title}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* meal recipe recommandation*/}
          {recommendedRecipes.meals && recommendedRecipes.meals.length > 0 && (
            <View style={styles.recommendedRecipesContainer}>
              <Text style={styles.subTitle}>
                Recommended Recipes for the Day:
              </Text>
              {recommendedRecipes.meals.map((recipe, index) => (
                <Text
                  key={index}
                  onPress={() => handleRecipeDetails(recipe.id)}
                  style={styles.recommendationsText}
                >
                  {recipe.title}
                </Text>
              ))}
            </View>
          )}
          <Button
            onPress={handleGenerateRecommendations}
            style={styles.resetButton}
          >
            Generate Daily Recommendations
          </Button>

          {/* set Recipe for 3 meals */}
          <View style={styles.componentContainer}>
            <View style={styles.leftComponent}>
              <Text style={styles.subTitle}>Breakfast</Text>
              {renderMealRecipe(breakfastRecipe)}
            </View>
            <View style={styles.middleComponent}>
              <Text style={styles.subTitle}>Lunch</Text>
              {renderMealRecipe(lunchRecipe)}
            </View>
            <View style={styles.rightComponent}>
              <Text style={styles.subTitle}>Dinner</Text>
              {renderMealRecipe(dinnerRecipe)}
            </View>
          </View>

          {/* total calories */}
          <View style={styles.componentContainer}>
            <View style={styles.leftComponent}>
              <Text style={styles.smallHeadings}>Total Calories</Text>
              <Text style={styles.smallText}>{handleTotalCalories()} kcal</Text>
            </View>
            <View style={styles.middleComponent}>
              <Text style={styles.smallHeadings}>Target Calories</Text>
              <Text style={styles.smallText}>{targetCalories}</Text>
            </View>
            <View style={styles.rightComponent}>
              <Text style={styles.smallHeadings}>Objective</Text>
              {handleObjectiveIcon()}
            </View>
          </View>
          <View style={styles.componentContainer}>
            <View style={styles.leftComponent}>
              <Button onPress={() => handleReset()} style={styles.resetButton}>
                Reset
              </Button>
            </View>
            <View style={styles.rightComponent}>
              <Button onPress={() => handleSubmit()} style={styles.submitButton}>
                Submit
              </Button>
            </View>
          </View>
          <TouchableOpacity>
            <Button onPress={handleSummary} style={styles.submitButton}>
              View Summary
            </Button>
          </TouchableOpacity>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </ScrollView>  
  );
};

export default ProgressScreen;

const styles = StyleSheet.create({
  //containers
  scrollContainer: {
    flex: 1,
    backgroundColor: "#FCFCD3",
  },
  container: {
    flex: 1,
    backgroundColor: "#FCFCD3",
    alignItems: "center",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropdown: {
    width: 200,
    borderWidth: 1,
    borderColor: "gray",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "gray",
    width: 200,
    margin: 10,
    padding: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  //search result
  searchList: {
    width: 385,
    padding: 10,
    margin: 5,
  },
  //text
  mealDetails: {
    fontSize: 15,
    textAlign: "center",
  },
  mealSelector: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  smallHeadings: {
    fontSize: 13,
    textAlign: "center",
  },
  smallText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  //recommanded recipe
  recommendedRecipesContainer: {
    width: 385,
    padding: 5,
    margin: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    textAlign: "center",
  },
  recommendationsText: {
    fontSize: 16,
    textDecorationLine: "underline",
    textAlign: "center",
  },
  //component
  componentContainer: {
    flexDirection: "row", // Arrange components horizontally from left to right
    justifyContent: "space-between", // Space them evenly
    alignItems: "center", // Center them vertically
    paddingTop: 5,
    paddingBottom: 5,
    margin: 5,
  },
  leftComponent: {
    flex: 1, // Takes up 1/3 of the available space
    paddingTop: 10,
    paddingBottom: 10,
  },
  middleComponent: {
    flex: 1, // Takes up 1/3 of the available space
    paddingTop: 10,
    paddingBottom: 10,
  },
  rightComponent: {
    flex: 1, // Takes up 1/3 of the available space
    paddingTop: 10,
    paddingBottom: 10,
  },
  iconObj: {
    textAlign: "center",
  },
  //buttons
  submitButton: {
    backgroundColor: "lightgreen",
    margin: 5,
    borderRadius: 10,
  },
  resetButton: {
    backgroundColor: "lightblue",
    margin: 5,
    borderRadius: 10,
  },
});

/*
<Text onPress={() => handleRecipeDetails(recommendedRecipes[0].id)} style={styles.recommendationsText}>{recommendedRecipes[0]}</Text>
            <Text onPress={() => handleRecipeDetails(recommendedRecipes[1].id)} style={styles.recommendationsText}>{recommendedRecipes[1]}</Text>
            <Text onPress={() => handleRecipeDetails(recommendedRecipes[2].id)} style={styles.recommendationsText}>{recommendedRecipes[2]}</Text>
        <Picker
          selectedValue={selectedDropdownValue}
          onValueChange={(itemValue, itemIndex) => setSelectedDropdownValue(itemValue)}
          style={styles.dropdown}
        > 

        <TouchableOpacity style={styles.addButton} onPress={() => handleAddRecipe()}>
          <Icon name="plus" size={20} color="white" />
        </TouchableOpacity>
{recipes.map((recipe) => (
        <TouchableOpacity
          key={recipe._id}
          style={styles.recipeItem}
          onPress={() => handleAddRecipe(recipe)}
        >
          <Text>{recipe.name}</Text>
          <Text>Calories: {recipe.calories} kcal</Text>
        </TouchableOpacity>
      ))}


        <TouchableOpacity style={styles.addButton} onPress={() => handleAddRecipe()}>
          <Icon name="plus" size={20} color="white" />
        </TouchableOpacity>


 // Filter recipes based on the search text
  //const filteredRecipes = [...memberRecipes, ...onlineRecipes].filter((recipe) =>
    //recipe.name.toLowerCase().includes(searchText.toLowerCase() )
  //);

        <Picker
          selectedValue={selectedDropdownValue}
          onValueChange={(itemValue, itemIndex) => setSelectedDropdownValue(itemValue)}
          style={styles.dropdown}
        >
          <Picker.Item label="Online Recipe" value="onlineRep" />
          <Picker.Item label="Member Recipe" value="memberRep" />
        </Picker> 

<Text key={index} onPress={() => handleRecipeDetails(recipe.id)} style={styles.recommendationsText}>{recipe.title}</Text>
{recommendedRecipes.map((recipe, index) => (
              <Text key={index} style={styles.recommendationsText}>{recipe.title}</Text>
            ))}

<FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text
            onPress={() => setSelectedRecipe(item)}
            style={styles.recipeItem}
          >
            {item.name}
          </Text>
        )}
      />
      {selectedRecipe && (
        <View>
          <Text>Selected Recipe:</Text>
          <Text>{selectedRecipe.name}</Text>
        </View>
      )}

//tab nav 
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Calories" component={CaloriesScreen} />
      <Tab.Screen name="Nutrient" component={NutrientScreen} />
      <Tab.Screen name="Meal" component={MealScreen} />
    </Tab.Navigator>
  );
}

export default TabNavigator;
*/
