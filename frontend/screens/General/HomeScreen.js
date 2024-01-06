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
import { TouchableRipple } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { fetchRandomRecipes, fetchRecommendations } from "../../services/Api";
import { Context } from "../../store/context";
import * as Progress from "react-native-progress";

const HomeScreen = ({ navigation }) => {
  const [randomRecipes, setRandomRecipes] = useState([]);
  const [currentUser, setCurrentUser] = useContext(Context);
  const [users, setUsers] = useState([]);
  const [latestUserData, setLatestUserData] = useState([]);
  const [latestTotalCalories, setLatestTotalCalories] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [communityRecipes, setCommunityRecipes] = useState([]);
  const [businessRecipes, setBusinessRecipes] = useState([]);
  const [progressCheck, setProgressCheck] = useState(0);

  // ==================== for navigation ====================
  const navigateToCommunityRecipes = () => {
    navigation.navigate("Community Recipes");
  };

  const navigateToUser = () => {
    navigation.navigate("User Profile");
  };

  const navigateToOnlineRecipes = () => {
    navigation.navigate("Online Recipes");
  };

  const navigateToBusinessRecipes = () => {
    navigation.navigate("Business Recipes");
  };

  const navigateToFoodRecognitionScreen = () => {
    navigation.navigate("FoodRecognitionScreen");
  };

  const navigateToTrackProgressScreen = () => {
    navigation.navigate("Track Progress");
  };

  const navigateToAddRecipeScreen = () => {
    navigation.navigate("Add Recipe");
  };

  const navigateToOnlineRecipesInfo = (recipeId) => {
    navigation.navigate("Online Recipe Information", { recipeId });
  };

  const navigateToCommunityRecipesInfo = (recipeData) => {
    navigation.navigate("Recipe Information", { recipeData });
  };

  const navigateToBusinessRecipesInfo = (recipeData) => {
    navigation.navigate("Business Recipe Information", { recipeData });
  };

  const navigateToCalculateCaloriesScreen = () => {
    navigation.navigate("Calculate Calorie");
  };

  const navigateToInsertMedicalHistoryScreen = () => {
    navigation.navigate("Medical History");
  };
  
  const navigateToSummaryScreen = async () => {
    try {
      const userData = await fetchCurrentUser();
      navigation.navigate("TabDWMScreen", { user: userData });
    } catch (error) {
      console.error("Error fetching current user data:", error);
    }
  };

  //============= online random recipes =================
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipes = await fetchRandomRecipes(2);
        setRandomRecipes(recipes);
      } catch (error) {
        console.error("Error fetching random recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

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

  //===============for progress bar================
  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_IP}/user/getUserById/${currentUser._id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setLatestUserData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);
  //console.log("latestUserData: " + latestUserData + latestUserData.calorie);

  const targetCalories = latestUserData.calorie;
  useEffect(() => {
    if (!loading && latestUserData) {
      const CaloriesLog = latestUserData.dailyCaloriesLog;
      const latestDataEntry =
        CaloriesLog.length > 0 ? CaloriesLog[CaloriesLog.length - 1] : null;
      const latestTotalCalories = latestDataEntry
        ? latestDataEntry.total_calories
        : 0;
      setLatestTotalCalories(latestTotalCalories);
    }

  }, [loading, latestUserData]);
  //console.log("targetCalories: " + CaloriesLog);
  //console.log("latestTotalCalories: " + latestTotalCalories);

  useEffect (() => {
    if (targetCalories === 0) {
      setProgressCheck(0);
    } else if (!loading && latestUserData) {
      const progress = (latestTotalCalories / targetCalories) * 100;
      setProgressCheck(progress);
    }
  }, [loading, latestUserData, targetCalories, latestTotalCalories]);

  const progress = Math.min(100, Math.max(0, progressCheck));

  const progressBarColor = progress > 100 ? "#FF3925" : "#3EE649";

  //======================for recommandation========================
  const foodRestrictions = latestUserData.foodRestrictions;

  useEffect(() => {
    const generateRecommendations = async() => {
      fetchRecommendations(targetCalories, foodRestrictions)
        .then((data) => {
          console.log("Recommendations data:", data);
          setRecommendedRecipes(data);
        })
        .catch((error) => {
          console.error("Error fetching three meal recommendations:", error);
          setRecommendedRecipes([]);
        });
    };
    generateRecommendations();
  }, [targetCalories, foodRestrictions]); 

  // useEffect(() => {
  //   const generateRecommendations = async () => {
  //     try {
  //       const data = await fetchRecommendations(targetCalories, foodRestrictions);
  //       console.log("Recommendations data:", data);
  
  //       if (data && data.meals && Array.isArray(data.meals)) {
  //         // Ensure that data.meals is defined and is an array before setting state
  //         setRecommendedRecipes(data);
  //       } else {
  //         // If data.meals is undefined or not an array, set default state
  //         setRecommendedRecipes({ meals: [] });
  //       }
  //     } catch (error) {
  //       console.error("Error fetching three meal recommendations:", error);
  //       setRecommendedRecipes({ meals: [] });
  //     }
  //   };
  
  //   generateRecommendations();
  // }, [targetCalories, foodRestrictions]);

  //==================for top community recipes===================
  useEffect(() => {
    const fetchHighRatedRecipes = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_IP}/recipe/getHighRatedRecipes`
        );
        const data = await response.json();
        setCommunityRecipes(data);
      } catch (error) {
        console.error("Error fetching high rated recipes:", error);
      }
    };

    fetchHighRatedRecipes();
  }, []);

  //==================for top business recipes===================
  useEffect(() => {
    const fetchHighRatedBizRecipes = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_IP}/bizRecipe/getHighRatedBizRecipes`
        );
        const data = await response.json();
        setBusinessRecipes(data);
      } catch (error) {
        console.error("Error fetching high rated recipes:", error);
      }
    };

    fetchHighRatedBizRecipes();
  }, []);


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

  if (currentUser.userType === "user") {

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
          source={require("../../assets/gradientHue.jpg")}
          style={styles.backgroundImage}
        >          
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
            <View style={styles.chartContainer}>
              {loading ? (
                <Text>Loading...</Text>
              ) : (
                <>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="target" size={20} color="green"/>
                    <Text style={[styles.progressText, { color: "black"}]}>Today's Calories Intake</Text>
                  </View>
                  <Progress.Bar
                    progress={progress / 100}
                    width={320}
                    height={15}
                    color={progressBarColor}
                    borderColor="#black"
                  />
                  <Text style={[styles.progressText, { color: progressBarColor }]}>{Math.round(latestTotalCalories)} / {Math.round(latestUserData.calorie)} Cal consumed</Text>
                </>
              )}        
            </View>

            <View style={styles.insertSection}>
              <View style={styles.insertImage}>
                <TouchableOpacity style={styles.insertButton} onPress={navigateToCalculateCaloriesScreen}>
                  <Image
                    source={require("../../assets/calories_calculator.jpg")}
                    style={styles.introImageImage}
                  />
                  <Text style={styles.introImageText}>Calculate Target Intake</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.space} />
              <View style={styles.insertImage}>
                <TouchableOpacity style={styles.insertButton} onPress={navigateToInsertMedicalHistoryScreen}>
                  <Image
                    source={require("../../assets/medical_history.jpg")}
                    style={styles.introImageImage}
                  />
                  <Text style={styles.introImageText}>Insert Medical History</Text>
                </TouchableOpacity>
              </View>
            </View>

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

          {/* Recommended Recipe Section */}
          <View style={styles.recommandSection}>
            <Text style={styles.sectionHeader}>Today's Recommandation</Text>
            {/* Breakfast */}
            <Text style={styles.mealText}>Breakfast</Text>
            {recommendedRecipes.meals && recommendedRecipes.meals.length >= 0 && (
              <TouchableOpacity
                key={recommendedRecipes.meals[0].id}
                style={styles.featuredCard}
                onPress={() => navigateToOnlineRecipesInfo(recommendedRecipes.meals[0].id)}
              >
                <Image 
                  source={{ uri: `https://spoonacular.com/recipeImages/${recommendedRecipes.meals[0].id}-312x231.${recommendedRecipes.meals[0].imageType}` }} 
                  style={styles.featuredCardImage} 
                />
                <Text style={styles.featuredCardTitle}>{recommendedRecipes.meals[0].title}</Text>
              </TouchableOpacity>
            )}

            {/* Lunch */}
            <Text style={styles.mealText}>Lunch</Text>
            {recommendedRecipes.meals && recommendedRecipes.meals.length > 0 && (
              <TouchableOpacity
                key={recommendedRecipes.meals[1].id}
                style={styles.featuredCard}
                onPress={() => navigateToOnlineRecipesInfo(recommendedRecipes.meals[1].id)}
              >
                <Image 
                  source={{ uri: `https://spoonacular.com/recipeImages/${recommendedRecipes.meals[1].id}-312x231.${recommendedRecipes.meals[1].imageType}` }} 
                  style={styles.featuredCardImage} 
                />
                <Text style={styles.featuredCardTitle}>{recommendedRecipes.meals[1].title}</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.mealText}>Dinner</Text>
            {recommendedRecipes.meals && recommendedRecipes.meals.length > 0 && (
              <TouchableOpacity
                key={recommendedRecipes.meals[2].id}
                style={styles.featuredCard}
                onPress={() => navigateToOnlineRecipesInfo(recommendedRecipes.meals[2].id)}
              >
                <Image 
                  source={{ uri: `https://spoonacular.com/recipeImages/${recommendedRecipes.meals[2].id}-312x231.${recommendedRecipes.meals[2].imageType}` }} 
                  style={styles.featuredCardImage} 
                />
                <Text style={styles.featuredCardTitle}>{recommendedRecipes.meals[2].title}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Online Recipe Section */}
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
          </View>

          <TouchableOpacity style={styles.button} onPress={navigateToOnlineRecipes}>
            <Text style={styles.buttonText}>Explore More Online Recipes</Text>
          </TouchableOpacity>

          {/* Community Recipe Section */}
          <View style={styles.communitySection}>
            <Text style={styles.sectionHeader}>Top Community Recipes</Text>
            {/* Display top community recipes */}
            {communityRecipes[0] && (
              <TouchableOpacity
                style={styles.communityRecipe}
                onPress={() => navigateToCommunityRecipesInfo(communityRecipes[0])}
              >
                <Image
                  source={{ uri: communityRecipes[0].image }}
                  style={styles.communityRecipeImage}
                />
                <Text style={styles.communityRecipeTitle}>
                  {communityRecipes[0].name}
                </Text>
              </TouchableOpacity>
            )}
            {communityRecipes[1] && (
              <TouchableOpacity
                style={styles.communityRecipe}
                onPress={() => navigateToCommunityRecipesInfo(communityRecipes[1])}
              >
                <Image
                  source={{ uri: communityRecipes[1].image }}
                  style={styles.communityRecipeImage}
                />
                <Text style={styles.communityRecipeTitle}>
                  {communityRecipes[1].name}
                </Text>
              </TouchableOpacity>
            )}
            {/* Add more top community recipes here */}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={navigateToCommunityRecipes}
          >
            <Text style={styles.buttonText}>Explore More Community Recipes</Text>
          </TouchableOpacity>
          
          {/* Business Recipe Section */}
          <View style={styles.communitySection}>
            <Text style={styles.sectionHeader}>Top Business Recipes</Text>
            {/* Display top community recipes */}
            {businessRecipes[0] && (
              <TouchableOpacity
                style={styles.communityRecipe}
                onPress={() => navigateToBusinessRecipesInfo(businessRecipes[0])}
              >
                <Image
                  source={{ uri: businessRecipes[0].image }}
                  style={styles.communityRecipeImage}
                />
                <Text style={styles.communityRecipeTitle}>
                  {businessRecipes[0].name}
                </Text>
              </TouchableOpacity>
            )}
            {businessRecipes[1] && (
              <TouchableOpacity
                style={styles.communityRecipe}
                onPress={() => navigateToBusinessRecipesInfo(businessRecipes[1])}
              >
                <Image
                  source={{ uri: businessRecipes[1].image }}
                  style={styles.communityRecipeImage}
                />
                <Text style={styles.communityRecipeTitle}>
                  {businessRecipes[1].name}
                </Text>
              </TouchableOpacity>
            )}
            {/* Add more top community recipes here */}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={navigateToBusinessRecipes}
          >
            <Text style={styles.buttonText}>Explore More Business Recipes</Text>
          </TouchableOpacity>


          <View style={styles.footer}>
            <Text style={styles.footerText}>© FYP-23-S4-35</Text>
          </View>
        </ImageBackground>
      </ScrollView>    
    </SafeAreaView>
  );
  
  } else  {
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
            source={require("../../assets/gradientHue.jpg")}
            style={styles.backgroundImage}
          >   
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
                  <TouchableOpacity style={styles.introButton}>
                    <Image
                      source={require("../../assets/image3.png")}
                      style={styles.introImageImage}
                    />
                    <Text style={styles.introImageText}>Track Your Progress</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.introImage}>
                  <TouchableOpacity style={styles.introButton}>
                    <Image
                      source={require("../../assets/image1.png")}
                      style={styles.introImageImage}
                    />
                    <Text style={styles.introImageText}>View Your Intakes</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.introImage}>
                  <TouchableOpacity style={styles.introButton}>
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

            {/* Community Recipe Section */}
            <View style={styles.communitySection}>
              <Text style={styles.sectionHeader}>Top Community Recipes</Text>
              {/* Display top community recipes */}
              {communityRecipes[0] && (
                <TouchableOpacity
                  style={styles.communityRecipe}
                  onPress={() => navigateToCommunityRecipesInfo(communityRecipes[0])}
                >
                  <Image
                    source={{ uri: communityRecipes[0].image }}
                    style={styles.communityRecipeImage}
                  />
                  <Text style={styles.communityRecipeTitle}>
                    {communityRecipes[0].name}
                  </Text>
                </TouchableOpacity>
              )}
              {communityRecipes[1] && (
                <TouchableOpacity
                  style={styles.communityRecipe}
                  onPress={() => navigateToCommunityRecipesInfo(communityRecipes[1])}
                >
                  <Image
                    source={{ uri: communityRecipes[1].image }}
                    style={styles.communityRecipeImage}
                  />
                  <Text style={styles.communityRecipeTitle}>
                    {communityRecipes[1].name}
                  </Text>
                </TouchableOpacity>
              )}
              {/* Add more top community recipes here */}
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={navigateToCommunityRecipes}
            >
              <Text style={styles.buttonText}>Explore More Community Recipes</Text>
            </TouchableOpacity>

            {/* Business Recipe Section */}
            <View style={styles.communitySection}>
              <Text style={styles.sectionHeader}>Top Business Recipes</Text>
              {/* Display top community recipes */}
              {businessRecipes[0] && (
                <TouchableOpacity
                  style={styles.communityRecipe}
                  onPress={() => navigateToBusinessRecipesInfo(businessRecipes[0])}
                >
                  <Image
                    source={{ uri: businessRecipes[0].image }}
                    style={styles.communityRecipeImage}
                  />
                  <Text style={styles.communityRecipeTitle}>
                    {businessRecipes[0].name}
                  </Text>
                </TouchableOpacity>
              )}
              {businessRecipes[1] && (
                <TouchableOpacity
                  style={styles.communityRecipe}
                  onPress={() => navigateToBusinessRecipesInfo(businessRecipes[1])}
                >
                  <Image
                    source={{ uri: businessRecipes[1].image }}
                    style={styles.communityRecipeImage}
                  />
                  <Text style={styles.communityRecipeTitle}>
                    {businessRecipes[1].name}
                  </Text>
                </TouchableOpacity>
              )}
              {/* Add more top community recipes here */}
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={navigateToBusinessRecipes}
            >
              <Text style={styles.buttonText}>Explore More Business Recipes</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>© FYP-23-S4-35</Text>
            </View>
          </ImageBackground>
        </ScrollView>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  chartContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "#FCFCD3",
    borderRadius: 10,
    borderColor: "#ccc",
  },
  progressText: {
    fontSize: 15,
    fontWeight: "bold",
    margin: 5,
    textAlign: "center",
  },
  heyText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0)", // Adjust the opacity/color as needed
    justifyContent: "center",
    alignItems: "center",
  },
  bannerImage: {
    width: "100%",
    height: 200,
  },
  insertSection: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  insertImage: {
    flex: 1,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: 'hidden', 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  insertButton: {
    backgroundColor: "#FCFCD3",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  space: {
    width: 16,
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
  introButton: {
    backgroundColor: "#FCFCD3",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  startButton: {
    backgroundColor: "#0066cc",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  recommandSection: {
    marginBottom: 20,
  },
  recommandText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  mealText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
