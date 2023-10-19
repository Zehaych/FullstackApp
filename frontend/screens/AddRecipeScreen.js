// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   useWindowDimensions,
//   ScrollView,
//   TextInput,
// } from "react-native";
// // import Logo from "../../assets/LogoApp2.png";
// import CustomInput from "../components/CustomInput";
// import CustomButton from "../components/CustomButton";
// import SocialSignInButtons from "../components/SocialSignInButtons";
// import { useNavigation } from "@react-navigation/native";
// import { useForm, Controller } from "react-hook-form";

// const AddRecipeScreen = () => {
//   const { height } = useWindowDimensions();
//   const navigation = useNavigation();

//   let [name, setName] = useState("");
//   let [calorie, setCalorie] = useState("");
//   let [fat, setFat] = useState("");
//   let [protein, setProtein] = useState("");
//   let [carbs, setCarbs] = useState("");

//   const [loading, setLoading] = useState(false);

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   // const onAddFoodPressed = (e) => {
//   //   e.preventDefault();
//   //   // console.log(data);
//   //   const food = { name, calorie, fat, protein, carbs };

//   //   setLoading(true);

//   //   fetch("http://192.168.1.62:3000/api/food", {
//   //     method: "POST",
//   //     headers: { "Content-Type": "application/json" },
//   //     body: JSON.stringify(food),
//   //   }).then(() => {
//   //     console.warn("Data successfully added into database");
//   //     setLoading(false);
//   //     // navigate(-1);
//   //     // navigate("/");
//   //   });
//   //   // console.warn("Data successfully added into database");
//   // };

//   let onAddFoodPressed = (name, calorie, fat, protein, carbs) => {
//     fetch(`http://192.168.43.106:3000/api/food`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         name: name,
//         calorie: calorie,
//         fat: fat,
//         protein: protein,
//         carbs: carbs,
//       }),
//     })
//       .then((res) => {
//         console.log(res.status);
//         console.log(res.headers);
//         return res.json();
//       })
//       .then(
//         (result) => {
//           console.log(result);
//           console.warn(result);
//         },
//         (error) => {
//           console.log(error);
//           console.warn(error);

//           // alert(error);
//         }
//       );
//   };

//   const onBackPressed = () => {
//     navigation.navigate("Profile");
//   };
//   return (
//     <ScrollView showsVerticalScrollIndicator={false}>
//       <View style={styles.root}>
//         <Image
//           source={Logo}
//           style={[styles.logo, { height: height * 0.26 }]}
//           resizeMode="contain"
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Food name"
//           value={name}
//           onChangeText={(value) => setName(value)}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Calorie"
//           value={calorie}
//           onChangeText={(value) => setCalorie(value)}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Fat"
//           value={fat}
//           onChangeText={(value) => setFat(value)}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Protein"
//           value={protein}
//           onChangeText={(value) => setProtein(value)}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Carbs"
//           value={carbs}
//           onChangeText={(value) => setCarbs(value)}
//         />

//         {/* <CustomInput
//           name="name"
//           placeholder="Food name"
//           value={name}
//           control={control}
//           onChangeText={(value) => setName(value)}
//         />
//         <CustomInput
//           name="calorie"
//           placeholder="Calorie"
//           value={calorie}
//           control={control}
//           onChangeText={(value) => setCalorie(value)}
//         />
//         <CustomInput
//           name="fat"
//           placeholder="Fat"
//           value={fat}
//           control={control}
//           onChangeText={(value) => setFat(value)}
//         />
//         <CustomInput
//           name="protein"
//           placeholder="Protein"
//           value={protein}
//           control={control}
//           onChangeText={(value) => setProtein(value)}
//         />

//         <CustomInput
//           name="carbs"
//           placeholder="Carbs"
//           value={carbs}
//           control={control}
//           onChangeText={(value) => setCarbs(value)}
//         /> */}

//         {/* wrong */}

//         {/* <TextInput
//           value={name}
//           onChangeText={(e) => setName(e.target.value)}
//           placeholder="Food name"
//         /> */}

//         {/* <CustomInput
//           name="foodname"
//           // value={name}
//           placeholder="Food name"
//           control={control}
//           // onChange={(e) => setName(e.target.value)}
//           rules={{ required: "Food name is required" }}
//         />
//         <CustomInput
//           name="calorie"
//           // value={calorie}
//           placeholder="Calorie"
//           control={control}
//           // onChange={(e) => setCalorie(e.target.value)}
//           rules={{ required: "Calorie input is required" }}
//         />
//         <CustomInput
//           name="fat"
//           // value={fat}
//           placeholder="Fat"
//           control={control}
//           // onChange={(e) => setFat(e.target.value)}
//           rules={{ required: "Fat input is required" }}
//         />
//         <CustomInput
//           name="protein"
//           // value={protein}
//           placeholder="Protein"
//           control={control}
//           // onChange={(e) => setProtein(e.target.value)}
//           rules={{ required: "Protein input is required" }}
//         />
//         <CustomInput
//           name="carbs"
//           // value={carbs}
//           placeholder="Carbs"
//           control={control}
//           // onChange={(e) => setCarbs(e.target.value)}
//           rules={{ required: "Carbs input is required" }}
//         /> */}

//         <CustomButton
//           text="Add Food"
//           onPress={handleSubmit(() =>
//             onAddFoodPressed(name, calorie, fat, protein, carbs)
//           )}
//         />

//         <CustomButton
//           text="Go back to profile"
//           onPress={onBackPressed}
//           type="SECONDARY"
//         />
//       </View>
//     </ScrollView>
//   );
// };
// const styles = StyleSheet.create({
//   root: {
//     alignItems: "center",
//     padding: 20,
//   },
//   logo: {
//     width: "70%",
//     maxWidth: 300,
//     maxHeight: 200,
//   },
//   input: {
//     backgroundColor: "white",
//     width: "100%",

//     borderColor: "#e8e8e8",
//     borderWidth: 1,
//     borderRadius: 5,

//     paddingHorizontal: 10,
//     marginVertical: 5,
//   },
// });

// export default AddRecipeScreen;
import { View, Text } from "react-native";
import React from "react";

export default function AddRecipeScreen() {
  return (
    <View>
      <Text>AddRecipeScreen</Text>
    </View>
  );
}
