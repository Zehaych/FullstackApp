import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Context } from "../../store/context";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function ViewBizRecipeScreen({ navigation }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useContext(Context);

  const fetchBizRecipes = async () => {
    try {
      // Fetch all recipes
      const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/bizRecipe`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const allRecipes = await response.json();

      // Filter recipes to include only those submitted by the current user
      if (Array.isArray(allRecipes)) {
        const userRecipes = allRecipes.filter(
          (recipe) =>
            recipe.submitted_by && recipe.submitted_by._id === currentUser._id
        );
        setRecipes(userRecipes);
      } else {
        // Handle the case where 'allRecipes' is not as expected
        console.error("Unexpected response format:", allRecipes);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchBizRecipes();
    }, [])
  );

  useEffect(() => {
    fetchBizRecipes();
  }, [currentUser._id]);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : recipes.length === 0 ? (
        <Text>No recipes found.</Text>
      ) : (
        <FlatList
          data={recipes}
          numColumns={2}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.recipeMember}
              onPress={() =>
                navigation.navigate("Business Recipe Info", { recipe: item })
              }
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.recipeTitle}>{item.name}</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="person-pin" size={24} color="#333333" />
                <Text style={{ marginLeft: 8 }}>
                  {item.submitted_by.username}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCD3",
    padding: 10,
  },
  recipeMember: {
    flex: 1,
    alignItems: "center",
    margin: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
  },
  image: {
    width: 135,
    height: 135,
    resizeMode: "cover",
    borderRadius: 10,
  },
  recipeTitle: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});
