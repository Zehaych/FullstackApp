import React, { useState, useContext } from "react";
import { Context } from "../../store/context";
import { View, TextInput, Text, TouchableOpacity, Button, ScrollView, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useContext(Context);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const updatedUser = { ...currentUser };

  const handlePasswordChange = async () => {
    if (!currentUser || !currentUser._id) {
      console.log("No valid current user found");
      Alert.alert("Error", "User session not found. Please log in again.");
      return;
    } else {
      console.log("User found!");
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert(
        "Passwords do not match",
        "Please ensure the new passwords match."
      );
      return;
    }

    const userId = updatedUser._id;

    fetch(`${process.env.EXPO_PUBLIC_IP}/user/editPassword/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        newPasswordConfirmation: confirmNewPassword,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          throw new Error("Invalid password. Please try again.");
        } else if (response.status === 400) {
          return response.json().then((data) => {
            throw new Error(data.message);
          });
        } else {
          throw new Error("An error occurred while updating the password.");
        }
      })
      .then((data) => {
        console.log(data);
        setCurrentUser(updatedUser);
        Alert.alert("Success", "Password updated successfully");
        navigation.navigate("TabScreen");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
            
        {/* Current Password */}
        <View>
          <Text style={styles.title}>Current Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Current Password"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
        </View>
        
        {/* New Password */}
        <View>
          <Text style={styles.title}>New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
        </View>

        {/* Confirm New Password */}
        <View>
          <Text style={styles.title}>Confirm New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            secureTextEntry
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
          />
        </View>
        
        {/* <Button title="Update Password" onPress={handlePasswordChange} /> */}

        <TouchableOpacity style={styles.updatebutton} onPress={handlePasswordChange}>
          <Text style={styles.updatebuttonText}>Update Password</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "right",
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 20,
    gap: 16,
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
  }
});

export default ChangePasswordScreen;
