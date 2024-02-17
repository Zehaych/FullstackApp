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

export default function ViewFavouritesScreen({ navigation }) {
  const [favouriteRecipes, setFavouriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useContext(Context);

  const fetchFavouriteRecipes = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/recipe`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const allRecipes = await response.json();

      // Filter recipes to include only those in the user's favorites
      if (Array.isArray(allRecipes)) {
        const userFavourites = allRecipes.filter((recipe) =>
          currentUser.favouriteRecipes.includes(recipe._id)
        );
        setFavouriteRecipes(userFavourites);
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
      fetchFavouriteRecipes();
    }, [currentUser.favouriteRecipes])
  );

  useEffect(() => {
    fetchFavouriteRecipes();
  }, [currentUser.favouriteRecipes]);

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
      ) : favouriteRecipes.length === 0 ? (
        <Text>No favorite recipes found.</Text>
      ) : (
        <FlatList
          data={favouriteRecipes}
          numColumns={2}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.recipeMember}
              onPress={() =>
                navigation.navigate("ViewFavouriteRecipeInfo", {
                  recipeData: item,
                })
              }
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.recipeTitle}>{item.name}</Text>
              <View style={styles.componentContainer}>
                <View style={styles.iconContainer}>
                  <Icon name="star" size={16} color="#ED6F21" style={styles.icon}/>
                  <Text style={styles.ratingText}>{item.averageRating.toFixed(1)}</Text>
                </View>

                <Text style={styles.personText}> · </Text>

                <View style={styles.iconContainer}>
                  <Icon name="person" size={16} color="#797979" style={styles.icon}/>

                  <Text style={styles.personText}>
                    {item.totalRatings}
                  </Text>
                </View>
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
    backgroundColor: "#f5f5f5",
    padding: 5,
    marginHorizontal: 5,
  },
  recipeMember: {
    alignItems: "center",
    marginVertical: 5,
    paddingVertical: 5,
    paddingHorizontal: 18,
    width: "50%",
  },
  image: {
    width: 160,
    height: 175,
    resizeMode: "cover",
    borderRadius: 10,
  },
  recipeTitle: {
    marginTop: 10,
    width: "100%",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  componentContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginTop: 10,
  },
  ratingText: {
    textAlign: "center",
    marginTop: 10,
    marginLeft: 2,
    fontSize: 12,
    fontWeight: "500",
    color: "#ED6F21",
  },
  personText: {
    textAlign: "center",
    marginTop: 10,
    marginLeft: 2,
    fontSize: 12,
    fontWeight: "500",
    color: "#797979",
  },
});
