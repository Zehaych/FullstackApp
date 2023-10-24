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
import React, { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome";

export default function BusinessRecipeInfoScreen({ route, navigation }) {
  const { recipeData } = route.params;
  const [username, setUsername] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(recipeData.price);

  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    setTotalPrice(newQuantity * recipeData.price);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      setTotalPrice(newQuantity * recipeData.price);
    }
  };

  const navigateToPayment = () => {
    navigation.navigate("Payment");
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const getTotalPrice = () => {
    return formatPrice(totalPrice);
  };

  //   const url = `${process.env.EXPO_PUBLIC_IP}/user/getUserById/${recipeData.submitted_by}`;

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
        <Text style={styles.title}>{recipeData.name}</Text>
        <Text style={styles.subTitle}>Company name: </Text>
        <Text>{username}</Text>
        <Text style={styles.subTitle}>Ingredients: </Text>
        <Text>
          {recipeData.ingredients.map((ingredient, index) => (
            <Text key={index}>{ingredient}, </Text>
          ))}
        </Text>
        <Text style={styles.subTitle}>Instructions: </Text>
        <Text>{recipeData.instructions}</Text>
        <Text style={styles.subTitle}>Calories: </Text>
        <Text>{recipeData.calories}</Text>
        <Text style={styles.subTitle}>Price: </Text>
        <Text>{formatPrice(recipeData.price)}</Text>

        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Quantity:</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={decrementQuantity}
          >
            <Icon name="minus" size={20} color="#0066cc" />
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={incrementQuantity}
          >
            <Icon name="plus" size={20} color="#0066cc" />
          </TouchableOpacity>
        </View>
        {/* <Text style={styles.subTitle}>Total Price: </Text> */}
        <Text style={styles.totalPrice}>Total Price: {getTotalPrice()}</Text>

        <StatusBar style="auto" />
      </View>

      <TouchableOpacity style={styles.button} onPress={navigateToPayment}>
        <Text style={styles.buttonText}>Prepare this meal for me</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCD3",
    padding: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  button: {
    backgroundColor: "#0066cc",
    padding: 10,
    borderRadius: 10,
    margin: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  quantityButton: {
    backgroundColor: "#ddd",
    borderRadius: 5,
    padding: 5,
  },
  quantity: {
    fontSize: 20,
    marginHorizontal: 10,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
});
