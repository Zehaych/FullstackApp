import React, { useEffect, useState, useContext } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import {
  TouchableRipple
} from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { fetchRandomRecipes } from "../../assets/Api";
import { Context } from "../../store/context";

const HomeScreen = ({ navigation }) => {

  const [randomRecipes, setRandomRecipes] = useState([]);
  const [currentUser, setCurrentUser] = useContext(Context);
  const [users, setUsers] = useState([]);

  const navigateToCommunityRecipes = () => {
    navigation.navigate("Community Recipes");
  };

  const navigateToUser = () => {
    navigation.navigate("User Profile");
  };

  const navigateToOnlineRecipes = () => {
    navigation.navigate("Online Recipes");
  };

  const navigateToFoodRecognitionScreen = () => {
    navigation.navigate("FoodRecognitionScreen")
  };

  const navigateToTrackProgressScreen = () => {
    navigation.navigate("Track Progress")
  };

  const navigateToAddRecipeScreen = () => {
    navigation.navigate("Add Recipe")
  };
  
  const navigateToSummaryScreen = async () => {
    try {
      const userData = await fetchCurrentUser();
      navigation.navigate("TabDWMScreen", { user: userData });
    } catch (error) {
      console.error("Error fetching current user data:", error);
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
    

  // useEffect(() => {
  //   // Fetch random recipes by generating random recipe IDs
  //   const randomRecipeIds = getRandomRecipeIds();
  //   const fetchRecipePromises = randomRecipeIds.map((recipeId) =>
  //     fetchRecipeDetails(recipeId)
  //   );

  //   Promise.all(fetchRecipePromises)
  //     .then((data) => {
  //       setRandomRecipes(data);
  //     })
  //     .catch((error) => console.error("Error fetching recipes:", error));
  // }, []);

  // function getRandomRecipeIds() {
  //   // Generate random recipe IDs (e.g., between 1 and 1000)
  //   const randomIds = [];
  //   while (randomIds.length < 2) {
  //     const randomId = Math.floor(Math.random() * 1000) + 1;
  //     if (!randomIds.includes(randomId)) {
  //       randomIds.push(randomId);
  //     }
  //   }
  //   return randomIds;
  // }

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipes = await fetchRandomRecipes(2);
        setRandomRecipes(recipes);
      } catch (error) {
        console.error('Error fetching random recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  const navigateToOnlineRecipesInfo = (recipeId) => {
    navigation.navigate("Online Recipe Information", { recipeId });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />

        <View style={styles.header}>
          <Text style={styles.headerText}>NutriRizz Recipe App</Text>
          <TouchableRipple onPress={navigateToFoodRecognitionScreen}>
            <View style={styles.menuItem}>
              <Icon name="scan-helper" color="#FF6347" size={25} />
            </View>
          </TouchableRipple>
        </View>
        <ImageBackground
          source={require("../../assets/recipe_image.png")}
          style={styles.bannerImage}
        >
          <View style={styles.overlay}>
            <Text style={styles.heyText}>Hello {currentUser.username}</Text>
          </View>
        </ImageBackground>

        <View style={styles.introSection}>
          <Text style={styles.introHeader}>Welcome to NutriRizz</Text>
          <View style={styles.introImages}>
            <View style={styles.introImage}>
              <TouchableOpacity style={styles.introButton} onPress={navigateToTrackProgressScreen}>
                <Image
                  source={require("../../assets/image3.png")}
                  style={styles.introImageImage}
                />
                <Text style={styles.introImageText}>Track Your Progress</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.introImage}>
              <TouchableOpacity style={styles.introButton} onPress={navigateToSummaryScreen}>
                <Image
                  source={require("../../assets/image1.png")}
                  style={styles.introImageImage}
                />
                <Text style={styles.introImageText}>View Your Intakes</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.introImage}>
              <TouchableOpacity style={styles.introButton} onPress={navigateToAddRecipeScreen}>
                <Image
                  source={require("../../assets/image2.png")}
                  style={styles.introImageImage}
                />
                <Text style={styles.introImageText}>Share Your Recipes</Text>
              </TouchableOpacity>
            </View>            
          </View>          
          <TouchableOpacity style={styles.startButton} onPress={navigateToUser}>
            <Text style={styles.startButtonText}>Start Now</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featuredSection}>
          <Text style={styles.sectionHeader}>Online Recipes</Text>
          {randomRecipes[0] && (
            <TouchableOpacity
              style={styles.featuredCard}
              onPress={() => navigateToOnlineRecipesInfo(randomRecipes[0].id)}
            >
              <Image
                source={{ uri: randomRecipes[0].image }}
                style={styles.featuredCardImage}
              />
              <Text style={styles.featuredCardTitle}>
                {randomRecipes[0].title}
              </Text>
            </TouchableOpacity>
          )}
          {randomRecipes[1] && (
            <TouchableOpacity
              style={styles.featuredCard}
              onPress={() => navigateToOnlineRecipesInfo(randomRecipes[1].id)}
            >
              <Image
                source={{ uri: randomRecipes[1].image }}
                style={styles.featuredCardImage}
              />
              <Text style={styles.featuredCardTitle}>
                {randomRecipes[1].title}
              </Text>
            </TouchableOpacity>
          )}
          {/*
        <TouchableOpacity style={styles.featuredCard}>
          <Image
            source={require("../assets/recipe1.jpg")}
            style={styles.featuredCardImage}
          />
          <Text style={styles.featuredCardTitle}>Spaghetti Bolognese</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.featuredCard}>
          <Image
            source={require("../assets/recipe2.jpg")}
            style={styles.featuredCardImage}
          />
          <Text style={styles.featuredCardTitle}>Chicken Alfredo</Text>
        </TouchableOpacity> */}
          {/* Add more featured recipe cards here */}
        </View>

        <TouchableOpacity style={styles.button} onPress={navigateToOnlineRecipes}>
          <Text style={styles.buttonText}>Explore More Online Recipes</Text>
        </TouchableOpacity>

        <View style={styles.communitySection}>
          <Text style={styles.sectionHeader}>Top Community Recipes</Text>
          {/* Display top community recipes */}
          <TouchableOpacity style={styles.communityRecipe}>
            <Image
              source={require("../../assets/recipe3.jpg")}
              style={styles.communityRecipeImage}
            />
            <Text style={styles.communityRecipeTitle}>Veggie Stir-Fry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.communityRecipe}>
            <Image
              source={require("../../assets/recipe4.jpg")}
              style={styles.communityRecipeImage}
            />
            <Text style={styles.communityRecipeTitle}>Homemade Pizza</Text>
          </TouchableOpacity>
          {/* Add more top community recipes here */}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={navigateToCommunityRecipes}
        >
          <Text style={styles.buttonText}>Explore More Community Recipes</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© FYP-23-S4-35</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  heyText: {
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)', // Adjust the opacity/color as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: {
    width: "100%",
    height: 200,
  },
  introSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  introHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  introImages: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  introImage: {
    flex: 1,
    alignItems: "center",
  },
  introImageImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  introImageText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "black",
    textAlign: "center",
  },
  introButton:{
    backgroundColor: "#FCFCD3",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  startButton: {
    backgroundColor: "#0066cc",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 20,
  },
  featuredSection: {
    marginBottom: 20,
  },
  featuredCard: {
    flexDirection: "column",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    margin: 10,
    padding: 10,
    backgroundColor: "#FCFCD3",
  },
  featuredCardImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  featuredCardTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  communitySection: {
    marginBottom: 20,
  },
  communityRecipe: {
    flexDirection: "column",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    margin: 10,
    padding: 10,
    backgroundColor: "#FCFCD3",
  },
  communityRecipeImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  communityRecipeTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#0066cc",
    padding: 10,
    borderRadius: 10,
    margin: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    padding: 10,
    backgroundColor: "#333",
    alignItems: "center",
  },
  footerText: {
    color: "#fff",
  },
});

export default HomeScreen;

// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";

// const HomeScreen = ({ navigation }) => {
//   const navigateToCommunityRecipes = () => {
//     // Navigate to the Community Recipes screen
//     navigation.navigate("CommunityRecipes");
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>My Recipe App</Text>
//       </View>
//       {/* <Image source={require('./assets/recipe_image.jpg')} style={styles.bannerImage} /> */}

//       <View style={styles.featuredSection}>
//         <Text style={styles.sectionHeader}>Featured Recipes</Text>
//         {/* Display featured recipe cards */}
//         <TouchableOpacity style={styles.featuredCard}>
//           {/* <Image source={require('./assets/recipe1.jpg')} style={styles.featuredCardImage} /> */}
//           <Text style={styles.featuredCardTitle}>Spaghetti Bolognese</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.featuredCard}>
//           {/* <Image source={require('./assets/recipe2.jpg')} style={styles.featuredCardImage} /> */}
//           <Text style={styles.featuredCardTitle}>Chicken Alfredo</Text>
//         </TouchableOpacity>
//         {/* Add more featured recipe cards here */}
//       </View>

//       <View style={styles.communitySection}>
//         <Text style={styles.sectionHeader}>Top Community Recipes</Text>
//         {/* Display top community recipes */}
//         <TouchableOpacity style={styles.communityRecipe}>
//           {/* <Image source={require('./assets/recipe3.jpg')} style={styles.communityRecipeImage} /> */}
//           <Text style={styles.communityRecipeTitle}>Veggie Stir-Fry</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.communityRecipe}>
//           {/* <Image source={require('./assets/recipe4.jpg')} style={styles.communityRecipeImage} /> */}
//           <Text style={styles.communityRecipeTitle}>Homemade Pizza</Text>
//         </TouchableOpacity>
//         {/* Add more top community recipes here */}
//       </View>

//       {/* Button to navigate to Community Recipes */}
//       <TouchableOpacity
//         style={styles.button}
//         onPress={navigateToCommunityRecipes}
//       >
//         <Text style={styles.buttonText}>Explore More Community Recipes</Text>
//       </TouchableOpacity>

//       <View style={styles.footer}>
//         <Text style={styles.footerText}>© 2023 My Recipe App</Text>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   header: {
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: "bold",
//   },
//   bannerImage: {
//     width: "100%",
//     height: 200,
//   },
//   sectionHeader: {
//     fontSize: 20,
//     fontWeight: "bold",
//     margin: 20,
//   },
//   featuredSection: {
//     marginBottom: 20,
//   },
//   featuredCard: {
//     flexDirection: "column",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     margin: 10,
//     padding: 10,
//   },
//   featuredCardImage: {
//     width: 150,
//     height: 150,
//     borderRadius: 10,
//   },
//   featuredCardTitle: {
//     marginTop: 10,
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   communitySection: {
//     marginBottom: 20,
//   },
//   communityRecipe: {
//     flexDirection: "column",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     margin: 10,
//     padding: 10,
//   },
//   communityRecipeImage: {
//     width: 150,
//     height: 150,
//     borderRadius: 10,
//   },
//   communityRecipeTitle: {
//     marginTop: 10,
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   button: {
//     backgroundColor: "#0066cc",
//     padding: 10,
//     borderRadius: 10,
//     margin: 20,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   footer: {
//     padding: 10,
//     backgroundColor: "#333",
//     alignItems: "center",
//   },
//   footerText: {
//     color: "#fff",
//   },
// });

// export default HomeScreen;
