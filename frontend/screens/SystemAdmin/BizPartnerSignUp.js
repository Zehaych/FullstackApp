import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableRipple,
  Pressable,
  StyleSheet,
} from "react-native";
import AdminScreen from "../SystemAdmin/AdminScreen";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";

export default function BizPartnerSignUp() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handlePasswordConfirmationChange = (text) => {
    setPasswordConfirmation(text);
  };

  const handleUsernameChange = (text) => {
    setUsername(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handleSignUp = async () => {
    if (password.trim() !== passwordConfirmation.trim()) {
      alert("Password and confirmation do not match");
      return;
    }

    const createUserResponse = await fetch(
      `${process.env.EXPO_PUBLIC_IP}/user/register`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: username,
          email: email,
          password: password,
          userType: "bizpartner",
        }),
      }
    );
    if (createUserResponse.status === 200) {
      alert("Business partner created successfully, redirecting to admin page");
      navigation.navigate("AdminScreen");
    } else if (createUserResponse.status === 400) {
      const responseJson = await createUserResponse.json();
      alert(responseJson.message); // Display the error message to the user
    } else {
      alert("Error creating account");
    }
  };

  const navigateBack = () => {
    navigation.navigate("AdminScreen");
  };

  return (
    <View className="bg-white h-full w-full">
      <StatusBar style="light" />
      <Image
        className="h-full w-full absolute"
        source={require("../../assets/background.png")}
      />

      {/* recipe logo */}
      <View className="flex-row justify-around w-full absolute">
        <Animated.Image
          entering={FadeInUp.delay(200).duration(1000).springify()}
          source={require("../../assets/logo.png")}
          className="h-[250] w-90] mt-4"
          //   className="h-[225] w-[90]"
        />
      </View>

      {/* title and form */}
      <View className="h-full w-full flex justify-around pt-48">
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
              placeholder="Business Partner Username"
              placeholderTextColor={"black"}
              onChangeText={handleUsernameChange}
            />
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(200).duration(1000).springify()}
            className="bg-black/5 p-5 rounded-2xl w-full"
          >
            <TextInput
              placeholder="Email"
              placeholderTextColor={"black"}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
            />
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(400).duration(1000).springify()}
            className="bg-black/5 p-5 rounded-2xl w-full"
          >
            <TextInput
              placeholder="Password"
              placeholderTextColor={"black"}
              secureTextEntry
              onChangeText={handlePasswordChange}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(400).duration(1000).springify()}
            className="bg-black/5 p-5 rounded-2xl w-full"
          >
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor={"black"}
              secureTextEntry
              onChangeText={handlePasswordConfirmationChange}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(400).duration(1000).springify()}
            className="w-full"
          >
            <TouchableOpacity
              onPress={handleSignUp}
              className="w-full bg-amber-600 p-3 rounded-2xl mb-3 active:bg-opacity-75"
            >
              <Text className="text-xl font-bold text-white text-center">
                Create Business Partner Account
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(800).duration(1000).springify()}
            className="flex-row justify-center"
          ></Animated.View>
        </View>
      </View>
    </View>
  );
}
