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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { Context } from "../../store/context";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../../services/firebase";
import { TouchableRipple } from "react-native-paper";
import Icon from 'react-native-vector-icons/Feather';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const AddRecipeScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);
  const [calories, setCalories] = useState("");
  const [servings, setServings] = useState("");
  const [timeTaken, setTimeTaken] = useState("");
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

  const handleSubmit = async () => {
    // Handle form submission here
    // You can access the form values in the name, ingredients, instructions, calories, and image variables

    // Check for empty steps
    if (
      instructions === "" ||
      name === "" ||
      ingredients === "" ||
      calories === "" ||
      servings === "" ||
      timeTaken === "" ||
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
    console.log("Servings:", servings);
    console.log("Time Taken:", timeTaken);
    console.log("Image:", image);

    try {
      // Upload the image first and get the URL
      const imageUrl = await uploadImage(image);

      // Use the `imageUrl` in the POST request
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
          servings: servings,
          timeTaken: timeTaken,
          image: imageUrl, // Use imageUrl here instead of local URI
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
            alert("Your recipe has been added into our Members Recipe.");
            navigation.navigate("TabScreen");
          },
          (error) => {
            console.error(error);
          }
        );
    } catch (error) {
      console.error("Error uploading image or submitting form: ", error);
      alert("Error uploading image or submitting form: ", error);
    }
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

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const filename = uri.substring(uri.lastIndexOf("/") + 1);
      const storageRef = ref(storage, `images/${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, blob);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    } catch (error) {
      console.error("Error uploading image: ", error);
      throw error;
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <View style={styles.detailBox}>
          <Text style={styles.label}>Recipe Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Add Name"
            value={name}
            onChangeText={(text) => setName(text)}
            placeholderTextColor="#808080"
          />

          <Text style={styles.label}>Servings</Text>
          <TextInput
            style={styles.input}
            placeholder="Add Servings"
            value={servings}
            onChangeText={(text) => setServings(text)}
            keyboardType="numeric" // This ensures the keyboard displays numbers
            placeholderTextColor="#808080"
          />

          <Text style={styles.label}>Calories</Text>
          <TextInput
            style={styles.input}
            placeholder="Add Calories"
            value={calories}
            onChangeText={(text) => setCalories(text)}
            keyboardType="numeric" // This ensures the keyboard displays numbers
            placeholderTextColor="#808080"
          />        

          <Text style={styles.label}>Time Taken</Text>
          <TextInput
            style={styles.input}
            placeholder="Add Time Taken (in minutes)"
            value={timeTaken}
            onChangeText={(text) => setTimeTaken(text)}
            keyboardType="numeric" // This ensures the keyboard displays numbers
            placeholderTextColor="#808080"
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
              <Text style={styles.attachImageText}> + Tap to select an image </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.detailBox} >
          <Text style={styles.label}>Ingredients</Text>
          {ingredients.map((ingredient, index) => (
            <View key={index}>
              <View style={styles.ingredientContainer}>
                <TextInput
                  style={styles.ingredientInput}
                  placeholder={`Ingredient ${index + 1}`}
                  onChangeText={(text) => handleIngredientChange(text, index)}
                  value={ingredient}
                  placeholderTextColor="#808080"
                />
                <TouchableOpacity onPress={() => removeIngredient(index)} style={styles.deleteIcon}>
                  <Icon name="x" size={20} color="red" />
                </TouchableOpacity>
              </View>
              <View style={styles.divider} />
            </View>
          ))}
          <TouchableRipple onPress={addNewIngredient} style={styles.addButton}>
            <Text style={styles.buttonText}>+ Add Ingredient</Text>
          </TouchableRipple>
        </View>
        
        <View style={styles.detailBox}>
          <Text style={styles.label}>Instructions</Text>
          {instructions.map((instruction, index) => (
            <View key={index}>
              <View style={styles.instructionContainer}>
                <TextInput
                  style={styles.instructionInput}
                  placeholder={`Step ${index + 1}`}
                  onChangeText={(text) => handleInstructionChange(text, index)}
                  value={instruction}
                  placeholderTextColor="#808080"
                />
                <TouchableOpacity onPress={() => removeInstruction(index)} style={styles.deleteIcon}>
                  <Icon name="x" size={20} color="red" />
                </TouchableOpacity>

              </View>
              <View style={styles.divider} />
            </View>
          ))}
          <TouchableRipple onPress={addNewInstruction} style={styles.addButton}>
            <Text style={styles.buttonText}>+ Add Step</Text>
          </TouchableRipple>
        </View>

        <TouchableRipple onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableRipple>
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
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#C6C6CD",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  ingredientContainer: {
    flexDirection: "row",
    alignItems: "center",
    //justifyContent: "center",
  },
  ingredientInput: {
    flex: 1,
    height: 40,
    //borderColor: "gray",
    //borderRadius: 5,
    //borderWidth: 1,
    paddingHorizontal: 10,
  },
  instructionContainer: {
    flexDirection: "row",
    alignItems: "center",
    //justifyContent: "center",
  },
  instructionInput: {
    flex: 1,
    height: 40,
    //borderColor: "gray",
    //borderRadius: 5,
    //borderWidth: 1,
    paddingHorizontal: 10,
  },
  attachImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    // paddingVertical: 20,
    borderStyle: "dashed",
  },
  attachImageText: {
    fontSize: 16,
    color: "#777",
    paddingVertical: 20,
  },
  imagePreview: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    marginVertical: 10,
  },
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
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 10,
    backgroundColor: "#ED6F21",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  submitButton: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 10,
    backgroundColor: "#ED6F21",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deleteIcon: {
    marginLeft: 10,
    marginRight: 5,
  },
  divider: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
});

export default AddRecipeScreen;
