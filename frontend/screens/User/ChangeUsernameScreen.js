import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Context } from "../../store/context";

const ChangeUsernameScreen = () => {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useContext(Context);
  const [newUsername, setNewUsername] = useState("");

  const [password, setPassword] = useState("");

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const updatedUser = { ...currentUser }; // Create a copy of currentUser

  const handleUsernameChange = () => {
    if (!newUsername) {
      // Check if newUsername is empty and show an alert
      alert("Please enter a username."); // Prompt the user that empty username is not allowed
      return; // Exit the function without making the API call
    }
    const userId = updatedUser._id; // Get the user's ID from updatedUser

    updatedUser.username = newUsername; // Update username in updatedUser

    fetch(`${process.env.EXPO_PUBLIC_IP}/user/editUsername/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: newUsername, // Send the new username in the request body
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
          throw new Error("An error occurred while updating the username.");
        }
      })
      .then((data) => {
        // Handle the successful response from the server
        console.log(data);
        setCurrentUser(updatedUser); // Update currentUser in local state with updatedUser
        alert("Successfully updated your username!");
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

      {/* New UserName */}
      <View style={styles.detailContainer}>
        <Text style={styles.title}>New Username</Text>
        <TextInput
          style={styles.input}
          placeholder="New username"
          value={newUsername}
          onChangeText={(text) => setNewUsername(text)}
        />
      </View>
        
      {/* Password */}
      <View style={styles.detailContainer}>
        <Text style={styles.title}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password to verify identity"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />
      </View>
    
      {/* <Button title="Update Username" onPress={handleUsernameChange} /> */}

      <TouchableOpacity style={styles.updatebutton} onPress={handleUsernameChange}>
        <Text style={styles.updatebuttonText}>Update Username</Text>
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
  detailContainer: {
    width: "100%",
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
    width: "100%",
  },
  updatebuttonText: {
    color: "#FFF",
    fontWeight: 'bold',
    fontSize: 16,
    width: "100%",
    textAlign: 'center',
  }
});

export default ChangeUsernameScreen;
