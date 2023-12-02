import {
  View,
  Text,
  Image,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import { useState } from "react";
import { Context } from "../store/context";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";

export default function LogInScreen() {
  const [currentUser, setCurrentUser] = useContext(Context);
  const navigation = useNavigation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (text) => {
    setUsername(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const LogIn = async () => {
    const login = await fetch(`${process.env.EXPO_PUBLIC_IP}/user/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    const data = await login.json();
    if (login.status === 200) {
      AsyncStorage.setItem("userId", JSON.stringify(data.user));
      setCurrentUser(data.user);
      console.log(data.user);
      console.log(data);
      navigation.navigate("TabScreen");
      // Clear the text input fields
      this.usernameInput.clear();
      this.passwordInput.clear();
      console.log(currentUser);
    } 
    // else window.alert("Incorrect username or password");
    else {
      // Display the specific error message received from the server
      window.alert(data.message || "An error occurred during login");
    }
  };

  const handleSignUp = () => {
    // Implement your authentication logic here
    // If authentication is successful, navigate to TabScreen
    navigation.navigate("SignUpScreen");
  };
  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"} 
    style={{ flex: 1 }}>
    <View className="bg-white h-full w-full">
      <StatusBar style="light" />
      <Image
        className="h-full w-full absolute"
        source={require("../assets/background.png")}
      />

      {/* recipe logo */}
      <View className="flex-row justify-around w-full absolute">
        <Animated.Image
          entering={FadeInUp.delay(200).duration(1000).springify()}
          source={require("../assets/logo.png")}
          // className="h-[210] w-[210]"
          className="h-[250] w-90] mt-4"

          //   className="h-[225] w-[90]"
        />
      </View>

      {/* title and form */}
      <View className="h-full w-full flex justify-around pt-40 pb-10">
        {/* title */}
        <View className="flex items-center">
          <Animated.Text
            entering={FadeInUp.duration(1000).springify()}
            className="text-white font-bold tracking-wider text-5xl"
          >
            NutriRizz
          </Animated.Text>
        </View>

        {/* form */}
        <View className="flex items-center mx-5 space-y-4">
          <Animated.View
            entering={FadeInDown.duration(1000).springify()}
            className="bg-black/5 p-5 rounded-2xl w-full"
          >
            <TextInput
              placeholder="Username"
              placeholderTextColor={"black"}
              onChangeText={handleUsernameChange}
              ref={(input) => (this.usernameInput = input)}
            />
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(200).duration(1000).springify()}
            className="bg-black/5 p-5 rounded-2xl w-full mb-3"
          >
            <TextInput
              placeholder="Password"
              placeholderTextColor={"black"}
              secureTextEntry
              onChangeText={handlePasswordChange}
              ref={(input) => (this.passwordInput = input)}
            />
          </Animated.View>

          <Animated.View
            className="w-full"
            entering={FadeInDown.delay(400).duration(1000).springify()}
          >
            <TouchableOpacity
              className="w-full bg-amber-600 p-3 rounded-2xl mb-3 active:bg-opacity-75"
              onPress={LogIn}
            >
              <Text className="text-xl font-bold text-white text-center">
                Log in
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(600).duration(1000).springify()}
            className="flex-row justify-center"
          >
            <Text>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.push("Sign up")}>
              <Text className="text-amber-600">Sign up</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
    </KeyboardAvoidingView>
  );
}
