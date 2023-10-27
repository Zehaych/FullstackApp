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
import { Context } from "../store/context";
import {
  fetchRecipes,
  fetchRecipeDetails,
  fetchRecommendations,
} from "../assets/Api";
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
  const targetCalories = 2000; // Set your desired target calories here
  const API_KEY = "0a379b4c97a648aeb0051120265dcfca";

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

  const handleGenerateRecommendations = () => {
    // Call the new function to fetch meal recommendations
    fetchRecommendations(targetCalories)
      .then((data) => {
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

  //online recipe data
  useEffect(() => {
    if (search) {
      setLoading(true);

      // Call the fetchRecipes function from api.js
      fetchRecipes(search)
        .then((data) => setOnlineRecipes(data))
        .catch((error) => console.error("Error fetching recipes:", error))
        .finally(() => setLoading(false));
    }
  }, [search]);

  // handle breakfast meal dropdown
  const handleBreakfastSelect = (recipeId) => {
    setBreakfastRecipe(recipeId);
    setSearch("");
    setOnlineRecipes([]);
  };

  // handle lunch meal dropdown
  const handleLunchSelect = (recipeId) => {
    setLunchRecipe(recipeId);
    setSearch("");
    setOnlineRecipes([]);
  };

  // handle dinner meal dropdown
  const handleDinnerSelect = (recipeId) => {
    setDinnerRecipe(recipeId);
    setSearch("");
    setOnlineRecipes([]);
  };

  //handle search data
  const handleSearch = (text) => {
    setSearch(text);
    if (!text) {
      setOnlineRecipes([]); // Clear the recipes list
    }
  };

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

  // handle reset
  const handleReset = () => {
    setSelectedDropdownValue("none");
    setBreakfastRecipe(null);
    setLunchRecipe(null);
    setDinnerRecipe(null);
    setSearch("");
    setOnlineRecipes([]);
  };

  //handle submit
  const handleSubmit = async () => {
    try {
      const totalCalories = handleTotalCalories();
      console.log ("Total Calories: ", totalCalories);
      console.log(currentUser._id);
      const url = `${process.env.EXPO_PUBLIC_IP}/user/postCalories/${currentUser._id}`;
      const response = await fetch( url, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          total_calories: totalCalories
        })
      });

      const responseData = await response.text();
      console.log(currentUser);
      console.log(responseData);
      if (response.ok && responseData === 'Updated successfully') {
          Alert.alert('Calories updated!');
      } else {
          Alert.alert('Failed to update calories.');
      }
    } catch (error) {
      Alert.alert('An error occurred: ' + error.message);
    }
  };

  return (
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
            <FlatList
              data={onlineRecipes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleItemClick(item.id)}>
                  <Text>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        {recommendedRecipes.length > 0 && (
          <View style={styles.recommendedRecipesContainer}>
            <Text style={styles.subTitle}>Recommended Recipes for the Day:</Text>
            {recommendedRecipes.map((recipe, index) => (
              <Text key={index}>{recipe}</Text>
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
            <Text style={styles.smallText}></Text>
          </View>
          <View style={styles.rightComponent}>
            <Text style={styles.smallHeadings}>Objective</Text>
            <Icon
              name="check-circle-o"
              size={20}
              color="green"
              style={styles.iconObj}
            />
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
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default ProgressScreen;

const styles = StyleSheet.create({
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
    margin: 10,
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
  //component
  componentContainer: {
    flexDirection: "row", // Arrange components horizontally from left to right
    justifyContent: "space-between", // Space them evenly
    alignItems: "center", // Center them vertically
    paddingTop: 10,
    paddingBottom: 10,
    margin: 10,
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
    margin: 10,
    borderRadius: 10,
  },
  resetButton: {
    backgroundColor: "lightblue",
    margin: 10,
    borderRadius: 10,
  },
});

/*
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
