import React from "react";
import { StyleSheet, Button, Text, View } from "react-native";

const LogInScreen = ({ navigation }) => {
  const handleLogIn = () => {
    // Implement your authentication logic here
    // If authentication is successful, navigate to TabScreen
    navigation.navigate("TabScreen");
  };

  const handleSignUp = () => {
    // Implement your authentication logic here
    // If authentication is successful, navigate to TabScreen
    navigation.navigate("SignUpScreen");
  };

  return (
    <View style={styles.container}>
      <Text>Click log in to log in, click sign up to sign up</Text>
      <Button title="Log In" onPress={handleLogIn} />
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

export default LogInScreen;
