import React from "react";
import { StyleSheet, Button, Text, View } from "react-native";

const SignUpScreen = ({ navigation }) => {
  const handleSignUp = () => {
    // Implement your authentication logic here
    // If authentication is successful, navigate to TabScreen
    navigation.navigate("TabScreen");
  };

  return (
    <View style={styles.container}>
      <Text>This is SignUpScreen!</Text>
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SignUpScreen;
