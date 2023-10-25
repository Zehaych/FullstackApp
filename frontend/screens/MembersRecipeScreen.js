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
  FlatList,
  Dimensions,
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
      <Text style={styles.header}>All available recipes</Text>
      <FlatList
        data={data}
        numColumns={2}
        contentContainerStyle={styles.foodContainer}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recipeMember}
            onPress={() => handleRecipeInfo(item)}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.recipeTitle}> {item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

//const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCD3",
    padding: 10,
  },
  header: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "orange",
  },
  foodContainer: {
    flexGrow: 1,
    //width: "100%",
    justifyContent: "space-between",
    //width: width * data.length, // width * number of items
  },
  recipeMember: {
    //width: 360,
    //width: "100%",
    flex: 1,
    alignItems: "center",
    margin: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
  },
  image: {
    //flex: 1, // Fill the container's available space
    width: 150,
    height: 150,
    resizeMode: "cover", // Make the image fit the container
    borderRadius: 10,
  },
  recipeTitle: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    //position: "absolute",
    //bottom: 50, // Position the title on top of the image
    //left: 10, // Add some spacing from the left
    //right: 10, // Add some spacing from the right
    //backgroundColor: "rgba(0, 0, 0, 0.5)", // Add a semi-transparent background
    //color: "white",
    //padding: 5, // Add some padding
    //borderRadius: 5, // Add border radius for the background
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


              return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>All available receipes</Text>
      <ScrollView style={styles.foodContainer} >
        {loading ? (
          <Text>Loading ...</Text>
        ) : (
          data.map((food) => (
            <TouchableOpacity key={food._id} style={styles.recipeMember} onPress={() => handleRecipeInfo(food)}>
              <Image source={{ uri: food.image }} style={styles.image} />
              <Text style={styles.recipeTitle}> {food.name}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );



horizontal={true} // horozontal scroll
              */
