import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { Context } from "../../store/context";
//import { ScrollView } from 'react-native-virtualized-view';
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from 'react-native-picker-select';
import {
  fetchRecipeDetails,
  fetchRecipes,
  fetchRecommendations,
} from "../../services/Api";

//import { set } from "mongoose";
//import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//import MealScreen from "./MealScreen";
//import CaloriesScreen from './CaloriesScreen';  // may be implement sth like tab screen where u can switch between
//import NutrientScreen from './NutrientScreen';  // calories and nutrients and meal and show in piechart or graph or sth else

const ProgressScreen = () => {
  const [search, setSearch] = useState("");
  const [memberRecipes, setMemberRecipes] = useState([]);
  const [onlineRecipes, setOnlineRecipes] = useState([]);
  const [foodAndDrinks, setFoodAndDrinks] = useState([]);
  const [selectedDropdownValue, setSelectedDropdownValue] = useState("All");
  const [breakfastRecipe, setBreakfastRecipe] = useState(null);
  const [lunchRecipe, setLunchRecipe] = useState(null);
  const [dinnerRecipe, setDinnerRecipe] = useState(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null); //sparate for online and member recipe if not work
  const [selectedFoodAndDrink, setSelectedFoodAndDrink] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useContext(Context);

  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  // const targetCalories = 2000; // Set your desired target calories here
  const [users, setUsers] = useState([]); // State to store the list of users

  const targetCalories = currentUser.calorie;
  // const API_KEY = "0a379b4c97a648aeb0051120265dcfca";

  const allergies = currentUser.allergies;
  const foodRestrictions = currentUser.foodRestrictions;

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

  const handleRecipeDetails = (recipeId) => {
    // Navigate to OnlineRecipeInfoScreen with the recipe details
    navigation.navigate("Online Recipe Information", { recipeId });
  };

  const handleGenerateRecommendations = () => {
    // Call the new function to fetch meal recommendations
    fetchRecommendations(targetCalories, foodRestrictions)
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

  //food and drinks data
  useEffect(() => {
    const url = `${process.env.EXPO_PUBLIC_IP}/foodanddrinks/getFoodAndDrinks`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => setFoodAndDrinks(json))
      .catch((error) => console.log(error));
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

      // Call the fetchRecipes function from api.js with foodRestrictions
      fetchRecipes(search, foodRestrictions)
        .then((data) => {
          setOnlineRecipes(data);
        })
        .catch((error) => console.error("Error fetching recipes:", error))
        .finally(() => setLoading(false));
    }
  }, [search, foodRestrictions]);

  // handle breakfast meal dropdown
  const handleBreakfastSelect = (recipeId) => {
    setBreakfastRecipe(recipeId);
    setSearch("");
    setOnlineRecipes([]);
    setRecipeDetails(null);
    setSelectedRecipeId(null);
    setSelectedFoodAndDrink(null);
  };

  // handle lunch meal dropdown
  const handleLunchSelect = (recipeId) => {
    setLunchRecipe(recipeId);
    setSearch("");
    setOnlineRecipes([]);
    setRecipeDetails(null);
    setSelectedRecipeId(null);
    setSelectedFoodAndDrink(null);
  };

  // handle dinner meal dropdown
  const handleDinnerSelect = (recipeId) => {
    setDinnerRecipe(recipeId);
    setSearch("");
    setOnlineRecipes([]);
    setRecipeDetails(null);
    setSelectedRecipeId(null);
    setSelectedFoodAndDrink(null);
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

  const handleFoodAndDrinks = (recipeId) => {
    const selectedFoodAndDrink = foodAndDrinks.find(
      (recipe) => recipe._id === recipeId
    );
    setSelectedFoodAndDrink(selectedFoodAndDrink);

    if (selectedDropdownValue === "bf") {
      setBreakfastRecipe(selectedFoodAndDrink);
    } else if (selectedDropdownValue === "lunch") {
      setLunchRecipe(selectedFoodAndDrink);
    } else if (selectedDropdownValue === "din") {
      setDinnerRecipe(selectedFoodAndDrink);
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
        No recipe selected
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
    return totalCalories.toFixed(2);
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
    setSelectedFoodAndDrink(null);
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

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/user/getUserTypes?userType=user&_id=${users._id}`
      );
      const data = await response.json();
      setUsers([data]);
      return data;
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      throw error;
    }
  };

  const handleSummary = async () => {
    try {
      const userData = await fetchCurrentUser();
      navigation.navigate("TabDWMScreen", { user: userData });
    } catch (error) {
      console.error("Error fetching current user data:", error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <ScrollView style={styles.scrollContainer}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <SafeAreaView style={styles.container}>
          {/* Today's Meals */}
          <View style={styles.componentContainer}>
            <Text style={styles.subTitle}>Today's Meal</Text>
            <View style={styles.componentRow}>
              <Text style={[styles.smallHeadings, styles.boldText]}>Breakfast</Text>
              {renderMealRecipe(breakfastRecipe)}
            </View>
            <View style={styles.componentRow}>
              <Text style={[styles.smallHeadings, styles.boldText]}>Lunch</Text>
              {renderMealRecipe(lunchRecipe)}
            </View>
            <View style={styles.componentRow}>
              <Text style={[styles.smallHeadings, styles.boldText]}>Dinner</Text>
              {renderMealRecipe(dinnerRecipe)}
            </View>
            {/* meal recipe recommendation*/}
            {recommendedRecipes.meals && recommendedRecipes.meals.length > 0 && (
              <View style={styles.componentContainer}>
                <Text style={styles.subTitle}>
                  Recommended Recipes:
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
            <View style={styles.componentRow}>
              <Button
                onPress={handleGenerateRecommendations}
                style={styles.submitButton}
              >
                <Text style={styles.buttonText}>Generate Daily Recommendation</Text>
              </Button>
            </View>
          </View>


          {/* dropdown to choose meal */}
          <View style={styles.componentContainer}>
            <Text style={styles.subTitle}>Choose meal to add</Text>
            <RNPickerSelect
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
              items={[
                { label: "Breakfast", value: "bf" },
                { label: "Lunch", value: "lunch" },
                { label: "Dinner", value: "din" },
              ]}
              style={{
                inputIOS: { height: 50, width: "100%", paddingHorizontal: 16, fontSize: 16, borderWidth: 1, borderColor: "#C6C6CD", borderRadius: 4 },
                inputAndroid: { height: 50, width: "100%", paddingHorizontal: 16, fontSize: 16, borderWidth: 1, borderColor: "#C6C6CD", borderRadius: 4 },
                placeholder: { color: '#676767', fontSize: 16, },
                iconContainer: {
                  top: 15, right: 18
                },
              }}
              value={selectedDropdownValue}
              placeholder={{ label: "Select a meal", value: null, color: '#808080' }}
              useNativeAndroidPickerStyle={false}
              Icon={() => {
                return <Icon name="sort-down" size={16} color="#676767" />;
              }}
            />
            <View style={styles.spacer}></View>
          </View>


          {/* search for member recipe */}
          <View style={styles.componentContainer}>
            <Text style={styles.subTitle}>Member Recipes</Text>
            <RNPickerSelect
              onValueChange={(itemValue) => handleSelectMemberRecipe(itemValue)}
              items={[
                ...memberRecipes.map((recipe) => ({
                  label: recipe.name,
                  value: recipe._id,
                })),
              ]}
              style={{
                inputIOS: { height: 50, width: "100%", paddingHorizontal: 16, fontSize: 16, borderWidth: 1, borderColor: "#C6C6CD", borderRadius: 4 },
                inputAndroid: { height: 50, width: "100%", paddingHorizontal: 16, fontSize: 16, borderWidth: 1, borderColor: "#C6C6CD", borderRadius: 4 },
                placeholder: { color: '#676767', fontSize: 16, },
                iconContainer: {
                  top: 15, right: 18
                },
              }}
              value={setSelectedRecipeId ? setSelectedRecipeId._id : null}
              placeholder={{ label: "Select a recipe", value: null, color: '#808080' }}
              useNativeAndroidPickerStyle={false}
              Icon={() => {
                return <Icon name="sort-down" size={16} color="#676767" />;
              }}

            />
            <View style={styles.spacer}></View>
          </View>


          <View style={styles.componentContainer}>
            <Text style={styles.subTitle}>Available Food & Drinks</Text>
            {/* <Picker
              style={styles.dropdown}

              selectedValue={
                setSelectedFoodAndDrink ? setSelectedFoodAndDrink._id : null
              }
              onValueChange={(itemValue) => handleFoodAndDrinks(itemValue)}
            >
              <Picker.Item label="Select food and drinks" value={null} />
              {foodAndDrinks.map((recipe) => (
                <Picker.Item
                  key={recipe._id}
                  label={recipe.name}
                  value={recipe._id}
                />
              ))}
            </Picker> */}
            <RNPickerSelect
              onValueChange={(itemValue) => handleFoodAndDrinks(itemValue)}
              items={[
                ...foodAndDrinks.map((recipe) => ({
                  label: recipe.name,
                  value: recipe._id,
                })),
              ]}
              style={{
                inputIOS: { height: 50, width: "100%", paddingHorizontal: 16, fontSize: 16, borderWidth: 1, borderColor: "#C6C6CD", borderRadius: 4 },
                inputAndroid: { height: 50, width: "100%", paddingHorizontal: 16, fontSize: 16, borderWidth: 1, borderColor: "#C6C6CD", borderRadius: 4 },
                placeholder: { color: '#676767', fontSize: 16, },
                iconContainer: {
                  top: 15, right: 18
                },
              }}
              value={setSelectedFoodAndDrink ? setSelectedFoodAndDrink._id : null}
              placeholder={{ label: "Select food and drinks", value: null, color: '#808080' }}
              useNativeAndroidPickerStyle={false}
              Icon={() => {
                return <Icon name="sort-down" size={16} color="#676767" />;
              }}

            />
            <View style={styles.spacer}></View>
          </View>


          {/* search for online recipe */}
          <View style={styles.componentContainer}>
            <Text style={styles.subTitle}>Available Online Recipes</Text>
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
                <Text style={styles.recipeTitle}>Loading...</Text>
              ) : (
                <ScrollView>
                  {onlineRecipes.map((item) => (
                    <TouchableOpacity
                      key={item.id.toString()}
                      onPress={() => handleItemClick(item.id)}
                    >
                      <Text style={styles.recipeTitle}>{item.title}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>


          {/* Calorie Intake */}
          <View style={styles.componentContainer}>
            <Text style={[styles.subTitle]}>Calorie Intake</Text>
            <View style={styles.componentRow}>
              <Text style={[styles.smallHeadings, styles.boldText]}>Total Calories</Text>
              <Text style={styles.smallHeadings}>{handleTotalCalories()} cal</Text>
            </View>
            <View style={styles.componentRow}>
              <Text style={[styles.smallHeadings, styles.boldText]}>Target Calories</Text>
              <Text style={styles.smallHeadings}>{targetCalories} cal</Text>
            </View>
            <View style={styles.componentRow}>
              <Text style={[styles.smallHeadings, styles.boldText]}>Objective</Text>
              {handleObjectiveIcon()}
            </View>
            {/* reset and submit button */}
            <View style={styles.componentRow}>
              <View style={styles.leftComponent}>              
                <TouchableOpacity 
                  onPress={() => handleReset()} 
                  style={styles.resetButton}
                >
                  <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.rightComponent}>
                <TouchableOpacity
                  onPress={() => handleSubmit()}
                  style={styles.submitButton2}
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* <TouchableOpacity>
            <Button onPress={handleSummary} style={styles.submitButton}>
              View Summary
            </Button>
          </TouchableOpacity> */}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default ProgressScreen;

const styles = StyleSheet.create({
  //containers
  scrollContainer: {
    //flex: 1,
    backgroundColor: "#F2F2F2",
  },
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    //alignItems: "center",
    padding: 20,
    //marginHorizontal: 5,
  },
  dropdown: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ED6F21",
    borderRadius: 16,
  },
  searchInput: {
    height: 50,
    width: "100%",
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#C6C6CD",
    borderRadius: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  //search result
  searchList: {
    width: 385,
    // padding: 10,
    margin: 5,
  },
  //text
  mealDetails: {
    fontSize: 16,
    textAlign: "right",
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    marginBottom: 5,
  },
  smallHeadings: {
    fontSize: 16,
    textAlign: "center",
  },
  smallText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  emptyMealRecipe: {
    fontSize: 16,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  boldText: {
    fontWeight: "bold",
  },
  //recommended recipe
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
  // componentContainer2: {
  //   display: "flex",
  //   width: "90%",
  //   padding: 16,
  //   flexDirection: "column",
  //   alignItems: "left",
  //   backgroundColor: "#FFF",
  //   borderRadius: 16,
  //   gap: 8,
  //   margin: 8,
  // },
  componentRow:{
    flexDirection: "row",
    // alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  leftComponent: {
    flex: 1, // Takes up 1/3 of the available space
    //alignContent: "flex-start",
    alignItems: "flex-start",
  },
  middleComponent: {
    flex: 1, // Takes up 1/3 of the available space
  },
  rightComponent: {
    flex: 1, // Takes up 1/3 of the available space
    //alignContent: "flex-end",
    alignItems: "flex-end",
  },
  // flexRowComponent: {
  //   display: "flex",
  //   paddingTop: 8,
  //   paddingBottom: 8,
  //   justifyContent: "space-between",
  //   alignItems: "centre",
  //   width: "100%",
  //   flexDirection: "row",
  //   gap: 16,
  // },
  // flexColumnComponent: {
  //   display: "flex",
  //   paddingTop: 8,
  //   paddingBottom: 8,
  //   justifyContent: "space-between",
  //   alignItems: "centre",
  //   width: "100%",
  //   flexDirection: "column",
  //   gap: 16,
  // },
  iconObj: {
    textAlign: "center",
  },
  //buttons
  submitButton: {
    backgroundColor: "#ED6F21",
    borderRadius: 10,
    width: "100%",
  },
  resetButton: {
    backgroundColor: "#A9A9A9",
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    width: "95%",
    alignItems: "center",
  },
  submitButton2: {
    backgroundColor: "#ED6F21",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    width: "95%",
    alignItems: "center",
  },
  recipeTitle: {
    marginLeft: 20,
  },
  spacer: {
    marginVertical: 5,
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
