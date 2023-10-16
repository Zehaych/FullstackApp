import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";

export default function RecipeScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const url = "http://192.168.0.125:5000/recipe";

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [data]);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading ...</Text>
      ) : (
        data.map((food) => (
          <View key={food._id}>
            <Text>Name: {food.name}</Text>
            <Text>
              Ingredients:
              {food.ingredients.map((ingredient, index) => (
                <Text key={index}>{ingredient}, </Text>
              ))}{" "}
            </Text>
            <Text>Instructions: {food.instructions}</Text>
            <Text>Calories: {food.calories}</Text>
          </View>
        ))
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
