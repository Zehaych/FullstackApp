import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const BizPartnerInfo = ({ route, navigation }) => {
  const { user } = route.params; // Retrieve the user data passed from the previous screen

  const [userData, setUserData] = useState(user); // State to hold the user data

  const suspendUser = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/user/suspend/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add any necessary headers like authorization tokens
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("User suspended successfully");
        const updatedUser = { ...userData, isActive: false }; // Update user's isActive property
        setUserData(updatedUser); // Update the state with the modified user data
      } else {
        alert(data.message || "Error suspending user");
      }
    } catch (error) {
      console.error("Error suspending user:", error);
      alert("Error suspending user");
    }
  };

  const unsuspendUser = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/user/unsuspend/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            // Add any necessary headers like authorization tokens
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("User reactivated successfully");
        const updatedUser = { ...userData, isActive: true };
        setUserData(updatedUser);
      } else {
        alert(data.message || "Error reactivating user");
      }
    } catch (error) {
      console.error("Error reactivating user:", error);
      alert("Error reactivating user");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.infoTitle}>Business Partner Information</Text>
      <Text style={styles.userInfo}>Business Partner: {userData.username}</Text>
      <Text style={styles.userInfo}>Email: {userData.email}</Text>
      <Text style={styles.userInfo}>
        Status: {userData.isActive ? "Active" : "Suspended"}
      </Text>
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button
            title="Suspend User"
            color="#007bff" // Set the button's background color
            onPress={() => suspendUser(userData._id)}
          />
        </View>
        <View style={[styles.button, styles.secondaryButton]}>
          <Button
            title="Reactivate User"
            color="#28a745" // Set the button's background color
            onPress={() => unsuspendUser(userData._id)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    margin: 10,
    overflow: "hidden",
  },
  button: {
    backgroundColor: "#007bff", // Blue color for the primary button
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#28a745", // Green color for the secondary button
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  container: {
    flex: 1,
    marginTop: 40,
    alignItems: "center", // Center content horizontally
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333", // Adjust the color as needed
  },
  userInfo: {
    fontSize: 20,
    color: "#444", // Adjust the color as needed
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd", // Adjust the border color as needed
    borderRadius: 5,
    width: "80%", // Adjust the width as needed
    textAlign: "center", // Center-align text
    backgroundColor: "white", // Adjust the background color as needed
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default BizPartnerInfo;
