import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { TouchableRipple } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { fetchRandomRecipes, fetchRecommendations } from "../../services/Api";
import { Context } from "../../store/context";

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
        const recipes = await fetchRandomRecipes(3);
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

  useEffect(() => {
    if (targetCalories === 0) {
      setProgressCheck(0);
    } else if (!loading && latestUserData) {
      const progress = (latestTotalCalories / targetCalories) * 100;
      setProgressCheck(progress);
    }
  }, [loading, latestUserData, targetCalories, latestTotalCalories]);

  const progress = Math.min(100, Math.max(0, progressCheck));

  const animatedCircularProgressColor = progress > 100 ? "#FFEBCC" : "#FF9130";

  //======================for recommendation========================
  const foodRestrictions = latestUserData.foodRestrictions;

  useEffect(() => {
    const generateRecommendations = async () => {
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
      <SafeAreaView style={styles.androidSafeArea}>
        <ScrollView style={styles.container}>
          <StatusBar backgroundColor="white" barStyle="dark-content" />
          <View style={styles.header}>
            <Text style={styles.headerText}>Welcome, {currentUser.username}!</Text>
            <TouchableRipple onPress={navigateToFoodRecognitionScreen}>
              <View style={styles.menuItem}>
                <Icon name="scan-helper" color="#FF6347" size={25} />
              </View>
            </TouchableRipple>
          </View>
          <ImageBackground
            backgroundColor="#F2F2F2"
          >
            <View style={styles.introSection}>
              <View style={styles.componentContainer}>
                {loading ? (
                  <Text>Loading...</Text>
                ) : (
                  <>
                    <View>
                      <TouchableOpacity
                        onPress={navigateToSummaryScreen}
                      >
                        <View style={styles.flexColumnComponent}>
                          <Text style={styles.subTitle}>
                            Daily Intake
                          </Text>
                        </View>

                        <View style={styles.flexRowComponent}>
                          <View style={styles.leftComponent}>
                            <Text style={[styles.normalText]}
                            >Calorie Consumed</Text>
                            <Text
                              style={[styles.normalText, styles.orangeText]}
                            >
                              {Math.round(latestTotalCalories)} cal
                            </Text>
                            <Text style={[styles.normalText]}
                            >Recommended Intake</Text>
                            <Text
                              style={[styles.normalText, styles.orangeText]}
                            >
                              {Math.round(latestUserData.calorie)} cal
                            </Text>
                          </View>
                          <View style={styles.rightComponent}>
                            <AnimatedCircularProgress
                              size={130}
                              width={30}
                              fill={progress} // Assuming progress is a value between 0 and 100
                              tintColor={animatedCircularProgressColor}
                              backgroundColor="#FFEBCC"
                              rotation={0}
                              lineCap="round"
                            >
                              {/* {
                            (fill) => (
                              <Text style={styles.points}>
                                {progress} %
                              </Text>
                            )
                          } */}
                            </AnimatedCircularProgress>
                          </View>
                        </View>

                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>

              <View style={styles.flexRowComponent}>
                <View style={[styles.leftComponent, styles.flexColumnComponent]}>
                  <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={navigateToCalculateCaloriesScreen}
                  >
                    <Image
                      source={require("../../assets/caloriesCalculator.png")}
                      style={styles.iconImage}
                    />
                    <Text style={styles.iconText}>
                      Calculate Target Intake
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.middleComponent, styles.flexColumnComponent]}>
                  <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={navigateToAddRecipeScreen}
                  >
                    <Image
                      source={require("../../assets/shareRecipe.png")}
                      style={styles.iconImage}
                    />
                    <Text style={styles.iconText}>
                      Share Your Recipes
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.rightComponent, styles.flexColumnComponent]}>
                  <View style={styles.introImage}>
                    <TouchableOpacity
                      style={styles.iconContainer}
                      onPress={navigateToInsertMedicalHistoryScreen}
                    >
                      <Image
                        source={require("../../assets/medicalHistory.png")}
                        style={styles.iconImage}
                      />
                      <Text style={styles.iconText}>
                        Insert Medical History
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* <View style={styles.introImage}>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={navigateToTrackProgressScreen}
                  >
                    <Image
                      source={require("../../assets/image3.png")}
                      style={styles.iconImage}
                    />
                    <Text style={styles.iconText}>
                      Track Your Progress
                    </Text>
                  </TouchableOpacity>
                </View> */}
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={navigateToUser}
            >
              <Text style={styles.buttonText}>Start Now</Text>
            </TouchableOpacity>

            {/* Recommended Recipe Section */}
            <Text style={styles.sectionHeader}>Top Picks Of The Day</Text>
            <ScrollView horizontal={true}>
              {recommendedRecipes.meals &&
                recommendedRecipes.meals.length >= 0 && (
                  <TouchableOpacity
                    key={recommendedRecipes.meals[0].id}
                    style={styles.recipeContainerHorizontal}
                    onPress={() =>
                      navigateToOnlineRecipesInfo(
                        recommendedRecipes.meals[0].id
                      )
                    }
                  >
                    <Image
                      source={{
                        uri: `https://spoonacular.com/recipeImages/${recommendedRecipes.meals[0].id}-312x231.${recommendedRecipes.meals[0].imageType}`,
                      }}
                      style={styles.imageHorizontal}
                    />
                    <Text style={styles.communityRecipeTitle}>
                      {recommendedRecipes.meals[0].title}
                    </Text>
                  </TouchableOpacity>
                )}

              {recommendedRecipes.meals &&
                recommendedRecipes.meals.length > 0 && (
                  <TouchableOpacity
                    key={recommendedRecipes.meals[1].id}
                    style={styles.recipeContainerHorizontal}
                    onPress={() =>
                      navigateToOnlineRecipesInfo(
                        recommendedRecipes.meals[1].id
                      )
                    }
                  >
                    <Image
                      source={{
                        uri: `https://spoonacular.com/recipeImages/${recommendedRecipes.meals[1].id}-312x231.${recommendedRecipes.meals[1].imageType}`,
                      }}
                      style={styles.imageHorizontal}
                    />
                    <Text style={styles.communityRecipeTitle}>
                      {recommendedRecipes.meals[1].title}
                    </Text>
                  </TouchableOpacity>
                )}

              {recommendedRecipes.meals &&
                recommendedRecipes.meals.length > 0 && (
                  <TouchableOpacity
                    key={recommendedRecipes.meals[2].id}
                    style={styles.recipeContainerHorizontal}
                    onPress={() =>
                      navigateToOnlineRecipesInfo(
                        recommendedRecipes.meals[2].id
                      )
                    }
                  >
                    <Image
                      source={{
                        uri: `https://spoonacular.com/recipeImages/${recommendedRecipes.meals[2].id}-312x231.${recommendedRecipes.meals[2].imageType}`,
                      }}
                      style={styles.imageHorizontal}
                    />
                    <Text style={styles.communityRecipeTitle}>
                      {recommendedRecipes.meals[2].title}
                    </Text>
                  </TouchableOpacity>
                )}
            </ScrollView>

            {/* Online Recipe Section */}
            <Text style={styles.sectionHeader} onPress={navigateToOnlineRecipes}
            >Online Recipes</Text>
            <ScrollView horizontal={true}>
              {randomRecipes[0] && (
                <TouchableOpacity
                  style={styles.recipeContainerHorizontal}
                  onPress={() =>
                    navigateToOnlineRecipesInfo(randomRecipes[0].id)
                  }
                >
                  <Image
                    source={{ uri: randomRecipes[0].image }}
                    style={styles.imageHorizontal}
                  />
                  <Text style={styles.communityRecipeTitle}>
                    {randomRecipes[0].title}
                  </Text>
                </TouchableOpacity>
              )}
              {randomRecipes[1] && (
                <TouchableOpacity
                  style={styles.recipeContainerHorizontal}
                  onPress={() =>
                    navigateToOnlineRecipesInfo(randomRecipes[1].id)
                  }
                >
                  <Image
                    source={{ uri: randomRecipes[1].image }}
                    style={styles.imageHorizontal}
                  />
                  <Text style={styles.communityRecipeTitle}>
                    {randomRecipes[1].title}
                  </Text>
                </TouchableOpacity>
              )}
              {randomRecipes[2] && (
                <TouchableOpacity
                  style={styles.recipeContainerHorizontal}
                  onPress={() =>
                    navigateToOnlineRecipesInfo(randomRecipes[2].id)
                  }
                >
                  <Image
                    source={{ uri: randomRecipes[2].image }}
                    style={styles.imageHorizontal}
                  />
                  <Text style={styles.communityRecipeTitle}>
                    {randomRecipes[2].title}
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>

            {/* <TouchableOpacity
              style={styles.button}
              onPress={navigateToOnlineRecipes}
            >
              <Text style={styles.buttonText}>Explore More Online Recipes</Text>
            </TouchableOpacity> */}

            {/* Community Recipe Section */}
            <Text style={styles.sectionHeader} onPress={navigateToCommunityRecipes}
            >Top Community Recipes</Text>
            {/* Display top community recipes */}
            <ScrollView horizontal={true}>
              <View style={styles.flexRowComponent}>
                {communityRecipes[0] && (
                  <TouchableOpacity
                    style={styles.recipeContainerHorizontal}
                    onPress={() =>
                      navigateToCommunityRecipesInfo(communityRecipes[0])
                    }
                  >
                    <Image
                      source={{ uri: communityRecipes[0].image }}
                      style={styles.imageHorizontal}
                    />
                    <Text style={styles.communityRecipeTitle}>
                      {communityRecipes[0].name}
                    </Text>
                  </TouchableOpacity>
                )}
                {communityRecipes[1] && (
                  <TouchableOpacity
                    style={styles.recipeContainerHorizontal}
                    onPress={() =>
                      navigateToCommunityRecipesInfo(communityRecipes[1])
                    }
                  >
                    <Image
                      source={{ uri: communityRecipes[1].image }}
                      style={styles.imageHorizontal}
                    />
                    <Text style={styles.communityRecipeTitle}>
                      {communityRecipes[1].name}
                    </Text>
                  </TouchableOpacity>
                )}
                {communityRecipes[2] && (
                  <TouchableOpacity
                    style={styles.recipeContainerHorizontal}
                    onPress={() =>
                      navigateToCommunityRecipesInfo(communityRecipes[2])
                    }
                  >
                    <Image
                      source={{ uri: communityRecipes[2].image }}
                      style={styles.imageHorizontal}
                    />
                    <Text style={styles.communityRecipeTitle}>
                      {communityRecipes[2].name}
                    </Text>
                  </TouchableOpacity>
                )}
                {/* Add more top community recipes here */}
              </View>
            </ScrollView>
            {/* <TouchableOpacity
                style={styles.button}
                onPress={navigateToCommunityRecipes}
              >
                <Text style={styles.buttonText}>
                  Explore More Community Recipes
                </Text>
              </TouchableOpacity> */}

            {/* Business Recipe Section */}
            <Text style={styles.sectionHeader} onPress={navigateToBusinessRecipes}>Top Business Recipes</Text>
            {/* Display top community recipes */}
            <ScrollView horizontal={true}>
              <View style={styles.flexRowComponent}>
                {businessRecipes[0] && (
                  <TouchableOpacity
                    style={styles.recipeContainerHorizontal}
                    onPress={() =>
                      navigateToBusinessRecipesInfo(businessRecipes[0])
                    }
                  >
                    <Image
                      source={{ uri: businessRecipes[0].image }}
                      style={styles.imageHorizontal}
                    />
                    <Text style={styles.communityRecipeTitle}>
                      {businessRecipes[0].name}
                    </Text>
                  </TouchableOpacity>
                )}
                {businessRecipes[1] && (
                  <TouchableOpacity
                    style={styles.recipeContainerHorizontal}
                    onPress={() =>
                      navigateToBusinessRecipesInfo(businessRecipes[1])
                    }
                  >
                    <Image
                      source={{ uri: businessRecipes[1].image }}
                      style={styles.imageHorizontal}
                    />
                    <Text style={styles.communityRecipeTitle}>
                      {businessRecipes[1].name}
                    </Text>
                  </TouchableOpacity>
                )}
                {businessRecipes[2] && (
                  <TouchableOpacity
                    style={styles.recipeContainerHorizontal}
                    onPress={() =>
                      navigateToBusinessRecipesInfo(businessRecipes[2])
                    }
                  >
                    <Image
                      source={{ uri: businessRecipes[2].image }}
                      style={styles.imageHorizontal}
                    />
                    <Text style={styles.communityRecipeTitle}>
                      {businessRecipes[2].name}
                    </Text>
                  </TouchableOpacity>
                )}
                {/* Add more top business recipes here */}
              </View>
            </ScrollView>

            {/* <TouchableOpacity
              style={styles.button}
              onPress={navigateToBusinessRecipes}
            >
              <Text style={styles.buttonText}>
                Explore More Business Recipes
              </Text>
            </TouchableOpacity> */}

            <View style={styles.footer}>
              <Text style={styles.footerText}>© FYP-23-S4-35</Text>
            </View>
          </ImageBackground>
        </ScrollView >
      </SafeAreaView >
    );
  } else {
    return (
      <SafeAreaView style={styles.androidSafeArea}>
        <ScrollView style={styles.container}>
          <StatusBar backgroundColor="white" barStyle="dark-content" />
          <View style={styles.header}>
            <Text style={styles.headerText}>Welcome, {currentUser.username}!</Text>
            <TouchableRipple onPress={navigateToFoodRecognitionScreen}>
              <View style={styles.menuItem}>
                <Icon name="scan-helper" color="#FF6347" size={25} />
              </View>
            </TouchableRipple>
          </View>
          <ImageBackground
            backgroundColor="#F2F2F2"
          >
            <View style={styles.introSection}>

              <View style={styles.flexRowComponent}>
                <View style={[styles.leftComponent, styles.flexColumnComponent]}>
                  <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={navigateToCalculateCaloriesScreen}
                  >
                    <Image
                      source={require("../../assets/caloriesCalculator.png")}
                      style={styles.iconImage}
                    />
                    <Text style={styles.iconText}>
                      Calculate Target Intake
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.middleComponent, styles.flexColumnComponent]}>
                  <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={navigateToAddRecipeScreen}
                  >
                    <Image
                      source={require("../../assets/shareRecipe.png")}
                      style={styles.iconImage}
                    />
                    <Text style={styles.iconText}>
                      Share Your Recipes
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.rightComponent, styles.flexColumnComponent]}>
                  <View style={styles.introImage}>
                    <TouchableOpacity
                      style={styles.iconContainer}
                      onPress={navigateToInsertMedicalHistoryScreen}
                    >
                      <Image
                        source={require("../../assets/medicalHistory.png")}
                        style={styles.iconImage}
                      />
                      <Text style={styles.iconText}>
                        Insert Medical History
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* <View style={styles.introImage}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={navigateToTrackProgressScreen}
                >
                  <Image
                    source={require("../../assets/image3.png")}
                    style={styles.iconImage}
                  />
                  <Text style={styles.iconText}>
                    Track Your Progress
                  </Text>
                </TouchableOpacity>
              </View> */}
                </View>
              </View>
            </View>

            {/* Online Recipe Section */}
            <Text style={styles.sectionHeader} onPress={navigateToOnlineRecipes}
            >Online Recipes</Text>
            <ScrollView horizontal={true}>
              {randomRecipes[0] && (
                <TouchableOpacity
                  style={styles.recipeContainerHorizontal}
                  onPress={() =>
                    navigateToOnlineRecipesInfo(randomRecipes[0].id)
                  }
                >
                  <Image
                    source={{ uri: randomRecipes[0].image }}
                    style={styles.imageHorizontal}
                  />
                  <Text style={styles.communityRecipeTitle}>
                    {randomRecipes[0].title}
                  </Text>
                </TouchableOpacity>
              )}
              {randomRecipes[1] && (
                <TouchableOpacity
                  style={styles.recipeContainerHorizontal}
                  onPress={() =>
                    navigateToOnlineRecipesInfo(randomRecipes[1].id)
                  }
                >
                  <Image
                    source={{ uri: randomRecipes[1].image }}
                    style={styles.imageHorizontal}
                  />
                  <Text numberOfLines={2} ellipsizeMode="tail" style={styles.communityRecipeTitle}>
                    {randomRecipes[1].title}
                  </Text>
                </TouchableOpacity>
              )}
              {randomRecipes[2] && (
                <TouchableOpacity
                  style={styles.recipeContainerHorizontal}
                  onPress={() =>
                    navigateToOnlineRecipesInfo(randomRecipes[2].id)
                  }
                >
                  <Image
                    source={{ uri: randomRecipes[2].image }}
                    style={styles.imageHorizontal}
                  />
                  <Text style={styles.communityRecipeTitle}>
                    {randomRecipes[2].title}
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>

            {/* <TouchableOpacity
            style={styles.button}
            onPress={navigateToOnlineRecipes}
          >
            <Text style={styles.buttonText}>Explore More Online Recipes</Text>
          </TouchableOpacity> */}

            {/* Community Recipe Section */}
            <Text style={styles.sectionHeader} onPress={navigateToCommunityRecipes}
            >Top Community Recipes</Text>
            {/* Display top community recipes */}
            <ScrollView horizontal={true}>
              <View style={styles.flexRowComponent}>
                {communityRecipes[0] && (
                  <TouchableOpacity
                    style={styles.recipeContainerHorizontal}
                    onPress={() =>
                      navigateToCommunityRecipesInfo(communityRecipes[0])
                    }
                  >
                    <Image
                      source={{ uri: communityRecipes[0].image }}
                      style={styles.imageHorizontal}
                    />
                    <Text style={styles.communityRecipeTitle}>
                      {communityRecipes[0].name}
                    </Text>
                  </TouchableOpacity>
                )}
                {communityRecipes[1] && (
                  <TouchableOpacity
                    style={styles.recipeContainerHorizontal}
                    onPress={() =>
                      navigateToCommunityRecipesInfo(communityRecipes[1])
                    }
                  >
                    <Image
                      source={{ uri: communityRecipes[1].image }}
                      style={styles.imageHorizontal}
                    />
                    <Text style={styles.communityRecipeTitle}>
                      {communityRecipes[1].name}
                    </Text>
                  </TouchableOpacity>
                )}
                {communityRecipes[2] && (
                  <TouchableOpacity
                    style={styles.recipeContainerHorizontal}
                    onPress={() =>
                      navigateToCommunityRecipesInfo(communityRecipes[2])
                    }
                  >
                    <Image
                      source={{ uri: communityRecipes[2].image }}
                      style={styles.imageHorizontal}
                    />
                    <Text style={styles.communityRecipeTitle}>
                      {communityRecipes[2].name}
                    </Text>
                  </TouchableOpacity>
                )}
                {/* Add more top community recipes here */}
              </View>
            </ScrollView>
            {/* <TouchableOpacity
              style={styles.button}
              onPress={navigateToCommunityRecipes}
            >
              <Text style={styles.buttonText}>
                Explore More Community Recipes
              </Text>
            </TouchableOpacity> */}

            {/* Business Recipe Section */}
            <Text style={styles.sectionHeader} onPress={navigateToBusinessRecipes}>Top Business Recipes</Text>
            {/* Display top community recipes */}
            <ScrollView horizontal={true}>
              <View style={styles.flexRowComponent}>
                {businessRecipes[0] && (
                  <TouchableOpacity
                    style={styles.recipeContainerHorizontal}
                    onPress={() =>
                      navigateToBusinessRecipesInfo(businessRecipes[0])
                    }
                  >
                    <Image
                      source={{ uri: businessRecipes[0].image }}
                      style={styles.imageHorizontal}
                    />
                    <Text style={styles.communityRecipeTitle}>
                      {businessRecipes[0].name}
                    </Text>
                  </TouchableOpacity>
                )}
                {businessRecipes[1] && (
                  <TouchableOpacity
                    style={styles.recipeContainerHorizontal}
                    onPress={() =>
                      navigateToBusinessRecipesInfo(businessRecipes[1])
                    }
                  >
                    <Image
                      source={{ uri: businessRecipes[1].image }}
                      style={styles.imageHorizontal}
                    />
                    <Text style={styles.communityRecipeTitle}>
                      {businessRecipes[1].name}
                    </Text>
                  </TouchableOpacity>
                )}
                {businessRecipes[2] && (
                  <TouchableOpacity
                    style={styles.recipeContainerHorizontal}
                    onPress={() =>
                      navigateToBusinessRecipesInfo(businessRecipes[2])
                    }
                  >
                    <Image
                      source={{ uri: businessRecipes[2].image }}
                      style={styles.imageHorizontal}
                    />
                    <Text style={styles.communityRecipeTitle}>
                      {businessRecipes[2].name}
                    </Text>
                  </TouchableOpacity>
                )}
                {/* Add more top business recipes here */}
              </View>
            </ScrollView>

            {/* <TouchableOpacity
            style={styles.button}
            onPress={navigateToBusinessRecipes}
          >
            <Text style={styles.buttonText}>
              Explore More Business Recipes
            </Text>
          </TouchableOpacity> */}

            <View style={styles.footer}>
              <Text style={styles.footerText}>© FYP-23-S4-35</Text>
            </View>
          </ImageBackground>
        </ScrollView >
      </SafeAreaView >
    );
  }
};

const styles = StyleSheet.create({
  androidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000"
  },
  chartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginBottom: 20,
    // padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF9130"
  },
  normalText: {
    fontSize: 14,
    margin: 1,
    // textAlign: "center",
  },
  orangeText: {
    color: "#FF9130"
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
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  introSection: {
    padding: 12,
    borderBottomColor: "#ccc",
  },
  introHeader: {
    fontSize: 20,
    fontWeight: "bold",
    // marginBottom: 20,
  },
  introImages: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginBottom: 20,
  },
  introImage: {
    flex: 1,
    alignItems: "center",
  },
  iconImage: {
    width: 50,
    height: 50,
  },
  iconText: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 10,
    // color: "black",
    color: "#FF9130",
    textAlign: "center",
  },
  iconContainer: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    minHeight: 120,
    minWidth: 100,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 8,
    color: "#FF9130"
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
  featuredCard: {
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 20,
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
    borderRadius: 20,
  },
  imageHorizontal: {
    width: 160,
    height: 175,
    resizeMode: "cover",
    borderRadius: 10,
  },
  featuredCardTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  recipeContainer: {
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 20,
    margin: 8,
    padding: 10,
    gap: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recipeContainerHorizontal: {
    //flexDirection: "column",
    alignItems: "center",
    borderRadius: 20,
    margin: 8,
    padding: 10,
    //gap: 8,
    width: 180,
    backgroundColor: "#FFFFFF",
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
    borderRadius: 20,
  },
  communityRecipeTitle: {
    marginTop: 5,
    fontSize: 14,
    textAlign: "center",
    // width: "100%"
  },
  button: {
    backgroundColor: "#ED6F21",
    padding: 10,
    borderRadius: 10,
    margin: 8,
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

  // component
  componentContainer: {
    display: "flex",
    width: "100%",
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 20,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  flexRowComponent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
  },
  flexColumnComponent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    flexDirection: "column",
  },
  leftComponent: {
    flex: 1, // Takes up 1/3 of the available space
  },
  middleComponent: {
    flex: 1, // Takes up 1/3 of the available space
    alignItems: "center"
  },
  rightComponent: {
    flex: 1, // Takes up 1/3 of the available space
    alignItems: "center"
  },
});

export default HomeScreen;
