import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  StatusBar,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Context } from "../../store/context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

export default function ViewBizRecipeInfoScreen({ route }) {
  const navigation = useNavigation();

  const [recipe, setRecipe] = useState(route.params.recipe);
  //   const { recipe } = route.params;
  const [username, setUsername] = useState("");
  const [currentUser, setCurrentUser] = useContext(Context);

  const fetchRecipeDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/bizRecipe/getBizRecipeId/${recipe._id}`
      );
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const updatedRecipe = await response.json();
      setRecipe(updatedRecipe);
      // Fetch username or other necessary data here
    } catch (error) {
      console.error("Error fetching recipe data:", error);
    }
  };

  const fetchUsername = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/user/getUserById/${recipe.submitted_by}`
      );
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const user = await response.json();
      setUsername(user.username);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUsername();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchRecipeDetails();
    }, [])
  );

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const handleEditPress = () => {
    navigation.navigate("Edit Business Recipe", { recipe });
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

  const deleteRecipe = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/bizRecipe/deleteBizRecipe/${recipe._id}`,
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View>
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipe.image }} style={styles.image} />
        </View>
        <Text style={styles.title}>{recipe.name}</Text>

        <View style={styles.mainBox}>
          <View style={styles.section}>
            <Text style={styles.subTitle}>Created by: </Text>
            <Text>{username}</Text>
          </View>

          {/* Display a warning based on user's food restrictions, if any */}
          {currentUser.foodRestrictions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.subTitle}>Disclaimer: </Text>
              <Text>
                Based on your food restrictions, please be cautious with the
                following ingredients:
                <Text style={{ color: "red", fontWeight: "bold" }}>
                  {currentUser.foodRestrictions.join(", ")}
                </Text>
              </Text>
            </View>
          )}

          {/* Ingredients List */}
          <View style={styles.section}>
            <Text style={styles.subTitle}>Ingredients: </Text>
            {recipe.ingredients.map((ingredient, index) => (
              <Text key={index}>• {ingredient}</Text>
            ))}
          </View>

          {/* Cooking Instructions */}
          <View style={styles.section}>
            <Text style={styles.subTitle}>Instructions: </Text>
            {recipe.instructions.map((instruction, index) => (
              <Text key={index}>
                Step {index + 1}: {instruction} {"\n"}
              </Text>
            ))}
          </View>

          {/* Display calories if available */}
          <View style={styles.section}>
            <Text style={styles.subTitle}>Calories: </Text>
            <Text>{recipe.calories || "Not specified"}</Text>
          </View>

          <Text style={styles.subTitle}>Price: </Text>
          <Text>{formatPrice(recipe.price)}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleEditPress}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDeletePress}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 20,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    // marginTop: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    width: 100, // Fixed width for buttons
    alignItems: "center", // Center text inside the button
  },
  deleteButton: {
    backgroundColor: "#FF4136",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  contentContainer: {
    paddingBottom: 30, // Adjust as needed
  },
});
