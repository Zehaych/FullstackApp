// import { View, Text } from "react-native";
// import React from "react";

// const DeleteAcountScreen = () => {
//   return (
//     <View>
//       <Text>DeleteAcountScreen</Text>
//     </View>
//   );
// };

// export default DeleteAcountScreen;
import React, { useState, useContext } from "react";
import { Context } from "../store/context";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

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
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Delete Account" onPress={handleDeleteAccount} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    width: "100%",
  },
});

export default DeleteAccountScreen;
