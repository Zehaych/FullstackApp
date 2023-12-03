import React, { useState, useContext } from "react";
import { Context } from "../store/context";
import {
  Keyboard,
  StyleSheet,
  View,
  Text,
  Button,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const window = Dimensions.get("window");

const MedicalHistoryScreen = () => {
  const navigation = useNavigation();

  const [currentUser, setCurrentUser] = useContext(Context);

  const [foodAllergens, setFoodAllergens] = useState([]);

  const [medicalConditions, setMedicalConditions] = useState([]);

  const toggleFoodAllergen = (allergen) => {
    if (foodAllergens.includes(allergen)) {
      setFoodAllergens(foodAllergens.filter((item) => item !== allergen));
    } else {
      setFoodAllergens([...foodAllergens, allergen]);
    }
  };

  // Define a mapping of medical conditions
  const medicalConditionAllergies = {
    "High Blood Pressure": ["Sodium", "Saturated Fat", "Sugar"],
    "Heart Disease": ["Sodium", "Saturated Fat", "Sugar", "Cholesterol"],
    "Digestive Problems": ["Spicy"],
    "Kidney Damage": ["Sodium", "Sugar"],
    Stroke: ["Sodium", "Saturated Fat", "Sugar"],
    "High Cholesterol Level": ["Saturated Fat", "Cholesterol"],
    "Liver Damage": ["Saturated Fat", "Sugar", "Cholesterol"],
    Diabetes: ["Sugar"],
  };

  const toggleMedicalCondition = (condition) => {
    // Get the allergies associated with the selected medical condition
    const allergiesToAdd = medicalConditionAllergies[condition] || [];

    // Filter out any existing allergies that are also in the selected allergies list
    const newAllergies = foodAllergens.filter(
      (allergen) => !allergiesToAdd.includes(allergen)
    );

    // Add the selected allergies to the array
    setFoodAllergens([...newAllergies, ...allergiesToAdd]);

    // Update the list of selected medical conditions
    if (medicalConditions.includes(condition)) {
      // If the condition is already selected, remove it
      setMedicalConditions(
        medicalConditions.filter((item) => item !== condition)
      );
    } else {
      // If the condition is not selected, add it
      setMedicalConditions([...medicalConditions, condition]);
    }
  };

  const handleSubmit = () => {
    console.log("Food restrictions:", foodAllergens);
    console.log("Medical Conditions:", medicalConditions);

    const updatedUser = { ...currentUser };

    // Add the selected foodAllergens and medicalConditions to the array
    updatedUser.foodRestrictions = [...foodAllergens];
    updatedUser.medicalHistory = [...medicalConditions];

    // Add the selected foodAllergens and medicalConditions to the array
    updatedUser.allergies = [...foodAllergens];

    const conditionsToRemove = [
      "Sodium",
      "Saturated Fat",
      "Sugar",
      "Cholesterol",
      "Spicy",
    ];

    // Filter out the conditions to remove from updatedUser.allergies
    updatedUser.allergies = updatedUser.allergies.filter(
      (allergy) => !conditionsToRemove.includes(allergy)
    );

    // Get the user's ID from the currentUser object
    const userId = updatedUser._id;

    // Make a PUT request to update the user's information on the server
    fetch(`${process.env.EXPO_PUBLIC_IP}/user/editUserHealth/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        allergies: updatedUser.allergies,
        medicalHistory: updatedUser.medicalHistory,
        foodRestrictions: updatedUser.foodRestrictions,
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

    alert(
      "Successfully updated your Medical History. Generated meal plans will now filter your recipes based on your submitted entry."
    );
    navigation.navigate("TabScreen");
  };

  return (
    <ScrollView contentContainerStyle={style.container}>
      <Text style={style.label}>Food Allergens (skip if inapplicable):</Text>
      <View style={style.checkboxGroup}>
        {[
          "Dairy",
          "Egg",
          "Gluten",
          "Grain",
          "Peanut",
          "Seafood",
          "Sesame",
          "Shellfish",
          "Soy",
          "Sulfite",
          "Tree Nut",
          "Wheat",
        ].map((option, index) => (
          <CheckboxOption
            key={index}
            label={option}
            selected={foodAllergens.includes(option)}
            onSelect={() => toggleFoodAllergen(option)}
          />
        ))}
      </View>

      <Text style={style.label}>
        Medical Conditions (skip if inapplicable):
      </Text>
      <View style={style.checkboxGroup}>
        {[
          "High Blood Pressure",
          "High Cholesterol Level",
          "Digestive Problems",
          "Heart Disease",
          "Kidney Damage",
          "Liver Damage",
          "Diabetes",
          "Stroke",
        ].map((option, index) => (
          <CheckboxOption
            key={index}
            label={option}
            selected={medicalConditions.includes(option)}
            onSelect={() => toggleMedicalCondition(option)}
          />
        ))}
      </View>

      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
};

const CheckboxOption = ({ label, selected, onSelect }) => (
  <View style={style.checkboxOption}>
    <Text style={style.checkboxLabel}>{label}</Text>
    <Button
      title={selected ? "Selected" : "Select"}
      onPress={onSelect}
      color={selected ? "orange" : "#0066cc"}
    />
  </View>
);

const style = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  label: {
    fontSize: window.width > 360 ? 18 : 16,
    fontWeight: "bold",
  },
  checkboxGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  checkboxOption: {
    alignItems: "center",
    width: window.width > 360 ? "30%" : "45%",
  },
  checkboxLabel: {
    fontSize: window.width > 360 ? 16 : 14,
  },
});
export default MedicalHistoryScreen;
