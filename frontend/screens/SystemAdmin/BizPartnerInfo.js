import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Button,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Context } from "../../store/context";
import Icon from "react-native-vector-icons/MaterialIcons";

const BizPartnerInfo = ({ route, navigation }) => {
  const { user } = route.params; // Retrieve the user data passed from the previous screen
  const [currentUser, setCurrentUser] = useContext(Context);

  const [userData, setUserData] = useState(user); // State to hold the user data

  const [modalVisible, setModalVisible] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
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
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/user/validateAdminPassword/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: adminPassword }),
        }
      );
      const data = await response.json();

      if (data.isValid) {
        deleteBusinessPartner(userData._id);
      } else {
        Alert.alert("Invalid Password", "The entered password is incorrect.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred during validation.");
    }
  };

  const deleteBusinessPartner = async (userId) => {
    try {
      const deleteResponse = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/user/deleteBusinessPartner/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (deleteResponse.ok) {
        Alert.alert("Success", "Business partner successfully deleted.");
      } else {
        Alert.alert("Error", "Failed to delete the business partner.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      Alert.alert("Error", "Failed to delete the business partner.");
    }
  };

  const updateUsername = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/user/updateUsername/${userData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: newUsername }),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Username updated successfully.");
        setUserData({ ...userData, username: newUsername });
      } else {
        Alert.alert("Error", "Failed to update username.");
      }
    } catch (error) {
      console.error("Error updating username:", error);
      Alert.alert("Error", "Failed to update username.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfoSection}>
        <Image 
          source={require("../../assets/person-placeholder.jpg")} 
          style={styles.userImage} 
        />
        <Text style={styles.infoTitle}>{userData.username}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.detailBox}>
        <View style={styles.componentContainer}>
          <Text style={styles.userInfo}>Username </Text>
          <Text style={styles.userInfo1}>{userData.username}</Text>
        </View>
        <View style={styles.componentContainer}>
          <Text style={styles.userInfo}>Email</Text>
          <Text style={styles.userInfo1}>{userData.email}</Text>
        </View>
        <View style={styles.componentContainer}>
          <Text style={styles.userInfo}>Status</Text>
          <Text style={styles.userInfo1}>
            {userData.isActive ? "Active" : "Suspended"} 
          </Text>
        </View>



          {/* <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button]}
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
              style={[styles.button]}
              onPress={() => unsuspendUser(userData._id)}
            >
              <Text style={styles.buttonText}>Reactivate User</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.buttonText}>Delete Business Partner</Text>
            </TouchableOpacity>
          </View>
 */}


          
        <View style={styles.buttonContainer}>

        <TouchableOpacity
              style={[styles.button]}
              onPress={() => setUsernameModalVisible(true)}
            >
              <Text style={styles.buttonText}>Change Username</Text>
            </TouchableOpacity>


          {userData.isActive ? (
            <TouchableOpacity
              style={[styles.suspendButton]}
              onPress={() => suspendUser(userData._id)}
            >
              <Text style={styles.buttonText}>Suspend User</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.suspendButton}
              onPress={() => unsuspendUser(userData._id)}
            >
              <Text style={styles.buttonText}>Reactivate User</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.deleteButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>Delete User</Text>
          </TouchableOpacity>
        </View>
        
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.closeContainer}>
              <Text></Text>
              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                {/* <Text style={styles.submitButtonText}>Close</Text> */}
                <Icon name="close" color="#4D4D4D" size={24} />
              </TouchableOpacity>
            </View>
            <TextInput
              secureTextEntry
              style={styles.input}
              placeholder="Enter Admin Password"
              value={adminPassword}
              onChangeText={setAdminPassword}
            />
            <TouchableOpacity
              style={styles.confirmButton}
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
            <View style={styles.closeContainer}>
              <Text></Text>
              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setUsernameModalVisible(false)}
              >
                {/* <Text style={styles.submitButtonText}>Close</Text> */}
                <Icon name="close" color="#4D4D4D" size={24} />
              </TouchableOpacity>
            </View>


            <TextInput
              style={styles.input}
              placeholder="Enter new username"
              value={newUsername}
              onChangeText={setNewUsername}
            />
            <TouchableOpacity
              style={styles.confirmButton}
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  userInfoSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    margin: 10,
    borderWidth: 1,
    padding: 10,
    width: '100%', // Adjust as needed
    borderRadius: 5,
    borderColor: '#ccc',
  },
  confirmButton: {
    //backgroundColor: '#2196F3',
    backgroundColor: '#ED6F21',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    width: '100%', // Adjust as needed
  },
  buttonContainer: {
    margin: 10,
    overflow: "hidden",
  },
  button: {
    backgroundColor: "#ED6F21", // Blue color for the primary button
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  suspendButton: {
    backgroundColor: "#A54900", // Blue color for the primary button
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#A9A9A9", // Blue color for the primary button
    padding: 10,
    borderRadius: 10,
    // marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    //marginTop: 40,
    //alignItems: "center", // Center content horizontally
    //padding: 10,
    backgroundColor: "#f5f5f5",
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  userInfo: {
    fontSize: 16,
    color: "grey",
    marginBottom: 5, 
  },
  userInfo1: {
    fontSize: 16,
    marginBottom: 5,
    width: "70%",
    textAlign: "right",
  },
  detailBox: {
    //flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3.84,
    shadowOpacity: 0.25,
    elevation: 5,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    margin: 10,

  },
  componentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#dddddd",
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
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
  closeContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
});

export default BizPartnerInfo;
