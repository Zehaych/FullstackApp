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
import Icon from "react-native-vector-icons/FontAwesome";
import { Context } from "../../store/context";

export default function PreferencesScreen({ route, navigation }) {
  const { recipeData } = route.params;
  const [username, setUsername] = useState("");

  const [currentUser, setCurrentUser] = useContext(Context);

  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(recipeData.price);

  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [address, setAddress] = useState("");

  const handlePayment = () => {
    // Dummy payment logic (for demonstration purposes)
    if (cardNumber && cardholderName && expiryDate && cvv && address) {
      alert("Payment successful!");
      navigation.navigate("TabScreen");
    } else {
      alert("Please fill in all payment details.");
    }
  };

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

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const getTotalPrice = () => {
    return formatPrice(totalPrice);
  };

  const [orderPreferences, setOrderPreferences] = useState([]);
  const [currentOrder, setCurrentOrder] = useState({
    quantity: 1,
    preferences: "",
  });

  const addOrderToCart = () => {
    const order = { ...currentOrder, recipeData };
    setOrderPreferences([...orderPreferences, order]);
    setCurrentOrder({ quantity: 1, preferences: "" });
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipeData.image }} style={styles.image} />
        </View>
        <Text style={styles.title}>{recipeData.name}</Text>

        <View style={styles.mainBox}>
          {currentUser.foodRestrictions.length > 0 && (
            <View>
              <View style={styles.section}>
                <Text style={styles.subTitle}>Disclaimer: </Text>
                <Text>
                  Based on your medical history, it is recommended to minimize
                  or abstain from using{" "}
                  <Text style={{ color: "red", fontWeight: "bold" }}>
                    {currentUser.foodRestrictions.join(", ")}
                  </Text>{" "}
                  when ordering the recipe. {"\n"}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.preferencesContainer}>
            <Text style={styles.subTitle}>Preferences:</Text>
            <TextInput
              style={styles.preferencesInput}
              placeholder="Specify preferences for your orders..."
              value={currentOrder.preferences}
              onChangeText={(text) =>
                setCurrentOrder({ ...currentOrder, preferences: text })
              }
              multiline={true}
              numberOfLines={4}
            />
          </View>
        </View>

        <View style={styles.mainBox}>
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
          <Text style={styles.totalPrice}>Total Price: {getTotalPrice()}</Text>
        </View>

        {/* </View> */}

        {/* <PaymentScreen /> */}
        <Text style={styles.title}>Payment</Text>

        <View style={styles.mainBox}>
          <View style={styles.paymentContainer}>
            <Text style={styles.label}>Card Number:</Text>
            <TextInput
              style={styles.input}
              placeholder="Card Number"
              value={cardNumber}
              onChangeText={(text) => setCardNumber(text)}
            />
            <Text style={styles.label}>Cardholder Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Cardholder Name"
              value={cardholderName}
              onChangeText={(text) => setCardholderName(text)}
            />
            <Text style={styles.label}>Expiration Date:</Text>
            <TextInput
              style={styles.input}
              placeholder="Expiration Date (MM/YY)"
              value={expiryDate}
              onChangeText={(text) => setExpiryDate(text)}
            />
            <Text style={styles.label}>CVV:</Text>
            <TextInput
              style={styles.input}
              placeholder="CVV"
              value={cvv}
              onChangeText={(text) => setCvv(text)}
            />
            <Text style={styles.label}>Delivery Address:</Text>
            <TextInput
              style={styles.input}
              placeholder="Delivery Address"
              value={address}
              onChangeText={(text) => setAddress(text)}
            />
            {/* <Button title="Submit Payment" onPress={handlePayment} /> */}
          </View>
        </View>

        <StatusBar style="auto" />
      </View>

      <TouchableOpacity style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>Submit payment</Text>
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
    width: 310, // Reduced width
    height: 310, // Reduced height
    resizeMode: "contain",
    borderRadius: 20,
  },
  title: {
    color: "#333333",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
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
    marginTop: 10,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  quantityButton: {
    backgroundColor: "#ddd",
    borderRadius: 5,
    padding: 8,
    marginHorizontal: 10,
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
    color: "#333",
  },
  // totalPrice: {
  //   fontSize: 18,
  //   fontWeight: "bold",
  //   textAlign: "center",
  //   marginTop: 10,
  // },
  preferencesContainer: {
    marginBottom: 20,
  },
  preferencesInput: {
    height: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  mainBox: {
    borderWidth: 2,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    paddingBottom: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    paddingBottom: 10,
  },
  paymentContainer: {
    // backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    // backgroundColor: "#f9f9f9", // Slightly different background
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
});
