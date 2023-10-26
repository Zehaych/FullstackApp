import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ScrollView} from "react-native";
import React, { useState,useEffect } from "react";
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from "react-native-paper";
import { fetchRecipes, fetchRecipeDetails } from "../assets/Api";
//import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//import MealScreen from "./MealScreen";
//import CaloriesScreen from './CaloriesScreen';  // may be implement sth like tab screen where u can switch between
//import NutrientScreen from './NutrientScreen';  // calories and nutrients and meal and show in piechart or graph or sth else

const ProgressScreen = () => {

  const [search, setSearch] = useState("");
  const [memberRecipes, setMemberRecipes] = useState([]);
  const [onlineRecipes, setOnlineRecipes] = useState([]);
  const [selectedDropdownValue, setSelectedDropdownValue] = useState('All');
  const [breakfastRecipe, setBreakfastRecipe] = useState(null);
  const [lunchRecipe, setLunchRecipe] = useState(null);
  const [dinnerRecipe, setDinnerRecipe] = useState(null);
  const [selectedMemberRecipe, setSelectedMemberRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

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
      .catch((error) => console.log(error))
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

  //handle search data
  const handleSearch = (text) => {
    setSearch(text);
    if (!text) {
      setOnlineRecipes([]); // Clear the recipes list
    }
  };

  //handle item click
  const handleItemClick = (recipeId) => {
    const selectedRecipe = onlineRecipes.find((recipe) => recipe.id === recipeId);

    if (!selectedRecipe) {
      return;
    }
  
    if (selectedDropdownValue === "bf") {
      setBreakfastRecipe(selectedRecipe);
    } else if (selectedDropdownValue === "lunch") {
      setLunchRecipe(selectedRecipe);
    } else if (selectedDropdownValue === "din") {
      setDinnerRecipe(selectedRecipe);
    }
  };
  

  //handle add member recipe through dropdown
  const handleSelectMemberRecipe = (recipeId) => {
    const selectedRecipe = memberRecipes.find((recipe) => recipe._id === recipeId);
    setSelectedMemberRecipe(selectedRecipe);

    if (selectedDropdownValue === "bf") {
      setBreakfastRecipe(selectedRecipe);
    } else if (selectedDropdownValue === "lunch") {
      setLunchRecipe(selectedRecipe);
    } else if (selectedDropdownValue === "din") {
      setDinnerRecipe(selectedRecipe);
    }
  };

  // handle calculate total calories
  const handleTotalCalories = () => {
    let totalCalories = 0;
    if (breakfastRecipe) {
      totalCalories += breakfastRecipe.calories;
    }
    if (lunchRecipe) {
      totalCalories += lunchRecipe.calories;
    }
    if (dinnerRecipe) {
      totalCalories += dinnerRecipe.calories;
    }
    return totalCalories;
  };

  // for rendering meal recipe
  const renderMealRecipe = (mealRecipe) => {
    if (mealRecipe) {
      return (
        <View style={styles.mealRecipe}>
          <Text style={styles.mealDetails}>{mealRecipe.name}</Text>
          <Text style={styles.mealDetails}>{mealRecipe.calories} kcal</Text>
        </View>
      );
    }
    return (
      <Text style={styles.emptyMealRecipe}>No recipe selected for this meal</Text>
    );
  };

  // handle reset
  const handleReset = () => {
    setBreakfastRecipe(null);
    setLunchRecipe(null);
    setDinnerRecipe(null);
  };

  return (
    <View style={styles.container}>
      {/* dropdown to choose meal */}
      <View style={styles.pickerContainer}>
        <Text style={styles.mealSelector}>Choose meal to add</Text>
        <Picker
          selectedValue={selectedDropdownValue}
          onValueChange={(itemValue, itemIndex) => setSelectedDropdownValue(itemValue)}
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
        selectedValue={selectedMemberRecipe ? selectedMemberRecipe._id : null}
        onValueChange={(itemValue) => handleSelectMemberRecipe(itemValue)}
        style={styles.dropdown}
      >
        <Picker.Item label="Select a recipe" value={null} />
        {memberRecipes.map((recipe) => (
          <Picker.Item key={recipe._id} label={recipe.name} value={recipe._id} />
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
        <TouchableOpacity style={styles.addButton} onPress={() => handleAddRecipe()}>
          <Icon name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* list of recipes */}
      <View style={styles.searchList}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleItemClick(item.id)}>
                <Text>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

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
          <Icon name="check-circle-o" size={20} color="green" style={styles.iconObj}/>
        </View>
      </View>
      <Button onPress={() => handleReset()} style={styles.resetButton}>Reset</Button>
    </View>
  );
};

export default ProgressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCD3',
    alignItems: 'center',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdown: {
    width: 200, 
    borderWidth: 1,
    borderColor: 'gray',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: 'gray',
    width: 200,
    margin: 10,
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    textAlign: 'center',
  },
  mealSelector: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  smallHeadings:{
    fontSize: 13,
    textAlign: 'center',
  },
  smallText:{
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  //component
  componentContainer: {
    flexDirection: 'row', // Arrange components horizontally from left to right
    justifyContent: 'space-between', // Space them evenly
    alignItems: 'center', // Center them vertically
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
  iconObj:{
    textAlign: 'center',
  },
  //buttons
  addButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  resetButton: {
    backgroundColor: 'lightblue',
    margin: 10,
    borderRadius: 10,
  },
});


/*
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
    //recipe.name.toLowerCase().includes(searchText.toLowerCase())
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