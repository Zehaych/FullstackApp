import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
//import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//import MealScreen from "./MealScreen";
//import CaloriesScreen from './CaloriesScreen';  // may be implement sth like tab screen where u can switch between
//import NutrientScreen from './NutrientScreen';  // calories and nutrients and meal and show in piechart or graph or sth else

const ProgressScreen = () => {

  const [searchText, setSearchText] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [selectedDropdownValue, setSelectedDropdownValue] = useState('All'); // Initial dropdown value

  // Filter recipes based on the search text
  //const filteredRecipes = [...memberRecipes, ...onlineRecipes].filter((recipe) =>
    //recipe.name.toLowerCase().includes(searchText.toLowerCase())
  //);

  return (
    <View style={styles.container}>

      {/* dropdown to choose meal */}
      <View style={styles.pickerContainer}>
        <Text style={styles.header}>Choose 3 meal</Text>
        <Picker
          selectedValue={selectedDropdownValue}
          onValueChange={(itemValue, itemIndex) => setSelectedDropdownValue(itemValue)}
          style={styles.dropdown}
        >
          <Picker.Item label="Breakfast" value="meal1" />
          <Picker.Item label="Lunch" value="meal2" />
          <Picker.Item label="Dinner" value="meal3" />
        </Picker>
      </View>

      {/* search for recipe */}
      {/* <Picker
          selectedValue={selectedDropdownValue}
          onValueChange={(itemValue, itemIndex) => setSelectedDropdownValue(itemValue)}
          style={styles.dropdown}
        >
          <Picker.Item label="Online Recipe" value="onlineRep" />
          <Picker.Item label="Member Recipe" value="memberRep" />
        </Picker> */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for member recipe"
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => handleAddRecipe()}>
          <Icon name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for online recipe"
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => handleAddRecipe()}>
          <Icon name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* set Recipe for 3 meals */}
      <Text style={styles.mealTitle}>Breakfast</Text>
      <Text style={styles.mealTitle}>Calories for breakfast</Text>
      <Text style={styles.mealTitle}>Lunch</Text>
      <Text style={styles.mealTitle}>Calories for lunch</Text>
      <Text style={styles.mealTitle}>Dinner</Text>
      <Text style={styles.mealTitle}>Calories for dinner</Text>

      <View style={styles.componentContainer}>
        <View style={styles.leftComponent}>
          <Text style={styles.smallHeadings}>Total Calories</Text>
          <Text style={styles.smallText}>  kcal</Text>
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
    </View>
  );
};

export default ProgressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdown: {
    width: 200, // Adjust the width as needed
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
  addButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  mealTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
  smallHeadings:{
    fontSize: 12,
    textAlign: 'center',
  },
  smallText:{
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  iconObj:{
    textAlign: 'center',
  },
});


/*
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