import React, { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  View,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

const EditRecipeScreen = ({ route }) => {
  const navigation = useNavigation();
  const { recipe } = route.params; // Assuming recipe data is passed as a parameter

  const [name, setName] = useState(recipe.name);
  const [ingredients, setIngredients] = useState(recipe.ingredients);
  const [instructions, setInstructions] = useState(recipe.instructions);
  const [calories, setCalories] = useState(recipe.calories.toString());
  const [image, setImage] = useState(recipe.image);

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

  const removeInstruction = (index) => {
    const newInstructions = [...instructions];
    newInstructions.splice(index, 1);
    setInstructions(newInstructions);
  };

  const removeIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };
  const handleSubmit = () => {
    // Check for empty steps
    if (
      instructions === "" ||
      name === "" ||
      ingredients === "" ||
      calories === "" ||
      image === ""
    ) {
      alert("Please fill in all fields.");
    }

    // Check for empty steps
    else if (instructions.some((step) => step === "")) {
      // Display an error message or prevent submission
      alert(
        "Please fill in all instructions steps and remove the empty steps."
      );
      return;
    } else if (ingredients.some((ingredient) => ingredient === "")) {
      // Display an error message or prevent submission
      alert("Please fill in all ingredients steps and remove the empty steps.");
      return;
    }

    console.log("Name:", name);
    console.log("Ingredients:", ingredients);
    console.log("Instructions:", instructions);
    console.log("Calories:", calories);
    console.log("Image:", image);

    // PUT request to update the recipe
    fetch(`${process.env.EXPO_PUBLIC_IP}/recipe/updateRecipe/${recipe._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        ingredients,
        instructions,
        calories,
        image,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        Alert.alert("Success", "Recipe updated successfully");
        navigation.goBack(); // or navigate to appropriate screen
      })
      .catch((error) => {
        console.error("Error updating recipe:", error);
        Alert.alert("Error", "Failed to update recipe");
      });
  };

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (result.canceled) {
      console.log("Image picker was canceled");
    } else if (result.assets && result.assets.length > 0) {
      // Access the selected image using the assets array
      setImage(result.assets[0].uri);
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Text style={styles.label}>Add Recipe Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Add Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Text style={styles.label}>Ingredients</Text>
        {ingredients.map((ingredient, index) => (
          <View key={index} style={styles.ingredientContainer}>
            <TextInput
              style={styles.ingredientInput}
              placeholder={`Ingredient ${index + 1}`}
              onChangeText={(text) => handleIngredientChange(text, index)}
              value={ingredient}
            />
            <Button
              title="Remove"
              onPress={() => removeIngredient(index)}
              color="red"
            />
          </View>
        ))}
        <Button title="Add Ingredient" onPress={addNewIngredient} />

        <Text style={styles.label}>Instructions</Text>
        {instructions.map((instruction, index) => (
          <View key={index} style={styles.instructionContainer}>
            <TextInput
              style={styles.instructionInput}
              placeholder={`Step ${index + 1}`}
              onChangeText={(text) => handleInstructionChange(text, index)}
              value={instruction}
            />
            <Button
              title="Remove"
              onPress={() => removeInstruction(index)}
              color="red"
            />
          </View>
        ))}
        <Button title="Add Step" onPress={addNewInstruction} />

        <Text style={styles.label}>Calories</Text>
        <TextInput
          style={styles.input}
          placeholder="Add Calories"
          value={calories}
          onChangeText={(text) => setCalories(text)}
          keyboardType="numeric" // This ensures the keyboard displays numbers
        />

        {/* Attach Image Section */}
        <Text style={styles.label}>Attach Image</Text>
        <TouchableOpacity
          style={styles.attachImageContainer}
          onPress={selectImage}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.attachImageText}>Tap to select an image</Text>
          )}
        </TouchableOpacity>

        {/* Space between Attach Image and Submit Button */}
        <View style={styles.space} />

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
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  ingredientContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ingredientInput: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  instructionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  instructionInput: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  attachImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingVertical: 20,
    marginTop: 10,
  },
  attachImageText: {
    fontSize: 16,
    color: "#777",
  },
  imagePreview: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    marginVertical: 10,
  },
  space: {
    marginVertical: 10,
  },
});
export default EditRecipeScreen;
