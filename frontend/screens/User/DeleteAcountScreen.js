import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Context } from "../../store/context";

const DeleteAccountScreen = () => {
  const navigation = useNavigation();
  const [currentUser] = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleDeleteAccount = async () => {
    if (!currentUser || !currentUser._id) {
      Alert.alert("Error", "User session not found. Please log in again.");
      return;
    }

    if (email === "" || password === "") {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            try {
              const response = await fetch(
                `${process.env.EXPO_PUBLIC_IP}/user/deleteUser/${currentUser._id}`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    email,
                    password,
                  }),
                }
              );

              if (response.ok) {
                // Navigate to login screen after successful deletion
                navigation.navigate("LogInScreen");
                alert("Successfully deleted your account.");
              } else {
                const data = await response.json();
                Alert.alert(
                  "Failed",
                  data.message ||
                    "An error occurred while deleting the account."
                );
              }
            } catch (error) {
              console.error(error);
              Alert.alert(
                "Error",
                "An error occurred while deleting the account."
              );
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      
      {/* Email */}
      <View style={styles.detailContainer}>
        <Text style={styles.title}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {/* Password */}
      <View style={styles.detailContainer}>
        <Text style={styles.title}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      
      {/* <Button title="Delete Account" onPress={handleDeleteAccount} /> */}

      <TouchableOpacity style={styles.updatebutton} onPress={handleDeleteAccount}>
        <Text style={styles.updatebuttonText}>Delete Account</Text>
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
    width: '100%'
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
    width: '100%',
  },
  updatebuttonText: {
    color: "#FFF",
    fontWeight: 'bold',
    fontSize: 16,
    width: '100%',
    textAlign: 'center',
  }
});

export default DeleteAccountScreen;
