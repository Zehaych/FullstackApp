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
            recipe.submitted_by && recipe.submitted_by === currentUser._id
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
                navigation.navigate("Business Recipe Info", {
                  recipeData: item,
                })
              }
            >
              <Image source={{ uri: item.image }} style={styles.image} />

              <View style={styles.componentContainer}>
                
                <Text style={styles.recipeTitle}>{item.name}</Text>
                
                <View style={styles.iconContainer}>
                  <Icon name="star" size={16} color="#ED6F21" style={styles.icon}/>
                  <Text style={styles.ratingText}>{item.averageRating.toFixed(1)}</Text>
                </View>
  
              </View>

              {/* <Text style={styles.personText}> · </Text> */}

              <View style={styles.personContainer}>
                <Icon name="person" size={16} color="#797979" style={styles.icon}/>

                <Text style={styles.personText}>
                  {item.totalRatings} {item.totalRatings < 2 ? 'review' : 'reviews'}
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
    backgroundColor: "#f5f5f5",
    padding: 5,
    marginHorizontal: 5,
  },
  recipeMember: {
    //flex: 1,
    alignItems: "center",
    //justifyContent: "center",
    marginVertical: 5,
    //borderWidth: 1,
    //borderColor: "#ccc",
    //borderRadius: 10,
    //overflow: 'hidden',
    paddingVertical: 5,
    paddingHorizontal: 5,
    width: "50%",
  },
  image: {
    width: 160,
    height: 175,
    resizeMode: "cover",
    borderRadius: 10,
  },
  recipeTitle: {
    // textAlign: "center",
    marginTop: 10,
    width: "80%",
    fontSize: 16,
    // fontWeight: "bold",
  },
  componentContainer: {
    flexDirection: "row",
    //alignItems: "center",
    // justifyContent: "left",
    // width: "100%",
    marginRight: 5,
    marginLeft: 5,
    paddingHorizontal: 15,
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
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  personContainer: {
    flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "center",
    width: "100%",
    paddingHorizontal: 15,

  },
});


/*              <Rating rating={item.averageRating} />
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
              </View> */
