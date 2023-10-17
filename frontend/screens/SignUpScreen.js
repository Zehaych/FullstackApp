// import {
//   View,
//   Text,
//   Image,
//   SafeAreaView,
//   TextInput,
//   TouchableOpacity,
// } from "react-native";
// import React, { useState } from "react";
// import { StatusBar } from "expo-status-bar";
// import { useNavigation } from "@react-navigation/native";

// import Animated, {
//   FadeIn,
//   FadeInDown,
//   FadeInUp,
// } from "react-native-reanimated";

// export default function SignUpScreen() {
//   const navigation = useNavigation();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [email, setEmail] = useState("");

//   const handleUsernameChange = (text) => {
//     setUsername(text);
//   };

//   const handlePasswordChange = (text) => {
//     setPassword(text);
//   };

//   const handleEmailChange = (text) => {
//     setEmail(text);
//   };

//   const handleSignUp = async () => {
//     const createUserResponse = await fetch(
//       "http://192.168.1.62:5000/user/register",
//       {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userName: username,
//           email: email,
//           password: password,
//           userType: "user",
//         }),
//       }
//     );
//     if (createUserResponse.status === 200) {
//       alert("User created successfully, redirecting to login page");
//       navigation.navigate("LogInScreen");
//     } else if (createUserResponse.status === 400) {
//       const responseJson = await createUserResponse.json();
//       alert(responseJson.message); // Display the error message to the user
//     } else {
//       alert("Error creating account");
//     }
//   };

//   return (
//     <View className="bg-white h-full w-full">
//       <StatusBar style="light" />
//       <Image
//         className="h-full w-full absolute"
//         source={require("../assets/background.png")}
//       />

//       {/* recipe logo */}
//       <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
//         <Animated.Image
//           source={require("../assets/logo.png")}
//           style={{ height: 300, width: 300, marginTop: 4 }}
//         />
//       </View>

//       {/* title and form */}
//       <View style={{ flex: 1, justifyContent: "space-around", paddingTop: 48 }}>
//         {/* title */}
//         <View style={{ alignItems: "center" }}>
//           <Animated.Text
//             style={{
//               color: "white",
//               fontWeight: "bold",
//               letterSpacing: 1,
//               fontSize: 32,
//               marginBottom: 10,
//             }}
//           >
//             NutriRizz
//           </Animated.Text>
//         </View>

//         {/* form */}
//         <View
//           style={{
//             alignItems: "center",
//             marginHorizontal: 5,
//             marginBottom: 24,
//           }}
//         >
//           <Animated.View
//             style={{
//               backgroundColor: "rgba(0,0,0,0.1)",
//               padding: 16,
//               borderRadius: 20,
//               width: "100%",
//             }}
//           >
//             <TextInput
//               placeholder="Username"
//               placeholderTextColor={"gray"}
//               onChangeText={handleUsernameChange}
//               style={{ color: "white" }}
//             />
//           </Animated.View>
//           <Animated.View
//             style={{
//               backgroundColor: "rgba(0,0,0,0.1)",
//               padding: 16,
//               borderRadius: 20,
//               width: "100%",
//               marginTop: 16,
//             }}
//           >
//             <TextInput
//               placeholder="Email"
//               placeholderTextColor={"gray"}
//               onChangeText={handleEmailChange}
//               style={{ color: "white" }}
//             />
//           </Animated.View>
//           <Animated.View
//             style={{
//               backgroundColor: "rgba(0,0,0,0.1)",
//               padding: 16,
//               borderRadius: 20,
//               width: "100%",
//               marginTop: 16,
//             }}
//           >
//             <TextInput
//               placeholder="Password"
//               placeholderTextColor={"gray"}
//               secureTextEntry
//               onChangeText={handlePasswordChange}
//               style={{ color: "white" }}
//             />
//           </Animated.View>
//           <Animated.View style={{ width: "100%" }}>
//             <TouchableOpacity
//               onPress={handleSignUp}
//               style={{
//                 backgroundColor: "#FFC107",
//                 padding: 16,
//                 borderRadius: 20,
//                 marginBottom: 16,
//                 opacity: 0.9,
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 20,
//                   fontWeight: "bold",
//                   color: "white",
//                   textAlign: "center",
//                 }}
//               >
//                 Sign up
//               </Text>
//             </TouchableOpacity>
//           </Animated.View>

//           <Animated.View
//             style={{ flexDirection: "row", justifyContent: "center" }}
//           >
//             <Text style={{ color: "black" }}>Already have an account? </Text>
//             <TouchableOpacity onPress={() => navigation.push("LogInScreen")}>
//               <Text style={{ color: "#FFC107" }}>Log in</Text>
//             </TouchableOpacity>
//           </Animated.View>
//         </View>
//       </View>
//     </View>
//   );
// }

import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";

export default function SignUpScreen() {
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
      "http://192.168.1.62:5000/user/register",
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
          userType: "user",
        }),
      }
    );
    if (createUserResponse.status === 200) {
      alert("User created successfully, redirecting to login page");
      navigation.navigate("LogInScreen");
    } else if (createUserResponse.status === 400) {
      const responseJson = await createUserResponse.json();
      alert(responseJson.message); // Display the error message to the user
    } else {
      alert("Error creating account");
    }
  };
  return (
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
              placeholder="Username"
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
                Sign up
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(800).duration(1000).springify()}
            className="flex-row justify-center"
          >
            <Text>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.push("LogInScreen")}>
              <Text className="text-amber-600">Log in</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}
