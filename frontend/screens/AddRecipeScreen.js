import React, { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { View, TextInput, Button, Image, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { Context } from "../store/context";

const AddRecipeScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);
  const [calories, setCalories] = useState("");
  const [image, setImage] = useState(""); // Assuming image is a URL or path

  const [currentUser, setCurrentUser] = useContext(Context);

  const handleInstructionChange = (text, index) => {
    const newInstruction = [...instructions];
    newInstruction[index] = text;
    setInstructions(newInstruction);
  };

  const addNewInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const handleIngredientChange = (text, index) => {
    const newIngredient = [...ingredients];
    newIngredient[index] = text;
    setIngredients(newIngredient);
  };

  const addNewIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

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
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Text>Add Recipe Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Add Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Text> Ingredients </Text>
        {ingredients.map((ingredient, index) => (
          <View key={index}>
            <Text> Ingredient {index + 1}: </Text>
            <TextInput
              style={styles.input}
              placeholder="Add Ingredient"
              onChangeText={(text) => handleIngredientChange(text, index)}
              value={ingredient}
            />
          </View>
        ))}
        <Button title="Add another ingredient" onPress={addNewIngredient} />

        <Text>Instructions</Text>
        {instructions.map((instructions, index) => (
          <View key={index}>
            <Text> Step {index + 1}: </Text>
            <TextInput
              style={styles.input}
              placeholder="Add Instruction"
              onChangeText={(text) => handleInstructionChange(text, index)}
              value={instructions}
            />
          </View>
        ))}
        <Button title="Add another step" onPress={addNewInstruction} />

        {/* <TextInput
        style={styles.input}
        placeholder="Instructions"
        value={instructions}
        onChangeText={(text) => setInstructions(text)}
        multiline={true}
        numberOfLines={4}
      /> */}
        <Text>Calories</Text>
        <TextInput
          style={styles.input}
          placeholder="Add Calories"
          value={calories}
          onChangeText={(text) => setCalories(text)}
          keyboardType="numeric" // This ensures the keyboard displays numbers
        />
        <Text> Attach Image</Text>
        <TextInput
          style={styles.input}
          placeholder="Image URL or Path"
          value={image}
          onChangeText={(text) => setImage(text)}
        />
        <Image source={{ uri: image }} style={styles.imagePreview} />

        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </KeyboardAwareScrollView>
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
