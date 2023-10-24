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

export default function BusinessRecipeInfoScreen({ route, navigation }) {
  const { recipeData } = route.params;
  const [username, setUsername] = useState("");

  const navigateToPayment = () => {
    navigation.navigate("Payment");
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipeData.image }} style={styles.image} />
        </View>
        <Text style={styles.title}>{recipeData.name}</Text>
        <Text style={styles.subTitle}>Company name: </Text>
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
        <Text style={styles.subTitle}>Price: </Text>
        <Text>${recipeData.price}</Text>

        <StatusBar style="auto" />
      </View>
      {/* Add the "Prepare this meal for me" button */}
      {/* <Button
        title="Prepare this meal for me"
        onPress={() => {
          // Handle button click action here
          // You can add logic for preparing the meal
        }}
      /> */}
      <TouchableOpacity style={styles.button} onPress={navigateToPayment}>
        <Text style={styles.buttonText}>Prepare this meal for me</Text>
      </TouchableOpacity>
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
});
