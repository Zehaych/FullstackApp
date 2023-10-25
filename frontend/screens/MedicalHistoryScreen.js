import React, { useState } from "react";
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

  const [foodAllergens, setFoodAllergens] = useState([]);

  const [medicalConditions, setMedicalConditions] = useState([]);

  const toggleFoodAllergen = (allergen) => {
    if (foodAllergens.includes(allergen)) {
      setFoodAllergens(foodAllergens.filter((item) => item !== allergen));
    } else {
      setFoodAllergens([...foodAllergens, allergen]);
    }
  };

  const toggleMedicalCondition = (condition) => {
    if (medicalConditions.includes(condition)) {
      setMedicalConditions(
        medicalConditions.filter((item) => item !== condition)
      );
    } else {
      setMedicalConditions([...medicalConditions, condition]);
    }
  };

  const handleSubmit = () => {
    console.log("Food Allergens:", foodAllergens);
    console.log("Medical Conditions:", medicalConditions);

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
          "Had a Stroke",
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
