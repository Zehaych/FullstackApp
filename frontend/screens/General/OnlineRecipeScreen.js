import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { fetchWeeklyRecommendations, fetchRecipes } from "../../assets/Api";

import { Context } from "../../store/context";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { Dimensions } from "react-native";

// make the search bar responsive even for smaller devices
const screenWidth = Dimensions.get("window").width;

const OnlineRecipeScreen = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [randomRecipes, setRandomRecipes] = useState([]);
  const [mealPlanRecipes, setMealPlanRecipes] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [currentUser, setCurrentUser] = useContext(Context);
  const navigation = useNavigation();

  // const [foodRestrictions, setFoodRestrictions] = useState([]);
  const foodRestrictions = currentUser.foodRestrictions;

  const allergies = currentUser.allergies;

  useEffect(() => {
    if (search) {
      setLoading(true);

      // Call the fetchRecipes function from api.js with foodRestrictions
      fetchRecipes(search, foodRestrictions)
        .then((data) => {
          setRecipes(data);
        })
        .catch((error) => console.error("Error fetching recipes:", error))
        .finally(() => setLoading(false));
    }
  }, [search, foodRestrictions]);

  // Fetch meal plan recipes based on user's calorie target and foodRestrictions
  useEffect(() => {
    setLoading(true);

    fetchWeeklyRecommendations(foodRestrictions)
      .then((meals) => {
        setMealPlanRecipes(meals);
      })
      .catch((error) => {
        console.error("Error fetching meal plan recipes:", error);
      })
      .finally(() => setLoading(false));
  }, [currentUser]);

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
    navigation.navigate("Online Recipe Information", { recipeId });
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <SafeAreaView style={styles.container}>
        {/* search bar */}
        <View style={styles.header}>
          <TextInput
            placeholder="Search"
            style={styles.searchBar}
            value={search}
            onChangeText={(text) => handleSearch(text)}
          />
        </View>
        {/* list of recipes */}
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
        {/* featured section */}
        <Text style={styles.recommandation}>Featured Random Recipe</Text>

        <FlatList
          data={mealPlanRecipes}
          horizontal={true}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.recipeMember}
              onPress={() => handleItemClick(item.id)}
            >
              <Image
                source={{
                  uri: `https://spoonacular.com/recipeImages/${item.id}-312x231.${item.imageType}`,
                }}
                style={styles.recipeImage}
              />
              <Text style={styles.recipeName}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default OnlineRecipeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCD3",
    alignItems: "center",
    paddingBottom: 10,
  },
  header: {},
  searchBar: {
    height: 50,
    width: screenWidth - 20, // 20 is the total horizontal margin (10 on each side)
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  listFlat: {
    width: 385,
    padding: 10,
    margin: 10,
  },
  recommandation: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "orange",
  },
  featuredSection: {},
  foodContainer: {
    flexGrow: 1,
    //padding: 5,
    margin: 5,
  },
  recipeMember: {
    //width: 200,
    marginRight: 5,
    //marginLeft: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
  },
  recipeImage: {
    flex: 1,
    width: 360,
    height: 400,
    resizeMode: "contain",
    alignItems: "center",
    justifyContent: "center",
  },
  recipeName: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    position: "absolute",
    bottom: 80,
    left: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    padding: 5,
    borderRadius: 5,
  },
});
