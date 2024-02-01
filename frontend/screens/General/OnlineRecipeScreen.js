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
import { fetchWeeklyRecommendations, fetchRecipes } from "../../services/Api";

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
        {/* list of recipes for search*/}
        <View style={styles.listFlat}>
          {loading ? (
            <Text style={styles.recipeTitle}>Loading...</Text>
          ) : (
            <FlatList
              data={recipes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleItemClick(item.id)}>
                  <Text style={styles.recipeTitle}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
        
        <View style={styles.divider}></View>
        {/* featured section */}
        <Text style={styles.recommandation}>Featured Recommended Recipes</Text>

        <FlatList
          data={mealPlanRecipes}
          numColumns={2}
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
                style={styles.image}
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
    backgroundColor: "#F5F5F5",
    //alignItems: "center",
    padding: 5,
    marginHorizontal: 5,
  },
  header: {},
  searchBar: {
    height: 50,
    width: "100%", // 20 is the total horizontal margin (10 on each side)
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
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
    color: "#ED6F21",
  },
  featuredSection: {},
  foodContainer: {
    flexGrow: 1,
    //padding: 5,
    margin: 5,
  },
  recipeMember: {
    alignItems: "center",
    marginVertical: 5,
    paddingVertical: 5,
    paddingHorizontal: 18,
    width: "50%",
  },
  image: {
    width: 160,
    height: 175,
    resizeMode: "cover",
    borderRadius: 10,
  },
  recipeName: {
    marginTop: 10,
    width: "100%",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  // recipeName: {
  //   textAlign: "center",
  //   marginTop: 10,
  //   fontSize: 16,
  //   fontWeight: "bold",
  //   position: "absolute",
  //   bottom: 80,
  //   left: 10,
  //   right: 10,
  //   backgroundColor: "rgba(0, 0, 0, 0.5)",
  //   color: "white",
  //   padding: 5,
  //   borderRadius: 5,
  // },
  recipeTitle: {
    marginLeft: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#dddddd",
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 10,
    elevation: 5,
    backgroundColor: "white",
  },
});
