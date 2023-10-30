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
import { fetchRecipes, fetchRecipeDetails } from "../assets/Api";
import { Context } from "../store/context";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

const OnlineRecipeScreen = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [randomRecipes, setRandomRecipes] = useState([]);
  const [currentUser, setCurrentUser] = useContext(Context);
  const navigation = useNavigation();

  // const [foodRestrictions, setFoodRestrictions] = useState([]);
  const foodRestrictions = currentUser.foodRestrictions;

  // useEffect(() => {
  //   if (search) {
  //     setLoading(true);

  //     // Call the fetchRecipes function from api.js
  //     fetchRecipes(search)
  //       .then((data) => {
  //         // Filter recipes based on user's medical history and allergies
  //         const filteredRecipes = data.filter((recipe) => {
  //               // Check if any allergenic ingredient is in the recipe
  //               return !recipe.ingredients.some((ingredient) =>
  //                 userAllergies.includes(ingredient)
  //               );
  //             });

  //         setRecipes(filteredRecipes);
  //       })
  //       .catch((error) => console.error('Error fetching recipes:', error))
  //       .finally(() => setLoading(false));
  //   }
  // }, [search, medicalFilterEnabled, userAllergies]);

  useEffect(() => {
    if (search) {
      setLoading(true);

      // Call the fetchRecipes function from api.js with food restrictions
      fetchRecipes(search, foodRestrictions)
        .then((data) => {
          setRecipes(data);
        })
        .catch((error) => console.error("Error fetching recipes:", error))
        .finally(() => setLoading(false));
    }
  }, [search, foodRestrictions]);

  // useEffect(() => {
  //   if (search) {
  //     setLoading(true);

  //     // Call the fetchRecipes function from api.js
  //     fetchRecipes(search)
  //       .then((data) => setRecipes(data))
  //       .catch((error) => console.error("Error fetching recipes:", error))
  //       .finally(() => setLoading(false));
  //   }
  // }, [search]);

  useEffect(() => {
    // Fetch random recipe details
    const randomRecipeIds = getRandomRecipeIds();
    const fetchRecipePromises = randomRecipeIds.map((recipeId) =>
      fetchRecipeDetails(recipeId)
    );

    Promise.all(fetchRecipePromises)
      .then((data) => {
        setRandomRecipes(data);
      })
      .catch((error) => console.error("Error fetching recipes:", error));
  }, []);

  function getRandomRecipeIds() {
    // Generate random recipe IDs (e.g., between 1 and 1000)
    const randomIds = [];
    while (randomIds.length < 10) {
      const randomId = Math.floor(Math.random() * 1000) + 1;
      if (!randomIds.includes(randomId)) {
        randomIds.push(randomId);
      }
    }
    return randomIds;
  }

  //handle search data
  const handleSearch = (text) => {
    // Check if the search query matches any restricted food items
    if (foodRestrictions.includes(text)) {
      // Optionally, show an error message or handle the case differently
      console.error("This food item is restricted:", text);
      alert("This food item is restricted as per your medical history:", text);
      return;
    }

    setSearch(text);
    if (!text) {
      setRecipes([]); // Clear the recipes list
    }
  };

  //  //handle search data
  //  const handleSearch = (text) => {
  //   setSearch(text);
  //   if (!text) {
  //     setRecipes([]); // Clear the recipes list
  //   }
  // };

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
        {/* random recipe */}
        {/*data={randomRecipes.slice(0, 20)}*/}
        <FlatList
          data={randomRecipes}
          horizontal={true}
          contentContainerStyle={styles.foodContainer}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.recipeMember}
              onPress={() => handleItemClick(item.id)}
            >
              <Image source={{ uri: item.image }} style={styles.recipeImage} />
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
  },
  header: {},
  searchBar: {
    height: 50,
    width: 385,
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

/*

//const [medicalFilterEnabled, setMedicalFilterEnabled] = useState(false);
  //const [userAllergies, setUserAllergies] = useState([]); //retrieve allergies from user profile to filter recipes

//handle medical filter
  // const handleMedicalFilter = () => {
  //   setMedicalFilterEnabled((prev) => !prev);
  // };


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



  <View style={styles.randomRecipes}>
        <FlatList
          data={getRandomRecipes(recipes, 20)} // Display 20 random recipes
          numColumns={2} // 2 columns
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleItemClick(item.id)}>
              <Text>{item.title}</Text>
            </TouchableOpacity>
            )}
        />
      </View>
*/
