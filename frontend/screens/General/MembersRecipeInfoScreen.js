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
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/context";
import AddRatingsScreen from "../User/AddRatingsScreen";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import MaskedView from "@react-native-masked-view/masked-view";

export default function MembersRecipeInfoScreen({ route }) {
  const recipeData = route.params.recipeData;
  const [username, setUsername] = useState("");

  // new
  const [userReview, setUserReview] = useState("");
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

  const handleReasonPress = (reason) => {
    setReportReason(reason);
    setActiveReason(reason);
  };

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
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUsername("Unknown User"); // Fallback username
      }
    };

    if (recipeData && recipeData.submitted_by) {
      fetchUsername();
    }
  }, [recipeData]);

  // const fetchUsernames = async (reviews) => {
  //   const userIds = reviews.map((review) => review.name);
  //   const uniqueUserIds = [...new Set(userIds)]; // Remove duplicates
  //   const usernamesMap = {};

  //   await Promise.all(
  //     uniqueUserIds.map(async (userId) => {
  //       try {
  //         const response = await fetch(
  //           `${process.env.EXPO_PUBLIC_IP}/user/getUserById/${userId}`
  //         );
  //         if (!response.ok) {
  //           throw new Error(`Network response was not ok: ${response.status}`);
  //         }
  //         const userData = await response.json();
  //         usernamesMap[userId] = userData.username;
  //       } catch (error) {
  //         console.error("Error fetching user data:", error);
  //         usernamesMap[userId] = "Unknown"; // Fallback username
  //       }
  //     })
  //   );

  //   return reviews.map((review) => ({
  //     ...review,
  //     username: usernamesMap[review.name] || "Unknown",
  //   }));
  // };

  // useEffect(() => {
  //   fetchUsernames();
  // }, []);

  const reportRecipe = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/recipe/reportRecipe/${recipeData._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Include any necessary headers, like authorization tokens
          },
          body: JSON.stringify({
            userId: currentUser._id, // Assuming you have the current user's ID
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
        `${process.env.EXPO_PUBLIC_IP}/recipe/editRating/${recipeData._id}`,
        {
          method: "PATCH", // Or POST, depending on your backend setup
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
        `${process.env.EXPO_PUBLIC_IP}/recipe/deleteRating/${recipeData._id}`,
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
        `${process.env.EXPO_PUBLIC_IP}/recipe/ratings`,
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
      return userData.username;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  // Function to fetch all reviews and update the state with usernames
  const fetchRecipeDataAndUpdateState = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/recipe/getRecipeId/${recipeData._id}`
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

  // Use the function in useEffect or useFocusEffect
  useEffect(() => {
    fetchRecipeDataAndUpdateState();
  }, [recipeData._id, currentUser._id]);

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

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => setReportModalVisible(true)}
      >
        <View>
          <Icon name="report" color="#FF6347" size={25} style={styles.icon} />
        </View>
      </TouchableOpacity>
      <View>
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipeData.image }} style={styles.image} />
        </View>
        <Text style={styles.title}>{recipeData.name}</Text>

        <View style={styles.ratingContainer}>
          <Rating rating={recipeData.averageRating} />
          <Text style={styles.ratingText}>
            {recipeData.averageRating.toFixed(1)}
          </Text>
        </View>
        <View style={styles.ratingContainer}>
          <Icon name="person" size={24} color="#333333" />
          <Text style={{ marginLeft: 8 }}>
            {recipeData.totalRatings} people rated
          </Text>
        </View>
        <View style={styles.mainBox}>
          <View style={styles.section}>
            <Text style={styles.subTitle}>Created by: </Text>
            <Text>{username}</Text>
          </View>

          {currentUser.foodRestrictions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.subTitle}>Disclaimer: </Text>
              <Text>
                Based on your medical history, it is recommended to minimize or
                abstain from using{" "}
                <Text style={{ color: "red", fontWeight: "bold" }}>
                  {currentUser.foodRestrictions.join(", ")}
                </Text>{" "}
                when preparing the recipe. {"\n"}
              </Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.subTitle}>Ingredients: </Text>
            {recipeData.ingredients.map((ingredient, index) => (
              <Text key={index}>• {ingredient} </Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.subTitle}>Instructions: </Text>
            {recipeData.instructions.map((instruction, index) => (
              <Text key={index}>
                <Text style={styles.boldText}>Step {index + 1}:</Text>{" "}
                {instruction} {"\n"}
              </Text>
            ))}
          </View>

          <Text style={styles.subTitle}>Calories: </Text>
          <Text>{recipeData.calories}</Text>
        </View>
        {/* <AddRatingsScreen /> */}
        {currentUserReviews.length === 0 && (
          <Text style={styles.title}>Recipe Review </Text>
        )}

        {/* Only show review submission form if the user hasn't submitted a review yet */}
        {currentUserReviews.length === 0 && (
          <View style={styles.mainBox}>
            <View style={styles.section}>
              <TextInput
                style={styles.input}
                placeholder="Enter your review"
                value={userReview}
                onChangeText={setUserReview}
                multiline
              />
              <StarRatingInput
                rating={userRating}
                onRatingChange={handleRatingChange}
              />
              <Button title="Submit Review" onPress={submitReviewAndRating} />
            </View>
          </View>
        )}

        {/* "Your Review" section */}
        {currentUserReviews.length > 0 && (
          <View>
            <Text style={styles.title}>
              Your Review{" "}
              <TouchableOpacity
                onPress={() =>
                  handleEditClick(
                    currentUserReviews[0]._id,
                    currentUserReviews[0].reviews,
                    currentUserReviews[0].ratings
                  )
                }
                style={styles.editIcon}
              >
                <Icon name="edit" size={24} color="#FF6347" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => confirmDeleteReview(currentUserReviews[0]._id)}
                style={styles.deleteIcon}
              >
                <Icon name="delete" size={24} color="#FF6347" />
              </TouchableOpacity>
            </Text>

            {currentUserReviews.map((review, index) => (
              <View key={index} style={styles.mainBox}>
                <View style={styles.section}>
                  <Text style={styles.reviewLabel}>Name:</Text>
                  <Text style={styles.reviewContent}>{review.username}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.reviewLabel}>Review:</Text>
                  <Text style={styles.reviewContent}>{review.reviews}</Text>
                </View>

                <Text style={styles.reviewLabel}>Rating:</Text>
                <Text style={styles.reviewContent}>{review.ratings}</Text>
                {/* Edit icon */}
              </View>
            ))}
          </View>
        )}

        {/* "Community Reviews" section */}
        <Text style={styles.title}>Community Reviews</Text>
        {submittedReviews.length > 0 ? (
          // <View style={styles.mainBox}>
          <View style={styles.submittedReviewsContainer}>
            {submittedReviews.map((review, index) => (
              <View key={index} style={styles.mainBox}>
                <View style={styles.section}>
                  <Text style={styles.reviewLabel}>Name:</Text>
                  <Text style={styles.reviewContent}>{review.username}</Text>
                </View>

                <View style={styles.section}>
                  <Text style={styles.reviewLabel}>Review:</Text>
                  <Text style={styles.reviewContent}>{review.reviews}</Text>
                </View>

                <Text style={styles.reviewLabel}>Rating:</Text>
                <Text style={styles.reviewContent}>{review.ratings}</Text>
              </View>
            ))}
          </View>
        ) : (
          // </View>
          <View style={styles.mainBox}>
            <Text style={styles.noReviewsText}>No reviews yet</Text>
          </View>
        )}

        <StatusBar style="auto" />
      </View>
      {/* Edit Review Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="Edit your review"
              value={editReview}
              onChangeText={setEditReview}
              multiline
            />
            {/* Star rating input for editing rating */}
            <StarRatingInput
              rating={editRating}
              onRatingChange={(newRating) => setEditRating(newRating)}
            />
            {/* Save Changes Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={submitEditedReview}
            >
              <Text style={styles.submitButtonText}>Save Changes</Text>
            </TouchableOpacity>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.secondButton}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.submitButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={reportModalVisible}
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.reasonsContainer}>
              {reportReasons.map((reason, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.reasonButton,
                    activeReason === reason ? styles.activeReasonButton : null,
                  ]}
                  onPress={() => handleReasonPress(reason)}
                >
                  <Text
                    style={[
                      styles.reasonButtonText,
                      activeReason === reason
                        ? styles.activeReasonButtonText
                        : null,
                    ]}
                  >
                    {reason}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Additional details (optional)"
              value={additionalDetails}
              onChangeText={setAdditionalDetails}
              multiline
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                setReportModalVisible(false);
                reportRecipe();
              }}
            >
              <Text style={styles.submitButtonText}>Submit Report</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondButton}
              onPress={() => {
                setReportModalVisible(false);
              }}
            >
              <Text style={styles.submitButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  reasonsContainer: {
    justifyContent: "flex-start",
  },
  reasonButton: {
    padding: 10,
    marginBottom: 10, // Space between buttons
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  activeReasonButton: {
    backgroundColor: "#e0e0e0", // Example background color for active button
  },
  reasonButtonText: {
    color: "black",
    fontSize: 16,
    // Other text styling as needed
  },
  activeReasonButtonText: {
    fontWeight: "bold", // Bold text for active button
  },
  icon: {
    marginRight: 16,
  },
  menuItem: {
    marginTop: 15,
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
  },
  menuItemText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: "center", // Center the modal horizontally
    marginTop: "50%", // Adjust as needed to center the modal vertically
  },

  submitButton: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    marginBottom: 10,
  },
  secondButton: {
    backgroundColor: "blue",
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    marginBottom: 10,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    marginBottom: 10,
  },
  reportButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "80%",
    marginBottom: 20,
  },
  reportButtonText: {
    color: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "#FCFCD3",
    padding: 20,

    //alignItems: "center",
  },
  //style for the image
  imageContainer: {
    flex: 1,
    justifyContent: "center", // Center the image vertically
    alignItems: "center", // Center the image horizontally
    padding: 10,
  },
  image: {
    flex: 1,
    width: 310,
    height: 310,
    resizeMode: "contain",
    borderRadius: 20,
  },
  title: {
    color: "#333333",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  subTitle: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  mainBox: {
    borderWidth: 2,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    padding: 10,
    marginBottom: 30,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    paddingBottom: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    paddingBottom: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
  // submittedReviewsContainer: {
  //   marginTop: 20,
  // },
  reviewItem: {
    // backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  reviewLabel: {
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  reviewContent: {
    color: "#333",
    marginBottom: 5,
  },
  reviewText: {
    fontSize: 14,
  },
  noReviewsText: {
    color: "#333",
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  ratingText: {
    marginLeft: 8,
  },
});
