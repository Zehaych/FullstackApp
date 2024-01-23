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
      alert(responseJson.message); 
    } else {
      alert("Error creating account");
    }
  };

  const navigateBack = () => {
    navigation.navigate("AdminScreen");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* title and form */}
      <View style={styles.detailBox}>

        {/* form */}
          <Animated.View
            entering={FadeInDown.duration(1000).springify()}
            //className="bg-black/5 p-5 rounded-2xl w-full"
          >
            <Text style={styles.subtitle}>Username</Text>
            <TextInput
              placeholder="Business Partner Username"
              onChangeText={handleUsernameChange}
              style={styles.input}
            />
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(200).duration(1000).springify()}
            //className="bg-black/5 p-5 rounded-2xl w-full"
          >
            <Text style={styles.subtitle}>Email</Text>
            <TextInput
              placeholder="Email"
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              style={styles.input}
            />
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(400).duration(1000).springify()}
            //className="bg-black/5 p-5 rounded-2xl w-full"
          >
            <Text style={styles.subtitle}>Password</Text>
            <TextInput
              placeholder="Password"
              secureTextEntry
              onChangeText={handlePasswordChange}
              style={styles.input}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(400).duration(1000).springify()}
            //className="bg-black/5 p-5 rounded-2xl w-full"
          >
            <Text style={styles.subtitle}>Confirm Password</Text>
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry
              onChangeText={handlePasswordConfirmationChange}
              style={styles.input}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(400).duration(1000).springify()}
            //className="w-full"
          >
            <TouchableOpacity
              onPress={handleSignUp}
              //className="w-full bg-amber-600 p-3 rounded-2xl mb-3 active:bg-opacity-75"
              style={styles.button}
            >
              <Text style={styles.text}>
                Create Business Partner Account
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(800).duration(1000).springify()}
            //className="flex-row justify-center"
          ></Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: "#fff",
  },
  detailBox: {
    //flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    margin: 10,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3.84,
    shadowOpacity: 0.25,
    elevation: 5,
  },
  input: {
    height: 40,
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: "#ccc",
    fontSize: 16, // Adjust font size
  },
  button: {
    margin: 10,
    overflow: "hidden",
    backgroundColor: "#ED6F21",
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize:18,
    fontWeight: "bold",
    marginTop: 5,
    marginHorizontal: 10,
  },

});
