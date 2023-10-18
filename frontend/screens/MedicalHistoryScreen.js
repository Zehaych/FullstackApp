import React, { useState } from "react";
import {
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
  const [bloodPressure, setBloodPressure] = useState(null);
  const [cholesterolLevel, setCholesterolLevel] = useState(null);
  const [canTakeSpicyFood, setCanTakeSpicyFood] = useState(null);
  const [hasDiabetes, setHasDiabetes] = useState(null);

  const toggleFoodAllergen = (allergen) => {
    if (foodAllergens.includes(allergen)) {
      setFoodAllergens(foodAllergens.filter((item) => item !== allergen));
    } else {
      setFoodAllergens([...foodAllergens, allergen]);
    }
  };

  const handleBloodPressureSelection = (value) => {
    setBloodPressure(value);
  };

  const handleCholesterolLevelSelection = (value) => {
    setCholesterolLevel(value);
  };

  const handleSpicyFoodSelection = (value) => {
    setCanTakeSpicyFood(value);
  };

  const handleDiabetesSelection = (value) => {
    setHasDiabetes(value);
  };

  const handleSubmit = () => {
    console.log("Food Allergens:", foodAllergens);
    console.log("Blood Pressure:", bloodPressure);
    console.log("Cholesterol Level:", cholesterolLevel);
    console.log("Can Take Spicy Food:", canTakeSpicyFood);
    console.log("Has Diabetes:", hasDiabetes);
    if (bloodPressure && cholesterolLevel && canTakeSpicyFood && hasDiabetes) {
      navigation.navigate("SignUpScreen");
    } else {
      alert("Please fill in all fields.");
    }
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

      <Text style={style.label}>Blood Pressure:</Text>
      <RadioButtonGroup
        options={["Low", "Normal", "High"]}
        selectedValue={bloodPressure}
        onValueChange={handleBloodPressureSelection}
      />

      <Text style={style.label}>Cholesterol Level:</Text>
      <RadioButtonGroup
        options={["Low", "Normal", "High"]}
        selectedValue={cholesterolLevel}
        onValueChange={handleCholesterolLevelSelection}
      />

      <Text style={style.label}>Can You Take Spicy Food:</Text>
      <RadioButtonGroup
        options={["Yes", "No"]}
        selectedValue={canTakeSpicyFood}
        onValueChange={handleSpicyFoodSelection}
      />

      <Text style={style.label}>Do You Have Diabetes:</Text>
      <RadioButtonGroup
        options={["Yes", "No"]}
        selectedValue={hasDiabetes}
        onValueChange={handleDiabetesSelection}
      />

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

const RadioButtonGroup = ({ options, selectedValue, onValueChange }) => (
  <View style={style.radioGroup}>
    {options.map((option, index) => (
      <RadioButton
        key={index}
        label={option}
        selected={option === selectedValue}
        onSelect={() => onValueChange(option)}
      />
    ))}
  </View>
);

const RadioButton = ({ label, selected, onSelect }) => (
  <View style={style.radioOption}>
    <Text style={style.radioLabel}>{label}</Text>
    <Button
      title={selected ? "Selected" : "Select"}
      onPress={onSelect}
      color={selected ? "orange" : "#0066cc"}
    />
  </View>
);

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  label: {
    fontSize: 18,
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
    fontSize: 16,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  radioOption: {
    alignItems: "center",
    width: "30%",
  },
  radioLabel: {
    fontSize: 16,
  },
});

export default MedicalHistoryScreen;
