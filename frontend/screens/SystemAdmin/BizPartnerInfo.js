import React, { useState, useEffect, useContext } from "react";
import { View, Text, Modal, StyleSheet, Button, TouchableOpacity, TextInput, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Context } from "../../store/context";

const BizPartnerInfo = ({ route, navigation }) => {
  const { user } = route.params; // Retrieve the user data passed from the previous screen
  const [currentUser, setCurrentUser] = useContext(Context);

  const [userData, setUserData] = useState(user); // State to hold the user data

  const [modalVisible, setModalVisible] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        try {
          const userId = userData._id; // Assuming you have the user ID in the userData
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_IP}/user/getUserById/${userId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                // Add any necessary headers like authorization tokens
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setUserData(data); // Update the userData with the fetched data
          } else {
            console.error("Failed to fetch user data");
            // Handle errors as appropriate
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Handle errors as appropriate
        }
      };

      fetchUserData();
    }, [])
  );

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

  const validateAndDeletePartner = async () => {
    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/user/validateAdminPassword/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: adminPassword }),
        });
        const data = await response.json();

        if (data.isValid) {
            deleteBusinessPartner(userData._id);
        } else {
            Alert.alert('Invalid Password', 'The entered password is incorrect.');
        }
    } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'An error occurred during validation.');
    }
};

const deleteBusinessPartner = async (userId) => {
  try {
      const deleteResponse = await fetch(`${process.env.EXPO_PUBLIC_IP}/user/deleteBusinessPartner/${userId}`, {
          method: 'DELETE',
      });

      if (deleteResponse.ok) {
          Alert.alert('Success', 'Business partner successfully deleted.');
      } else {
          Alert.alert('Error', 'Failed to delete the business partner.');
      }
  } catch (error) {
      console.error('Delete error:', error);
      Alert.alert('Error', 'Failed to delete the business partner.');
  }
};



  return (
    <View style={styles.container}>
      <Text style={styles.title}>{currentUser.username}</Text>
      <Text style={styles.infoTitle}>Business Partner Information</Text>
      <Text style={styles.userInfo}>Business Partner: {userData.username}</Text>
      <Text style={styles.userInfo}>Email: {userData.email}</Text>
      <Text style={styles.userInfo}>
        Status: {userData.isActive ? "Active" : "Suspended"}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => suspendUser(userData._id)}
        >
          <Text style={styles.buttonText}>Suspend User</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => unsuspendUser(userData._id)}
        >
          <Text style={styles.buttonText}>Reactivate User</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.thirdButton]} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Delete Business Partner</Text>
        </TouchableOpacity>
      </View>

      
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TextInput
                        secureTextEntry
                        style={styles.input}
                        placeholder="Enter Admin Password"
                        value={adminPassword}
                        onChangeText={setAdminPassword}
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            setModalVisible(false);
                            validateAndDeletePartner();
                        }}
                    >
                        <Text style={styles.buttonText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalView: {
      width: '80%', // Adjust the width as needed
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
          width: 0,
          height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
  },
  input: {
      marginBottom: 10,
  },
  button: {
      marginTop: 10, 
  },
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
  thirdButton: {
    backgroundColor: "#FF0000",
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
