import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from "react-native";
import React, { useState, useEffect } from "react";
import { fetchRecipesByName } from '../assets/Api';
import { useNavigation } from '@react-navigation/native';

const OnlineRecipeScreen = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const navigation = useNavigation();

  // Function to fetch meals by first letter
  const fetchRecipes = async (text) => {
    setLoading(true);
    try {
      const data = await fetchRecipesByName(text);
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search) {
      // Fetch meals by the first letter when search is a single letter
      fetchRecipes(search);
    } else {
      setRecipes([]); // Clear the meals list when search is empty or longer than one letter
    }
  }, [search]);

  //handle search data
  const handleSearch = (text) => {
    setSearch(text);
  };

  //handle pressable data
  const handleItemClick = (recipeId) => {
    //console.log(recipeId);
    navigation.navigate('OnlineRecipeInfoScreen', { recipeId });
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
            keyExtractor={(item) => item.idMeal.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleItemClick(item.idMeal)}>
                <Text>{item.strMeal}</Text>
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
    backgroundColor: "#fff",
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
    padding: 5,
    margin: 5
  }
});
