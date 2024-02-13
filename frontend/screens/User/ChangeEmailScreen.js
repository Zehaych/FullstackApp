import React, { useState, useContext } from "react";
import { Context } from "../../store/context";
import {
  Keyboard,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const ChangeEmailScreen = () => {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useContext(Context);
  const [newEmail, setNewEmail] = useState("");

  const [password, setPassword] = useState("");

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const updatedUser = { ...currentUser }; // Create a copy of currentUser

  const handleEmailChange = () => {
    if (!currentUser || !currentUser._id) {
      console.log("No valid current user found");
    } else {
      console.log("User found!");
    }
    if (!newEmail) {
      // Check if newEmail is empty and show an alert
      alert("Please enter an email."); // Prompt the user that empty email is not allowed
      return; // Exit the function without making the API call
    }
    const userId = updatedUser._id; // Get the user's ID from updatedUser

    updatedUser.email = newEmail; // Update email in updatedUser

    fetch(`${process.env.EXPO_PUBLIC_IP}/user/editEmail/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: newEmail, // Send the new email in the request body
        password: password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          // Check if response status is in the range 200-299
          return response.json();
        } else if (response.status === 401) {
          // Check if status code is 401 (Unauthorized)
          throw new Error("Invalid password. Please try again.");
        } else if (response.status === 400) {
          // Handle 400 Bad Request errors
          return response.json().then((data) => {
            throw new Error(data.message);
          });
        } else {
          // Handle other error scenarios
          throw new Error("An error occurred while updating the email.");
        }
      })
      .then((data) => {
        // Handle the successful response from the server
        console.log(data);
        setCurrentUser(updatedUser); // Update currentUser in local state with updatedUser
        alert("Successfully updated your email!");
        navigation.navigate("TabScreen");
      })
      .catch((error) => {
        // Handle any errors that occur during the request
        // console.error(error);
        alert(error.message); // Display the error message to the user
      });
  };

  return (
    <View style={styles.container}>

        {/* New Email */}
      <View>
        <Text style={styles.title}>New Email</Text>
        <TextInput
          style={styles.input}
          placeholder="New Email"
          value={newEmail}
          onChangeText={(text) => setNewEmail(text)}
          keyboardType="email-address"
        />
      </View>
      
      {/* Password */}
      <View>
        <Text style={styles.title}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password to verify identity"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      
      {/* <Button title="Update email" color="#ED6F21" onPress={handleEmailChange} /> */}

      <TouchableOpacity style={styles.updatebutton} onPress={handleEmailChange}>
        <Text style={styles.updatebuttonText}>Update email</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "right",
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 20,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: {
    width: 0,
    height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    width: "100%",
    borderRadius: 5,
  },
  updatebutton: {
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#ED6F21',
    padding: 10,
  },
  updatebuttonText: {
    color: "#FFF",
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default ChangeEmailScreen;
