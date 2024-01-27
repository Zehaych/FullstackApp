import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableRipple,
  Button,
  Modal,
  Alert,
  Dimensions,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import IconToo from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/MaterialIcons";
import Icon2 from "react-native-vector-icons/FontAwesome5";
import { Context } from "../../store/context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Swiper from "react-native-swiper";
import {
  ref,
  deleteObject,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../../services/firebase";

const { width, height } = Dimensions.get("window");

export default function ViewBizRecipeInfoScreen({ route, navigation }) {
  // const navigation = useNavigation();
  const recipeData = route.params.recipeData;

  const [username, setUsername] = useState("");

  // new
  const [userReview, setUserReview] = useState("");
  const [isCreator, setIsCreator] = useState(false);
  // const [userRating, setUserRating] = useState("");
  const [submittedReviews, setSubmittedReviews] = useState([]);
  const [currentUserReviews, setCurrentUserReviews] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editReview, setEditReview] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [userRating, setUserRating] = useState(0); // Updated for star rating

  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const reportReasons = [
    "Inappropriate Content",
    "False Information",
    "Offensive Language",
    "Health Misinformation",
    "Plagiarism",
  ];
  const [additionalDetails, setAdditionalDetails] = useState("");

  const [currentUser, setCurrentUser] = useContext(Context);

  const [activeReason, setActiveReason] = useState(null);

  const [isFavorite, setIsFavorite] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(recipeData.price);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_IP}/user/getUserById/${recipeData.submitted_by}`
        );
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        const user = await response.json();
        setUsername(user.username); // Update the state
        setIsCreator(currentUser._id === recipeData.submitted_by); // Check if the current user is the recipe creator
      } catch (error) {
        // console.error("Error fetching user data:", error);
        setUsername("Unknown User"); // Fallback username
      }
    };

    if (recipeData && recipeData.submitted_by) {
      fetchUsername();
    }
  }, [recipeData, currentUser._id]);

  // Reference to the Swiper component
  let swiperRef;

  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    setTotalPrice(newQuantity * recipeData.price);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      setTotalPrice(newQuantity * recipeData.price);
    }
  };

  const navigateToPayment = () => {
    navigation.navigate("Payment", {
      recipeData: recipeData,
    });
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const getTotalPrice = () => {
    return formatPrice(totalPrice);
  };

  useEffect(() => {
    if (recipeData && recipeData.submitted_by) {
      setUsername(recipeData.submitted_by.username);
    }
  }, [recipeData]);

  //All Functions for reporting
  const handleReasonPress = (reason) => {
    setReportReason(reason);
    setActiveReason(reason);
  };

  const reportRecipe = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/bizrecipe/reportBizRecipe/${recipeData._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser._id,
            feedback: reportReason,
            additionalComment: additionalDetails,
          }),
        }
      );
      console.log(recipeData._id);
      console.log(currentUser._id);
      if (response.ok) {
        Alert.alert(
          "Report Submitted",
          "Your report has been submitted for review."
        );
      } else {
        Alert.alert("Report Failed", "Failed to submit the report.");
      }
    } catch (error) {
      console.error("Error reporting recipe:", error);
      Alert.alert("Error", "An error occurred while submitting the report.");
    }
  };

  // new
  // When the edit icon is clicked
  const handleEditClick = (reviewId, currentReview, currentRating) => {
    setEditingReviewId(reviewId);
    setEditReview(currentReview);
    setEditRating(currentRating);
    setEditModalVisible(true);
  };

  // Submit the edited review
  const submitEditedReview = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/bizrecipe/editRating/${recipeData._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipeId: recipeData._id,
            reviewId: editingReviewId,
            newReview: editReview,
            newRating: Number(editRating),
          }),
        }
      );

      if (response.ok) {
        const updatedRecipeData = await response.json();

        // Update the local state with the new recipe data
        route.params.recipeData = updatedRecipeData;

        // Update the state for reviews with usernames
        const reviewsWithUsernames = await Promise.all(
          updatedRecipeData.reviewsAndRatings.map(async (review) => {
            const username = await fetchUsernameById(review.name);
            return { ...review, username };
          })
        );

        const currentUserReviews = reviewsWithUsernames
          .filter((review) => review.name === currentUser._id)
          .reverse();
        const otherUserReviews = reviewsWithUsernames
          .filter((review) => review.name !== currentUser._id)
          .reverse();

        setSubmittedReviews(otherUserReviews);
        setCurrentUserReviews(currentUserReviews);

        Alert.alert("Success", "Your review has been updated.");
      } else {
        Alert.alert("Error", "Failed to update the review.");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      Alert.alert("Error", "An error occurred while updating the review.");
    }

    // Close the edit modal
    setEditModalVisible(false);
  };

  const confirmDeleteReview = (reviewId) => {
    Alert.alert(
      "Delete Review",
      "Are you sure you want to delete your review?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => deleteReview(reviewId) },
      ],
      { cancelable: false }
    );
  };

  const deleteReview = async (reviewId) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/bizrecipe/deleteRating/${recipeData._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reviewId }),
        }
      );

      if (response.ok) {
        // Update the reviews list
        const updatedReviews = submittedReviews.filter(
          (review) => review._id !== reviewId
        );
        setSubmittedReviews(updatedReviews);

        // Recalculate average rating and total ratings
        const totalRatings = updatedReviews.length;
        const sumRatings = updatedReviews.reduce(
          (acc, curr) => acc + curr.ratings,
          0
        );
        const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

        // Update the state
        route.params.recipeData.averageRating = averageRating;
        route.params.recipeData.totalRatings = totalRatings;

        // Reflect these changes in your component's state
        setCurrentUserReviews([]);
        // Optionally call fetchReviews() if you need to update other parts of the state

        Alert.alert(
          "Review Deleted",
          "Your review has been successfully deleted."
        );
      } else {
        console.log("Printing review Id");
        console.log(reviewId);
        console.log("Printing recipe id");
        console.log(recipeId);
        Alert.alert("Error", "Failed to delete the review.");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      Alert.alert("Error", "An error occurred while deleting the review.");
    }
  };

  const submitReviewAndRating = async () => {
    if (!userReview.trim() || userRating === 0) {
      Alert.alert("Error", "Please enter both review and rating.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/bizrecipe/ratings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: recipeData._id,
            name: currentUser._id,
            reviews: userReview,
            ratings: Number(userRating),
          }),
        }
      );

      if (response.ok) {
        // Assuming you get the updated recipe data in the response
        const updatedRecipeData = await response.json();

        // Update the local state with the new recipe data
        route.params.recipeData = updatedRecipeData;

        // Update the state for reviews with usernames
        const reviewsWithUsernames = await Promise.all(
          updatedRecipeData.reviewsAndRatings.map(async (review) => {
            const username = await fetchUsernameById(review.name);
            return { ...review, username };
          })
        );

        const currentUserReviews = reviewsWithUsernames
          .filter((review) => review.name === currentUser._id)
          .reverse();
        const otherUserReviews = reviewsWithUsernames
          .filter((review) => review.name !== currentUser._id)
          .reverse();

        setSubmittedReviews(otherUserReviews);
        setCurrentUserReviews(currentUserReviews);

        // Reset form fields
        setUserReview("");
        setUserRating("");

        Alert.alert("Success", "Your review has been submitted.");
      } else {
        Alert.alert("Error", "Failed to submit the review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      Alert.alert("Error", "An error occurred while submitting the review.");
    }
  };

  // Function to fetch username based on UserId
  const fetchUsernameById = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/user/getUserById/${userId}`
      );
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const userData = await response.json();
      return userData.username || "Deleted User";
    } catch (error) {
      // console.error("Error fetching user data:", error);
      return "Deleted User";
    }
  };

  // Function to fetch all reviews and update the state with usernames
  const fetchRecipeDataAndUpdateState = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/bizrecipe/getBizRecipeId/${recipeData._id}`
      );
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const data = await response.json();

      // Update the route params with the new recipe data
      route.params.recipeData = data;

      // Update the state for reviews with usernames
      const reviewsWithUsernames = await Promise.all(
        data.reviewsAndRatings.map(async (review) => {
          const username = await fetchUsernameById(review.name);
          return { ...review, username };
        })
      );

      const currentUserReviews = reviewsWithUsernames
        .filter((review) => review.name === currentUser._id)
        .reverse();
      const otherUserReviews = reviewsWithUsernames
        .filter((review) => review.name !== currentUser._id)
        .reverse();

      setSubmittedReviews(otherUserReviews);
      setCurrentUserReviews(currentUserReviews);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  };

  // Use the function in useEffect and useFocusEffect
  useEffect(() => {
    fetchRecipeDataAndUpdateState();
  }, [recipeData._id, currentUser._id]);

  useFocusEffect(
    React.useCallback(() => {
      fetchRecipeDataAndUpdateState();
    }, [])
  );

  const Star = ({ filled, partiallyFilled }) => {
    return (
      <View style={{ position: "relative" }}>
        <Icon name="star-outline" color="grey" size={24} />
        {(filled || partiallyFilled > 0) && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: partiallyFilled ? `${partiallyFilled * 100}%` : "100%",
              overflow: "hidden",
            }}
          >
            <Icon name="star" color="orange" size={24} />
          </View>
        )}
      </View>
    );
  };

  // Function to handle changes in star rating
  const handleRatingChange = (newRating) => {
    setUserRating(newRating);
  };

  const Rating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const partialStar = rating % 1;
    const emptyStars = 5 - fullStars - (partialStar > 0 ? 1 : 0);

    return (
      <View style={{ flexDirection: "row" }}>
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full_${i}`} filled />
        ))}
        {partialStar > 0 && (
          <Star key="partial" partiallyFilled={partialStar} />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty_${i}`} />
        ))}
      </View>
    );
  };

  // StarRatingInput component (centralized)
  const StarRatingInput = ({ maxRating = 5, rating, onRatingChange }) => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        {/* Centering the stars */}
        {[...Array(maxRating)].map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onRatingChange(index + 1)}
          >
            <Icon
              name={index < rating ? "star" : "star-outline"}
              color="orange"
              size={30}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const handleFavoriteIcon = async () => {
    const action = isFavorite ? "remove" : "add";

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/user/updateBizFavorites/${currentUser._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipeId: recipeData._id,
            action: action,
          }),
        }
      );

      if (response.ok) {
        // Update the favorite state locally
        setIsFavorite((prev) => !prev);

        // Update the currentUser context
        const updatedFavorites =
          action === "add"
            ? [...currentUser.favouriteBizRecipes, recipeData._id]
            : currentUser.favouriteBizRecipes.filter(
                (id) => id !== recipeData._id
              );
        setCurrentUser({
          ...currentUser,
          favouriteBizRecipes: updatedFavorites,
        });

        // Notify the user
        if (action === "add") {
          Alert.alert(
            "Added to Favorites",
            "This recipe has been added to your favorites."
          );
        } else {
          Alert.alert(
            "Removed from Favorites",
            "This recipe has been removed from your favorites."
          );
        }
      } else {
        Alert.alert("Error", "Failed to update favorites.");
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      Alert.alert("Error", "An error occurred while updating the favorites.");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const checkIfFavorite = () => {
        const isFav = currentUser.favouriteBizRecipes.includes(recipeData._id);
        setIsFavorite(isFav);
      };

      if (currentUser && recipeData) {
        checkIfFavorite();
      }

      return () => {
        // Optional cleanup if needed
      };
    }, [currentUser, recipeData])
  );

  const handleEditPress = () => {
    navigation.navigate("Edit Business Recipe", { recipeData });
  };

  const handleDeletePress = () => {
    Alert.alert(
      "Delete Recipe",
      "Are you sure you want to delete this recipe?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => deleteRecipe(),
        },
      ]
    );
  };

  const deleteRecipeImageFromStorage = async (imageUrl) => {
    if (!imageUrl) return;

    try {
      // Extract the file path from the image URL
      const imagePath = imageUrl.split("/o/")[1].split("?")[0];
      const decodedPath = decodeURIComponent(imagePath);
      const imageRef = ref(storage, decodedPath);

      // Delete the image
      await deleteObject(imageRef);
      console.log("Image deleted successfully from Firebase Storage.");
    } catch (error) {
      console.error("Error deleting image from Firebase Storage:", error);
    }
  };

  const deleteRecipe = async () => {
    try {
      // Delete the image from Firebase Storage first
      await deleteRecipeImageFromStorage(recipeData.image);

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/bizRecipe/deleteBizRecipe/${recipeData._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      // Navigate back or update the state after successful deletion
      Alert.alert("Success", "Recipe deleted successfully");
      navigation.navigate("View Business Recipe");
    } catch (error) {
      console.error("Error deleting recipe:", error);
      Alert.alert("Error", "Failed to delete recipe");
    }
  };

  return (
    <View style={styles.viewcontainer}>
      <ScrollView>
        <View style={styles.container}>
          <View>
            <View style={styles.infoContainer}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: recipeData.image }} style={styles.image} />
              </View>

              <Text style={styles.title}>{recipeData.name}</Text>

              <View style={styles.horizontalContainer}>
                <View style={styles.starContainer}>
                  <Icon name="star" size={24} color="#ED6F21" />
                  <Text style={styles.ratingText}>
                    {recipeData.averageRating.toFixed(1)}
                  </Text>
                </View>
                
                <View style={styles.verticleLine}></View>
                
                <View style={styles.starContainer}>
                  <Icon name="person" size={24} color="#ED6F21" />

                  <Text style={styles.ratingText}>
                    {recipeData.totalRatings} {recipeData.totalRatings < 2 ? 'review' : 'reviews'}
                  </Text>

                </View>
              </View>

              <View style={styles.componentContainer}>
                  
                <View style={styles.leftComponent}>
                  <IconToo name="users" size={20} color="#ED6F21" style={styles.icons}/>
                  <Text style={styles.smallText}>{recipeData.servings}</Text>
                  <Text style={styles.smallHeadings}>Servings</Text>
                </View>

                <View style={styles.middleComponent}>
                  <IconToo name="clock-o" size={20} color="#ED6F21" style={styles.icons}/>
                  <Text style={styles.smallText}>
                    {recipeData.timeTaken}
                  </Text>
                  <Text style={styles.smallHeadings}>Time Taken</Text>
                </View>

                <View style={styles.rightComponent}>
                  <Icon2 name="fire-alt" size={20} color="#ED6F21" style={styles.icons}/>
                  <Text style={styles.smallText}>
                    {recipeData.calories}
                  </Text>
                  <Text style={styles.smallHeadings}>Calories</Text>
                </View>
              
              </View>
            </View>

            <View style={styles.detailPriceBox}>
              <Text style={styles.subTitle}>Price: </Text>
              <Text style={styles.priceText}>{formatPrice(recipeData.price)}</Text>
            </View>

            {currentUser.foodRestrictions.length > 0 && (
              <View style={styles.detailBox}>
                <Text style={styles.subTitle}>Disclaimer: </Text>
                <Text style={styles.subText}>
                  Based on your medical history, it is recommended to minimize or
                  abstain from using{" "}
                  <Text style={{ color: "#ED6F21", fontWeight: "bold" }}>
                    {currentUser.foodRestrictions.join(", ")}
                  </Text>{" "}
                  when preparing/ordering the recipe.
                </Text>
              </View>
            )}

            <View style={styles.detailBox}>
              <Text style={styles.subTitle}>Ingredients: </Text>
              
              <View style={styles.inAlign}>
                {recipeData.ingredients.map((ingredient, index) => (
                  <View key={index} style={styles.ingredientContainer}>
                    <Text style={styles.ingredientText}>•</Text>
                    <Text style={styles.subText}>{ingredient} </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.detailBox}>
              <Text style={styles.subTitle}>Instructions: </Text>
              
              <View style={styles.inAlign}>
                {recipeData.instructions.map((instruction, index) => (
                  <View key={index}>
                    <View style={styles.ingredientContainer}>
                      <Text style={styles.ingredientText}>•</Text>      
                      <Text style={styles.subText}>Step {index + 1}:</Text>      
                    </View>

                    <View style={styles.ingredientContainer}>
                      <Text style={styles.ingredientText}> </Text>      
                      <Text style={styles.subText}>{instruction}</Text>      
                    </View>
                  </View>
                ))}            
              </View>
            </View>

            {/* "Community Reviews" section */}
            <View  style={styles.detailBox}>
              <Text style={styles.subTitle}>Reviews</Text>

              {submittedReviews.length > 0 ? (
                <View>
                  {submittedReviews.map((review, index) => (
                    <View key={index}>
                      <View style={styles.ratingContainer}>
                        
                        <View style={styles.imageContainer}>
                          <Image source={require("../../assets/person-placeholder.jpg")} style={styles.userImage} />
                        </View>

                        <View style={styles.UserRatingReviewContainer}>
                          <View style={styles.UserRatingContainer}>
                            <Text style={styles.reviewContent1}>
                              {review.username || "Deleted User"}
                            </Text>
                            
                            <View style={styles.starsAndRating}>
                              <Rating rating={review.ratings} />
                              <Text style={styles.ratingNum}>{review.ratings}</Text>
                            </View>
                          </View>

                          <Text style={styles.reviewContent2}>{review.reviews}</Text>
                        </View>
                      </View>

                      <View style={styles.divider}></View>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.mainBox}>
                  <Text style={styles.noReviewsText}>No reviews yet</Text>
                </View>
              )}
            </View>

            <StatusBar style="auto" />
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleEditPress}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.deleteButton]}
          onPress={handleDeletePress}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  reasonsContainer: {
    justifyContent: "flex-start",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F2F2F2",
  },
  image: {
    width: "100%", // Occupy the entire width
    height: 300, // Fixed height
    borderRadius: 20,
  },
  title: {
    color: "#333333",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginRight: 10,
    marginLeft: 10,
  },
  subTitle: {
    fontWeight: "bold",
    fontSize: 20,
    margin: 10,
  },
  noReviewsText: {
    color: "#333",
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    margin: 10,
  },
  ratingText: {
    marginLeft: 8,
    color: "#ED6F21",
  },
  icons: {
    textAlign: "center",
    marginBottom:5
  },
  componentContainer: {
    flexDirection: "row", // Arrange components horizontally from left to right
    justifyContent: "space-between", // Space them evenly
    alignItems: "center", // Center them vertically
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
    alignContent: "center",
  },
  smallHeadings: {
    fontSize: 12,
    textAlign: "center",
  },
  smallText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  infoContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3.84,
    shadowOpacity: 0.25,
    elevation: 5,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },  
  // detailContainer: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   margin: 10,
  //   padding: 16,
  // },
  detailBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3.84,
    shadowOpacity: 0.25,
    elevation: 5,
  },
  detailPriceBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3.84,
    shadowOpacity: 0.25,
    elevation: 5,
  },
  subText: {
    fontSize: 16,
    textAlign: "left",
    margin: 10,
  },
  priceText: {
    fontSize: 20,
    textAlign: "left",
    margin: 10,
  },
  inAlign: {
    marginLeft: 10,
    marginRight: 10,
  },
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    marginBottom: 8,
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    marginRight: 10,
    marginLeft: 10,
    alignItems: "center",
  },
  starsAndRating: {
    alignItems: "center",
    flexDirection: "row",
  },
  reviewContent1: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "bold"
  },
  reviewContent2:{
    color: "#000000",
  },
  ratingNum: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  verticleLine: {
    height: 24,
    width: 1,
    backgroundColor: '#797979',
  },
  ingredientContainer: {
    flexDirection: "row",
  },
  ingredientText: {
    fontSize: 30,
    color: "#FF9130",
  },
  UserRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  UserRatingReviewContainer: {
    gap: 16,
    flex: 1,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    gap: 24,
    backgroundColor: "white",
  },
  viewcontainer: {
    flex: 1,
  },
  button: {
    backgroundColor: "#ED6F21",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
    flex: 1.
  },
  deleteButton: {
    backgroundColor: "#A9A9A9",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
    flex: 1.
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },




});
