import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/context";

export default function MembersRecipeInfoScreen({ route }) {
  const { recipeData } = route.params;
  const [username, setUsername] = useState("");

  const [currentUser, setCurrentUser] = useContext(Context);

  const fetchUsername = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/user/getUserById/${recipeData.submitted_by}`
      );
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const user = await response.json();
      setUsername(user.username);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUsername();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipeData.image }} style={styles.image} />
        </View>
        <Text style={styles.title}>
          {recipeData.name} {"\n"}
        </Text>

        <Text style={styles.subTitle}>Created by: </Text>
        <Text>
          {username} {"\n"}
        </Text>

        {currentUser.foodRestrictions.length > 0 && (
          <View>
            <Text style={styles.subTitle}>Disclaimer: </Text>
            <Text>
              Based on your medical history, it is recommended to minimize or
              abstain from using{" "}
              <Text style={{ color: "red", fontWeight: "bold" }}>
                {currentUser.foodRestrictions.join(", ")}
              </Text>{" "}
              when preparing the recipe. {"\n"}
            </Text>
          </View>
        )}

        <Text style={styles.subTitle}>Instructions: </Text>
        {recipeData.instructions.map((instruction, index) => (
          <Text key={index}>
            Step {index + 1}: {instruction} {"\n"}
          </Text>
        ))}

        <Text style={styles.subTitle}>Calories: </Text>
        <Text>{recipeData.calories}</Text>
        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCD3",
    //alignItems: "center",
  },
  //style for the image
  imageContainer: {
    flex: 1,
    justifyContent: "center", // Center the image vertically
    alignItems: "center", // Center the image horizontally
    padding: 10,
  },
  image: {
    flex: 1,
    width: 400,
    height: 400,
    resizeMode: "contain",
  },
  title: {
    color: "gold",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  subTitle: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
});