import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";

export default function MembersRecipeScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const url = `${process.env.EXPO_PUBLIC_IP}/recipe`;

  //navigate to recipe info page
  const handleRecipeInfo = (recipeData) => {
    navigation.navigate("MembersRecipeInfoScreen", { recipeData });
  };

  useEffect(() => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => setData(json))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [url]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>All available receipes</Text>
      <ScrollView style={styles.foodContainer}>
        {loading ? (
          <Text>Loading ...</Text>
        ) : (
          data.map((food) => (
            <TouchableOpacity
              key={food._id}
              style={styles.recipeMember}
              onPress={() => handleRecipeInfo(food)}
            >
              <Image source={{ uri: food.image }} style={styles.image} />
              <Text style={styles.recipeTitle}> {food.name}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  //style for the header
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "orange",
  },
  //style for the image
  foodContainer: {
    marginBottom: 20,
  },
  recipeMember: {
    flexDirection: "column",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  recipeTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});

/*
              <Text>
                Ingredients:{" "}
                {food.ingredients.map((ingredient, index) => (
                  <Text key={index}>{ingredient}, </Text>
                ))}{" "}
              </Text>
              <Text>Instructions: {food.instructions}</Text>
              <Text>Calories: {food.calories}</Text>
              */
