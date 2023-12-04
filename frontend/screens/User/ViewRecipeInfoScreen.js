import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  StatusBar,
} from "react-native";
import { Context } from "../../store/context";

export default function ViewRecipeInfoScreen({ route }) {
  const { recipe } = route.params;
  const [username, setUsername] = useState("");
  const [currentUser, setCurrentUser] = useContext(Context);

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

  return (
    <ScrollView style={styles.container}>
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
                Step {index + 1}: {instruction}
              </Text>
            ))}
          </View>

          {/* Display calories if available */}
          <Text style={styles.subTitle}>Calories: </Text>
          <Text>{recipe.calories || "Not specified"}</Text>
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
});
