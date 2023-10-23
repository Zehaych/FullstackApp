import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from "react-native";
import React, { useState, useEffect } from "react";
import { fetchRecipes } from '../assets/Api';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const OnlineRecipeScreen = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  //const [medicalFilterEnabled, setMedicalFilterEnabled] = useState(false);
  //const [userAllergies, setUserAllergies] = useState([]); //retrieve allergies from user profile to filter recipes
  const navigation = useNavigation();
  

  //const userAllergies = ["dairy", "egg", "gluten", "grain", "peanut", "seafood", "sesame", "shellfish", "soy", "sulfite", "tree nut", "wheat"];
  //const userAllergies = []; //retrieve allergies from user profile to filter recipes

  
  
  useEffect(() => {
    if (search) {
      setLoading(true);

      // Call the fetchRecipes function from api.js
      fetchRecipes(search)
        .then((data) => setRecipes(data))
        .catch((error) => console.error('Error fetching recipes:', error))
        .finally(() => setLoading(false));
    }
  }, [search]);


  /*
  useEffect(() => {
    if (search) {
      setLoading(true);

      // Call the fetchRecipes function from api.js
      fetchRecipes(search)
        .then((data) => {    
          // Filter recipes if the medical filter is enabled
          const filteredRecipes = medicalFilterEnabled
            ? data.filter((recipe) => {
                // Check if any allergenic ingredient is in the recipe
                return !recipe.ingredients.some((ingredient) =>
                  userAllergies.includes(ingredient)
                );
              })
            : data;

          setRecipes(filteredRecipes);
        })
        .catch((error) => console.error('Error fetching recipes:', error))
        .finally(() => setLoading(false));
    }
  }, [search, medicalFilterEnabled, userAllergies]);

  */

  //handle search data
  const handleSearch = (text) => {
    setSearch(text);
    if (!text) {
      setRecipes([]); // Clear the recipes list
    }
  };

  //handle pressable data
  const handleItemClick = (recipeId) => {
    //console.log(recipeId);
    navigation.navigate('OnlineRecipeInfoScreen', { recipeId });
  };

  //handle random recipes @ home page and online recipe page
  const getRandomRecipes = (data, count) => {
    const shuffled = data.sort(() => 0.5 - Math.random()); // Shuffle array
    return shuffled.slice(0, count);                // Get sub-array of first n elements after shuffled
  };
  

  return (
    <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss();}}>
    <View style={styles.container}>
      {/* search bar */}
      <View style={styles.header}> 
        <TextInput
          placeholder="Search"
          style={styles.searchBar}
          value={search}
          onChangeText={(text) => handleSearch(text)}
        />
        <Text style={styles.recommandation}>Category</Text>
      </View>
      <View style={styles.listFlat}>
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
    </View>
    </TouchableWithoutFeedback>
  );
};

export default OnlineRecipeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCD3",
    alignItems: "center",
  },
  header: {

  },
  searchBar: {
    height: 50,
    width: 385,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  listFlat:{
    width: 385,
    padding: 10,
    margin: 10
  },
  recommandation: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 10,
  },
  
});


/*

//handle medical filter
  // const handleMedicalFilter = () => {
  //   setMedicalFilterEnabled((prev) => !prev);
  // };
  

<View style={styles.filterContainer}>
          <View style={styles.leftComponent}>
            <Text style={styles.toggleText}>Apply Medical Filter?  </Text>
          </View>
          <View style={styles.rightComponent}>
            <TouchableOpacity onPress={handleMedicalFilter} style={styles.toggleButton}>
              <Icon
                name={medicalFilterEnabled ? 'toggle-on' : 'toggle-off'}
                size={25}
                color={medicalFilterEnabled ? 'orange' : 'black'}
              />
            </TouchableOpacity>
          </View>
        </View>



        filterContainer: {
    flexDirection: 'row', // Arrange components horizontally from left to right
    justifyContent: 'space-between', // Space them evenly
    alignItems: 'center', // Center them vertically
    paddingTop: 5,
    paddingBottom: 5,
  },
  leftComponent: {
    flex: 1, 
    paddingTop: 5,
    paddingBottom: 5,
  },
  rightComponent: {
    flex: 1, 
    paddingTop: 5,
    paddingBottom: 5,
  },
  toggleText: {
    fontSize: 20,
    fontWeight: "bold",
    //textAlign: "center",
    paddingLeft: 10,
  },
  toggleButton: {
    alignItems: "flex-end",
    paddingRight: 10,
    borderRadius: 10,
  },
*/