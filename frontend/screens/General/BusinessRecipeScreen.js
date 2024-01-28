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
import React, { useState, useEffect, useContext, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Context } from "../../store/context";

export default function BusinessRecipeScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ongoingOrder, setOngoingOrder] = useState(null);
  const [currentUser, setCurrentUser] = useContext(Context);

  const url = `${process.env.EXPO_PUBLIC_IP}/bizRecipe`;

  const fetchOngoingOrders = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/bizRecipe/getOrders`
      );
      const orders = await response.json();
      // Filter for ongoing orders for the current user
      const userOngoingOrders = orders.filter(
        (order) => order.name._id === currentUser._id
      );
      setOngoingOrder(userOngoingOrders);
    } catch (error) {
      console.error("Error fetching ongoing orders:", error);
    }
  };

  const handleOrderStatusClick = () => {
    // Navigate to a screen where the user can view all their ongoing orders
    navigation.navigate("Order Status", { orders: ongoingOrder });
  };

  // In the render part
  {
    ongoingOrder && ongoingOrder.length > 0 && (
      <TouchableOpacity
        style={styles.orderStatusBanner}
        onPress={handleOrderStatusClick}
      >
        <Text style={styles.orderStatusText}>
          You have {ongoingOrder.length} ongoing orders
        </Text>
      </TouchableOpacity>
    );
  }

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.log(error));

    // Fetch ongoing orders for the current user
    fetchOngoingOrders();
  }, [url]);
  //navigate to recipe info page
  const handleRecipeInfo = (recipeData) => {
    navigation.navigate("Business Recipe Information", { recipeData });
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

  useEffect(() => {
    fetchOngoingOrders();

    // Set up an interval to refresh ongoing orders
    const interval = setInterval(() => {
      fetchOngoingOrders();
    }, 5000); // every 1000 is 1 second

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  // new
  useEffect(() => {
    let isMounted = true; // flag to track mounted state

    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`Network response was not ok: ${response.status}`);
        const json = await response.json();
        if (isMounted) setData(json); // set data only if component is mounted
      } catch (error) {
        console.log(error);
      } finally {
        if (isMounted) setLoading(false); // set loading to false only if component is mounted
      }
    };

    fetchRecipes();

    return () => {
      isMounted = false; // cleanup function to set flag false
    };
  }, [url]);

  const fetchRecipes = () => {
    setLoading(true);
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
  };

  // Use useFocusEffect to refetch recipes when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchRecipes();
      return () => {};
    }, [url])
  );

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
      {/* Order status banner */}
      {ongoingOrder && ongoingOrder.length > 0 && (
        <TouchableOpacity
          style={styles.orderStatusBanner}
          onPress={handleOrderStatusClick}
        >
          <Text style={styles.orderStatusText}>
            You have {ongoingOrder.length} ongoing orders. Tap to view details.
          </Text>
        </TouchableOpacity>
      )}

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

//const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 5,
    marginHorizontal: 5,
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
  orderStatusBanner: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: "#ED6F21",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  orderStatusText: {
    color: "white",
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
