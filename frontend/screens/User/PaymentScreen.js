import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  FlatList,
  TextInput,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { Context } from "../../store/context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

export default function PaymentScreen({ route, navigation }) {
  const { cartData } = route.params;
  const [username, setUsername] = useState("");

  const [currentUser, setCurrentUser] = useContext(Context);
  const [userCart, setUserCart] = useState(currentUser.cart);

  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [address, setAddress] = useState("");

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [selectedTime, setSelectedTime] = useState("12:30-13:00");

  const [serviceFee, setServiceFee] = useState(4.0);

  // Calculate total price from cartData
  useEffect(() => {
    const cartTotal = cartData.reduce(
      (total, item) => total + item.quantity * item.recipePrice,
      0
    );
    setTotalPrice(cartTotal);
  }, [cartData]);

  const getTotalPayment = () => {
    if (typeof totalPrice === "number" && typeof serviceFee === "number") {
      const total = totalPrice + serviceFee;
      return total.toFixed(2);
    }
    return "0.00";
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const showDatePicker = () => {
    setShow(true);
    setMode("date");
  };

  const formatDate = (date) => {
    // Format the date
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const handleSubmitPayment = async () => {
    const orderDetails = {
      userId: currentUser._id,
      cartItems: userCart,
      deliveryAddress: address,
      deliveryDate: formatDate(date),
      deliveryTime: selectedTime,
    };

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/bizRecipe/submitOrder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderDetails),
        }
      );

      if (!response.ok) {
        throw new Error("Something went wrong with the order submission");
      }

      const data = await response.json();
      console.log("Order submitted successfully:", data);

      // clear cart if order submission is successful
      await clearCart();

      alert(
        "Payment successful! Track your order status from Business Recipes."
      );
      navigation.navigate("TabScreen");
    } catch (error) {
      console.error("Order submission failed:", error);
    }
  };

  const confirmAndSubmitPayment = () => {
    Alert.alert(
      "Confirm Order Submission",
      "Once you make this order, you will not be able to cancel it. Do you wish to continue?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: handleSubmitPayment },
      ],
      { cancelable: false }
    );
  };

  // const incrementQuantity = () => {
  //   const newQuantity = quantity + 1;
  //   setQuantity(newQuantity);
  //   setTotalPrice(newQuantity * cartData.price);
  // };

  // const decrementQuantity = () => {
  //   if (quantity > 1) {
  //     const newQuantity = quantity - 1;
  //     setQuantity(newQuantity);
  //     setTotalPrice(newQuantity * cartData.price);
  //   }
  // };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const getTotalPrice = () => {
    if (typeof totalPrice === "number") {
      return `$${totalPrice.toFixed(2)}`;
    }
    return "$0.00";
  };

  // const [orderPreferences, setOrderPreferences] = useState([]);
  // const [currentOrder, setCurrentOrder] = useState({
  //   quantity: 1,
  //   preferences: "",
  // });

  // const addOrderToCart = () => {
  //   const order = { ...currentOrder, cartData };
  //   setOrderPreferences([...orderPreferences, order]);
  //   setCurrentOrder({ quantity: 1, preferences: "" });
  // };

  const clearCart = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/user/clearBizCart/${currentUser._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: currentUser._id }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setCurrentUser({
          ...currentUser,
          cart: result.cart,
        });
        setUserCart(result.cart);
        // Alert.alert("Success", "Cart cleared successfully");
      } else {
        Alert.alert("Error", "Failed to clear cart");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      Alert.alert("Error", "An error occurred while clearing the cart.");
    }
  };

  return (
    <View style={styles.viewcontainer}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.detailBox}>
            <Text style={styles.title}>Order Details </Text>

            {userCart.length > 0 ? (
              <View>
                {userCart.map((cart, index) => (
                  <View key={index} style={styles.orderContainer}>
                    <Text style={styles.subTitle}>{cart.recipeName} </Text>

                    {/* cost & quantity */}
                    <View style={styles.amountContainer}>
                      <View style={styles.amount}>
                        <Text style={styles.amountText}>
                          ${cart.recipePrice}
                        </Text>
                      </View>

                      <View style={styles.quantity}>
                        <Text style={styles.amountText}>x {cart.quantity}</Text>
                      </View>
                    </View>

                    {/* preferences */}
                    <View style={styles.preferencesContainer}>
                      <View>
                        <Text style={styles.itemDetailLeftText}>
                          Preferences
                        </Text>
                      </View>

                      <View style={styles.itemDetailRight}>
                        <Text style={styles.itemDetailRightText}>
                          {cart.preferences}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.divider}></View>
                  </View>
                ))}
                <View style={styles.amountContainer}>
                  <View style={styles.amount}>
                    <Text style={styles.label}>Total Items</Text>
                  </View>

                  <View style={styles.quantity}>
                    <Text style={styles.amountText}>{userCart.length}</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.mainBox}>
                <Text style={styles.noReviewsText}>No ongoing orders.</Text>
              </View>
            )}
          </View>

          <View>
            {/* </View> */}
            <View style={styles.detailBox}>
              {/* <PaymentScreen /> */}
              <Text style={styles.title}>Delivery Information</Text>

              <Text style={styles.label}>Delivery Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Delivery Address"
                value={address}
                onChangeText={(text) => setAddress(text)}
              />

              <Text style={styles.label}>Delivery Date</Text>

              {/* <Button title="Submit Payment" onPress={handlePayment} /> */}
              <TouchableOpacity
                onPress={showDatePicker}
                style={styles.inputDate}
              >
                <Text style={styles.dateText}>Select Date</Text>
                <Text style={styles.dateText}>{formatDate(date)}</Text>
              </TouchableOpacity>

              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  onChange={onChangeDate}
                />
              )}

              {/* Display selected date */}
              {/* <Text style={styles.selectedDateText}>
                Selected Date: {formatDate(date)}
              </Text> */}

              <Text style={styles.label}>Delivery Time</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedTime}
                  style={styles.picker}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedTime(itemValue)
                  }
                >
                  <Picker.Item label="07:30 - 08:00" value="07:30-08:00" />
                  <Picker.Item label="08:00 - 08:30" value="08:00-08:30" />
                  <Picker.Item label="08:30 - 09:00" value="08:30-09:00" />
                  <Picker.Item label="09:00 - 09:30" value="09:00-09:30" />
                  <Picker.Item label="09:30 - 10:00" value="09:30-10:00" />
                  <Picker.Item label="10:00 - 10:30" value="10:00-10:30" />
                  <Picker.Item label="10:30 - 11:00" value="10:30-11:00" />
                  <Picker.Item label="11:00 - 11:30" value="11:00-11:30" />
                  <Picker.Item label="11:30 - 12:00" value="11:30-12:00" />
                  <Picker.Item label="12:00 - 12:30" value="12:00-12:30" />
                  <Picker.Item label="12:30 - 13:00" value="12:30-13:00" />
                  <Picker.Item label="13:00 - 13:30" value="13:00-13:30" />
                  <Picker.Item label="13:30 - 14:00" value="13:30-14:00" />
                  <Picker.Item label="14:00 - 14:30" value="14:00-14:30" />
                  <Picker.Item label="14:30 - 15:00" value="14:30-15:00" />
                  <Picker.Item label="15:00 - 15:30" value="15:00-15:30" />
                  <Picker.Item label="15:30 - 16:00" value="15:30-16:00" />
                  <Picker.Item label="16:00 - 16:30" value="16:00-16:30" />
                  <Picker.Item label="16:30 - 17:00" value="16:30-17:00" />
                  <Picker.Item label="17:00 - 17:30" value="17:00-17:30" />
                  <Picker.Item label="17:30 - 18:00" value="17:30-18:00" />
                  <Picker.Item label="18:00 - 18:30" value="18:00-18:30" />
                  <Picker.Item label="18:30 - 19:00" value="18:30-19:00" />
                  <Picker.Item label="19:00 - 19:30" value="19:00-19:30" />
                  <Picker.Item label="19:30 - 20:00" value="19:30-20:00" />
                  <Picker.Item label="20:00 - 20:30" value="20:00-20:30" />
                  <Picker.Item label="20:30 - 21:00" value="20:30-21:00" />
                  <Picker.Item label="21:00 - 21:30" value="21:00-21:30" />
                  <Picker.Item label="21:30 - 22:00" value="21:30-22:00" />

                  {/* Add more time slots as needed */}
                </Picker>
              </View>
            </View>

            <View style={styles.detailBox}>
              {/* <PaymentScreen /> */}
              <Text style={styles.title}>Payment Details</Text>
              <Text style={styles.label}>Card Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Card Number"
                value={cardNumber}
                onChangeText={(text) => setCardNumber(text)}
              />
              <Text style={styles.label}>Cardholder Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Cardholder Name"
                value={cardholderName}
                onChangeText={(text) => setCardholderName(text)}
              />
              <Text style={styles.label}>Expiration Date</Text>
              <TextInput
                style={styles.input}
                placeholder="Expiration Date (MM/YY)"
                value={expiryDate}
                onChangeText={(text) => setExpiryDate(text)}
              />
              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="CVV"
                value={cvv}
                onChangeText={(text) => setCvv(text)}
              />
            </View>

            <StatusBar style="auto" />
          </View>
        </View>
      </ScrollView>

      <View style={styles.priceContainer}>
        <View style={styles.totalPriceContainer}>
          <Text style={styles.amountText}>Subtotal</Text>

          <Text style={styles.amountText}>{getTotalPrice()}</Text>
        </View>

        <View style={styles.totalPriceContainer}>
          <Text style={styles.amountText}>Service fees</Text>

          <Text style={styles.amountText}>{formatPrice(serviceFee)}</Text>
        </View>

        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPrice}>Total Payment</Text>

          <Text style={styles.totalPrice}>${getTotalPayment()}</Text>
        </View>

        <TouchableOpacity
          style={styles.addToCartbutton}
          onPress={confirmAndSubmitPayment}
        >
          <Text style={styles.submitButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    padding: 20,
    height: "50%",
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
    // textAlign: "center",
    marginBottom: 16,
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
    backgroundColor: "#0066cc",
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
    // marginTop: 10,
    color: "#333",
  },
  priceTag: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
    color: "#333",
  },
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
    marginBottom: 30,
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
  inputDate: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  datePickerButton: {
    backgroundColor: "orange",
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
  dateText: {
    fontSize: 14,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: "center",
  },
  selectedDateText: {
    // fontSize: 18,
    // fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },
  priceContainer: {
    // flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 4,
    backgroundColor: "white",
  },
  totalPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  viewcontainer: {
    flex: 1,
  },
  detailBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3.84,
    shadowOpacity: 0.25,
    elevation: 5,
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  amountText: {
    fontSize: 16,
    color: "black",
  },
  preferencesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemDetailLeftText: {
    fontSize: 14,
  },
  itemDetailRightText: {
    fontSize: 14,
    color: "#F97316",
    textAlign: "right",
  },
  itemDetailRight: {
    width: "50%",
  },
  orderContainer: {
    gap: 8,
  },
  divider: {
    marginBottom: 8,
    height: 1,
    width: "100%",
    backgroundColor: "#C6C6CD",
  },
  addToCartbutton: {
    backgroundColor: "#ED6F21",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginTop: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
