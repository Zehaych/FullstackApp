import React, { useState, useContext } from "react";
import { Context } from "../store/context";
import {
  Keyboard,
  StyleSheet,
  View,
  TextInput,
  Button,
  Text,
  ScrollView,
  Dimensions, // Import Dimensions for screen size
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const window = Dimensions.get("window");

const TDEEScreen = () => {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useContext(Context);

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [goal, setGoal] = useState("");
  const [tdee, setTDEE] = useState("0");
  const [calorieCalculated, setCalorieCalculated] = useState(false);

  const handleSubmit = () => {
    const updatedUser = { ...currentUser };

    // Update the attributes
    updatedUser.weight = parseFloat(weight);
    updatedUser.height = parseFloat(height);
    updatedUser.age = parseInt(age);
    updatedUser.gender = gender;
    updatedUser.calorie = parseFloat(tdee);

    // Get the user's ID from the currentUser object
    const userId = updatedUser._id;

    // Make a PUT request to update the user's attributes on the server
    fetch(`${process.env.EXPO_PUBLIC_IP}/user/editUserHealth/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        weight: updatedUser.weight,
        height: updatedUser.height,
        age: updatedUser.age,
        gender: updatedUser.gender,
        calorie: updatedUser.calorie,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the server, if needed
        console.log(data);
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        console.error(error);
      });

    setCurrentUser(updatedUser);

    alert("Successfully updated your calorie intake.");
    navigation.navigate("TabScreen");
  };

  const calculateTDEE = () => {
    // Check if essential fields are empty
    if (
      weight === "" ||
      height === "" ||
      age === "" ||
      gender === "" ||
      activityLevel === "" ||
      goal === ""
    ) {
      alert("Please fill in all fields.");
    } else {
      let formulaResult = 0;
      if (gender === "Male") {
        formulaResult =
          10 * parseFloat(weight) +
          6.25 * parseFloat(height) -
          5 * parseInt(age) +
          5;
      } else if (gender === "Female") {
        formulaResult =
          10 * parseFloat(weight) +
          6.25 * parseFloat(height) -
          5 * parseInt(age) -
          161;
      }
      switch (activityLevel) {
        case "sedentary":
          formulaResult *= 1.2;
          break;
        case "lightly-active":
          formulaResult *= 1.35;
          break;
        case "moderately-active":
          formulaResult *= 1.48;
          break;
        case "very-active":
          formulaResult *= 1.6;
          break;
        case "extra-active":
          formulaResult *= 1.8;
          break;
        default:
          break;
      }

      switch (goal) {
        case "lose":
          formulaResult -= 200;
          break;
        case "gain":
          formulaResult += 200;
          break;
        default:
          break;
      }

      setTDEE(formulaResult.toFixed(2).toString());
      setCalorieCalculated(true);
      Keyboard.dismiss();
    }
  };

  return (
    <ScrollView style={style.container}>
      <TextInput
        style={style.input}
        value={weight}
        onChangeText={(text) => setWeight(text)}
        keyboardType="numeric"
        placeholder="Weight (in kilograms)"
      />
      <TextInput
        style={style.input}
        value={height}
        onChangeText={(text) => setHeight(text)}
        keyboardType="numeric"
        placeholder="Height (in centimeters)"
      />
      <TextInput
        style={style.input}
        value={age}
        onChangeText={(text) => setAge(text)}
        keyboardType="numeric"
        placeholder="Age"
      />
      <Text style={style.radioLabel}>Select your gender:</Text>
      <Button
        title="Male"
        onPress={() => setGender("Male")}
        color={gender === "Male" ? "orange" : "#0066cc"}
      />
      <Button
        title="Female"
        onPress={() => setGender("Female")}
        color={gender === "Female" ? "orange" : "#0066cc"}
      />
      <Text style={style.radioInput}>Select your activity level:</Text>
      <Button
        title="Sedentary"
        onPress={() => setActivityLevel("sedentary")}
        color={activityLevel === "sedentary" ? "orange" : "#0066cc"}
      />
      <Button
        title="Lightly Active"
        onPress={() => setActivityLevel("lightly-active")}
        color={activityLevel === "lightly-active" ? "orange" : "#0066cc"}
      />
      <Button
        title="Moderately Active"
        onPress={() => setActivityLevel("moderately-active")}
        color={activityLevel === "moderately-active" ? "orange" : "#0066cc"}
      />
      <Button
        title="Very Active"
        onPress={() => setActivityLevel("very-active")}
        color={activityLevel === "very-active" ? "orange" : "#0066cc"}
      />
      <Button
        title="Extra Active"
        onPress={() => setActivityLevel("extra-active")}
        color={activityLevel === "extra-active" ? "orange" : "#0066cc"}
      />
      <Text style={style.radioLabel}>Select your goal:</Text>
      <Button
        title="Lose Weight"
        onPress={() => setGoal("lose")}
        color={goal === "lose" ? "orange" : "#0066cc"}
      />
      <Button
        title="Maintain Weight"
        onPress={() => setGoal("maintain")}
        color={goal === "maintain" ? "orange" : "#0066cc"}
      />
      <Button
        title="Gain Weight"
        onPress={() => setGoal("gain")}
        color={goal === "gain" ? "orange" : "#0066cc"}
      />
      <Text style={style.radioLabel}></Text>
      <Button title="Calculate calorie" onPress={calculateTDEE} />
      <Text style={style.result}> Your daily calorie intake is: {tdee}</Text>
      {calorieCalculated && <Button title="Submit" onPress={handleSubmit} />}
    </ScrollView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  input: {
    marginBottom: 10,
    padding: 3,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: window.width > 360 ? 16 : 14, // Adjust font size
  },
  radioLabel: {
    fontSize: window.width > 360 ? 16 : 14, // Adjust font size
  },
  radioInput: {
    fontSize: window.width > 360 ? 16 : 14, // Adjust font size
  },
  result: {
    fontSize: window.width > 360 ? 18 : 16, // Adjust font size
    fontWeight: "bold",
    marginTop: 15,
  },
});

export default TDEEScreen;
