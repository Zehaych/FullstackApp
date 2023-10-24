import React, { useState } from "react";
import { View, TextInput, Button, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { Context } from "../store/context";

const AddRecipeScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [calories, setCalories] = useState("");
  const [image, setImage] = useState(""); // Assuming image is a URL or path

  const [currentUser, setCurrentUser] = useContext(Context);

  const handleSubmit = () => {
    // Handle form submission here
    // You can access the form values in the name, ingredients, instructions, calories, and image variables
    console.log("Name:", name);
    console.log("Ingredients:", ingredients);
    console.log("Instructions:", instructions);
    console.log("Calories:", calories);
    console.log("Image:", image);

    fetch(`${process.env.EXPO_PUBLIC_IP}/recipe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        ingredients: ingredients,
        instructions: instructions,
        calories: calories,
        image: image,
        submitted_by: currentUser._id,
      }),
    })
      .then((res) => {
        console.log(res.status);
        console.log(res.headers);
        return res.json();
      })
      .then(
        (result) => {
          console.log(result);
          // console.warn(result);
          alert("Your recipe has been added into our Members Recipe.");
          navigation.navigate("TabScreen");
        },
        (error) => {
          console.log(error);
          // console.warn(error);
        }
      );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Ingredients"
        value={ingredients}
        onChangeText={(text) => setIngredients(text)}
        multiline={true}
        numberOfLines={4}
      />
      <TextInput
        style={styles.input}
        placeholder="Instructions"
        value={instructions}
        onChangeText={(text) => setInstructions(text)}
        multiline={true}
        numberOfLines={4}
      />
      <TextInput
        style={styles.input}
        placeholder="Calories"
        value={calories}
        onChangeText={(text) => setCalories(text)}
        keyboardType="numeric" // This ensures the keyboard displays numbers
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL or Path"
        value={image}
        onChangeText={(text) => setImage(text)}
      />
      <Image source={{ uri: image }} style={styles.imagePreview} />

      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    marginVertical: 10,
  },
});

export default AddRecipeScreen;
