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

// const [name, setName] = useState("");
// const [review, setReview] = useState("");
// const [rating, setRating] = useState();
// const [currentUser, setCurrentUser] = useContext(Context);
// // const router = useRouter();

// const addReview = (e) => {
//   setReview(e.target.value);
// };

// const addRating = (e) => {
//   setRating(e.target.value);
// };

// const updateReview = async () => {
//   try {
//     if (!review || !rating) {
//       alert("Please fill in all the required fields.");
//       return;
//     }
//     if (rating < 0 || rating > 5) {
//       alert("Rating must be between 0 and 5.");
//       return;
//     }

//     const response = await fetch(
//       `${process.env.EXPO_PUBLIC_IP}/recipe/ratings`,
//       {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           id: router.query.recipeId,
//           name: currentUser._id,
//           reviews: review,
//           ratings: rating,
//         }),
//       }
//     );

//     const data = await response.json();
//     console.log(data); // For debugging purposes only

//     // Check if the update was successful
//     if (response.ok) {
//       console.log("Review updated successfully!");
//       setName("");
//       setReview("");
//       setRating("");
//       alert("Your review has been submitted!");
//       window.location.reload(); // force page to reload
//     } else {
//       console.log("Failed to update review");
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

const AddRatingsScreen = () => {
  return (
    <View>
      <Text style={styles.subTitle}>NutriRizz Community Reviews </Text>

      <View style={styles.mainBox}>
        <View style={styles.section}>
          <Text style={styles.subTitle}>Review: </Text>
          <Text>Enter your review</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.subTitle}>Rating: </Text>
          <Text>Enter your rating</Text>
        </View>
      </View>

      <View style={styles.mainBox}>
        <View style={styles.section}></View>
      </View>
    </View>
  );
};

export default AddRatingsScreen;
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
    width: "80%",
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
});
