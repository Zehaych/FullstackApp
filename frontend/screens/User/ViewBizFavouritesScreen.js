// import { View, Text } from "react-native";
// import React from "react";

// const ViewBizFavouritesScreen = () => {
//   return (
//     <View>
//       <Text>ViewBizFavouritesScreen</Text>
//     </View>
//   );
// };

// export default ViewBizFavouritesScreen;
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
import Icon from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";

export default function ViewBizFavouritesScreen({ navigation }) {
  const [favouriteBizRecipes, setFavouriteBizRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useContext(Context);

  const fetchFavouriteBizRecipes = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/bizrecipe`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const allRecipes = await response.json();

      // Filter recipes to include only those in the user's favorites
      if (Array.isArray(allRecipes)) {
        const userFavourites = allRecipes.filter((recipe) =>
          currentUser.favouriteBizRecipes.includes(recipe._id)
        );
        setFavouriteBizRecipes(userFavourites);
      } else {
        console.error("Unexpected response format:", allRecipes);
      }
    } catch (error) {
      console.error("Error fetching favorite recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchFavouriteBizRecipes();
    }, [currentUser.favouriteBizRecipes])
  );

  useEffect(() => {
    fetchFavouriteBizRecipes();
  }, [currentUser.favouriteBizRecipes]);

  const Star = ({ filled, partiallyFilled }) => {
    return (
      <View style={{ position: "relative" }}>
        <Icon name="star-outline" color="grey" size={24} />
        {(filled || partiallyFilled > 0) && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: partiallyFilled ? `${partiallyFilled * 100}%` : "100%",
              overflow: "hidden",
            }}
          >
            <Icon name="star" color="orange" size={24} />
          </View>
        )}
      </View>
    );
  };
  const Rating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const partialStar = rating % 1;
    const emptyStars = 5 - fullStars - (partialStar > 0 ? 1 : 0);

    return (
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full_${i}`} filled />
        ))}
        {partialStar > 0 && (
          <Star key="partial" partiallyFilled={partialStar} />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty_${i}`} />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : favouriteBizRecipes.length === 0 ? (
        <Text>No favorite recipes found.</Text>
      ) : (
        <FlatList
          data={favouriteBizRecipes}
          numColumns={2}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.recipeMember}
              onPress={() =>
                navigation.navigate("ViewBizFavouriteRecipeInfo", {
                  recipeData: item,
                })
              }
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.recipeTitle}>{item.name}</Text>
              <Rating rating={item.averageRating} />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="person" size={24} color="#333333" />
                <Text style={{ marginLeft: 8 }}>
                  {item.totalRatings} people rated
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
