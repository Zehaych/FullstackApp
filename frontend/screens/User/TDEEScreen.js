import React, { useState, useContext } from "react";
import { Context } from "../../store/context";
import {
  Keyboard,
  StyleSheet,
  View,
  TextInput,
  Button,
  Text,
  ScrollView,
  Dimensions, // Import Dimensions for screen size
  SafeAreaView,
} from "react-native";
import { TouchableRipple } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome';

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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.borderContainer}>
        <Text style={styles.radioLabel}>Age</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={(text) => setAge(text)}
          keyboardType="numeric"
          placeholder=" Enter Age"
          placeholderTextColor="#808080"
        />

        <Text style={styles.radioLabel}>Gender</Text>
        
        <View style={styles.dropdown}>
          <RNPickerSelect
            onValueChange={(itemValue) => setGender(itemValue)}
            items={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
            ]}
            style={{
                inputIOS: { height: 50, width: "100%", paddingHorizontal: 16, fontSize:16, },
                inputAndroid: { height: 50, width: "100%", paddingHorizontal: 16, fontSize:16, },
                placeholder: { color: '#676767', fontSize:16, },
                iconContainer: { 
                  top: 15, right: 18
                },
            }}
            value={gender}
            placeholder={{ label: "Select Gender", value: null, color: '#808080' }}
            useNativeAndroidPickerStyle={false}
            Icon={() => {
              return <Icon name="sort-down" size={16} color="#676767" />;
            }}
          />
        </View>

        <Text style={styles.radioLabel}>Weight</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={(text) => setWeight(text)}
          keyboardType="numeric"
          placeholder=" Enter Weight (in kilograms)"
          placeholderTextColor="#808080"
        />

        <Text style={styles.radioLabel}>Height</Text>
        <TextInput
          style={styles.input}
          value={height}
          onChangeText={(text) => setHeight(text)}
          keyboardType="numeric"
          placeholder=" Enter Height (in centimeters)"
          placeholderTextColor="#808080"
        />
        
        <Text style={styles.radioLabel}>Activity level</Text>
        <View style={styles.dropdown}>
          <RNPickerSelect
            onValueChange={(itemValue) => setActivityLevel(itemValue)}
            items={[
              { label: "Sedentary", value: "sedentary" },
              { label: "Lightly Active", value: "lightly-active" },
              { label: "Moderately Active", value: "moderately-active" },
              { label: "Very Active", value: "very-active" },
              { label: "Extra Active", value: "extra-active" },
            ]}
            style={{
                inputIOS: { height: 50, width: "100%", paddingHorizontal: 16, fontSize:16, },
                inputAndroid: { height: 50, width: "100%", paddingHorizontal: 16, fontSize:16, },
                placeholder: { color: '#676767', fontSize:16, },
                iconContainer: { 
                  top: 15, right: 18
                },
            }}
            value={activityLevel}
            placeholder={{ label: "Select Activity Level", value: null, color: '#808080' }}
            useNativeAndroidPickerStyle={false}
            Icon={() => {
              return <Icon name="sort-down" size={16} color="#676767" />;
            }}
          />
        </View>

        <Text style={styles.radioLabel}>Goal</Text>
        <View style={styles.dropdown}>
          
          <RNPickerSelect
            onValueChange={(itemValue) => setGoal(itemValue)}
            items={[
              { label: "Lose Weight", value: "lose" },
              { label: "Maintain Weight", value: "maintain" },
              { label: "Gain Weight", value: "gain" },
            ]}
            style={{
                inputIOS: { height: 50, width: "100%", paddingHorizontal: 16, fontSize:16, },
                inputAndroid: { height: 50, width: "100%", paddingHorizontal: 16, fontSize:16, },
                placeholder: { color: '#676767', fontSize:16, },
                iconContainer: { 
                  top: 15, right: 18
                },
            }}
            value={goal}
            placeholder={{ label: "Select Goal", value: null, color: '#808080' }}
            useNativeAndroidPickerStyle={false}
            Icon={() => {
              return <Icon name="sort-down" size={16} color="#676767" />;
            }}
          />
        </View>

        <View style={styles.dailyIntake}>
          <Text style={styles.result1}>Daily Intake: </Text>
          <Text style={styles.result2}> {tdee} kcal </Text>
        </View>
        <TouchableRipple onPress={calculateTDEE} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Calculate calorie</Text>
        </TouchableRipple> 
        {calorieCalculated && 
          <TouchableRipple onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableRipple>   
        }
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  borderContainer: {
    borderWidth: 1,
    borderColor: "#dddddd",
    paddingTop: 15,
    paddingRight: 15,
    paddingLeft: 15,
    marginBottom: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: 'white',
  },
  input: {
    marginBottom: 10,
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    color: "#000000",
    borderColor: "#ccc",
    fontSize: 16, // Adjust font size
  },
  dropdown: {
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
  },
  radioLabel: {
    fontWeight: "bold",
    fontSize: 16, // Adjust font size
    marginBottom: 5,
  },
  radioInput: {
    fontSize: 16, // Adjust font size
  },
  result: {
    fontSize: 16, // Adjust font size
    fontWeight: "bold",
    marginTop: 15,
  },
  dailyIntake: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  result1: {
    fontSize: 16, // Adjust font size
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 15,
  },
  result2: {
    //fontSize: window.width > 360 ? 18 : 16, // Adjust font size
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#ED6F21',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default TDEEScreen;
