import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";

export default function MembersRecipeInfoScreen({ route }) {
  const { recipeData } = route.params;
  const [username, setUsername] = useState("");

  const fetchUsername = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/user/getUserById/${recipeData.submitted_by}`
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
          <Image source={{ uri: recipeData.image }} style={styles.image} />
        </View>
        <Text style={styles.title}>{recipeData.name}</Text>
        <Text style={styles.subTitle}>Created by: </Text>
        <Text>{username}</Text>
        <Text style={styles.subTitle}>Ingredients: </Text>
        <Text>
          {recipeData.ingredients.map((ingredient, index) => (
            <Text key={index}>{ingredient}, </Text>
          ))}
        </Text>
        <Text style={styles.subTitle}>Instructions: </Text>
        <Text>{recipeData.instructions}</Text>
        <Text style={styles.subTitle}>Calories: </Text>
        <Text>{recipeData.calories}</Text>
        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCD3",
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
    width: 400,
    height: 400,
    resizeMode: "contain",
  },
  title: {
    color: "gold",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  subTitle: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
});
