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
  const [newUsername, setNewUsername] = useState('');
  const [usernameModalVisible, setUsernameModalVisible] = useState(false);


  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        try {
          const userId = userData._id; 
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_IP}/user/getUserById/${userId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setUserData(data); // Update the userData with the fetched data
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
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
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("User suspended successfully");
        const updatedUser = { ...userData, isActive: false }; 
        setUserData(updatedUser); 
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

const updateUsername = async () => {
  try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/user/updateUsername/${userData._id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: newUsername }),
      });

      if (response.ok) {
          Alert.alert('Success', 'Username updated successfully.');
          setUserData({ ...userData, username: newUsername }); 
      } else {
          Alert.alert('Error', 'Failed to update username.');
      }
  } catch (error) {
      console.error('Error updating username:', error);
      Alert.alert('Error', 'Failed to update username.');
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
            style={[styles.button, styles.fourthButton]}
            onPress={() => setUsernameModalVisible(true)}
        >
            <Text style={styles.buttonText}>Change Username</Text>
        </TouchableOpacity>


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

        <Modal
          animationType="slide"
          transparent={true}
          visible={usernameModalVisible}
          onRequestClose={() => setUsernameModalVisible(false)}
      >
          <View style={styles.centeredView}>
              <View style={styles.modalView}>
                  <TextInput
                      style={styles.input}
                      placeholder="Enter new username"
                      value={newUsername}
                      onChangeText={setNewUsername}
                  />
                  <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                          setUsernameModalVisible(false);
                          updateUsername();
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalView: {
      width: '80%', 
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
  fourthButton: {
    backgroundColor: "#FFA500",
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
    color: "#333",
  },
  userInfo: {
    fontSize: 20,
    color: "#444", 
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    width: "80%", 
    textAlign: "center", 
    backgroundColor: "white", 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default BizPartnerInfo;
