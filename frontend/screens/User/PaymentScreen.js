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
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

export default function PaymentScreen({ route, navigation }) {
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

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [selectedTime, setSelectedTime] = useState("12:30-13:00");

  const [serviceFee, setServiceFee] = useState(4.0);

  const getTotalPayment = () => {
    const subtotal = totalPrice;
    const total = subtotal + serviceFee;
    return total.toFixed(2);
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
    if (
      cardNumber &&
      cardholderName &&
      expiryDate &&
      cvv &&
      address &&
      date &&
      selectedTime
    ) {
      try {
        // Fetch recipe details including orderInfo
        const recipeResponse = await fetch(
          `${process.env.EXPO_PUBLIC_IP}/bizRecipe/getBizRecipeIdByUserId/${recipeData._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!recipeResponse.ok) {
          throw new Error("Unable to fetch recipe details.");
        }

        const recipeInfo = await recipeResponse.json();

        // Check for ongoing order
        const hasOngoingOrder =
          recipeInfo.orderInfo &&
          recipeInfo.orderInfo.some(
            (order) =>
              order.name &&
              order.name._id.toString() === currentUser._id.toString()
          );

        if (hasOngoingOrder) {
          alert(
            "You have an ongoing order for this recipe, please cancel your order to reorder again."
          );
          return;
        }

        // No ongoing order, proceed to submit new order
        const orderData = {
          userId: currentUser._id, // Replace with the actual user ID from context or state
          quantity: quantity,
          preferences: currentOrder.preferences,
          timeToDeliver: selectedTime,
          dateToDeliver: formatDate(date),
          deliveryAddress: address,
          totalPrice: getTotalPayment(), // This should include the service fee
          estimatedArrivalTime: "-",
          status: "Pending",
        };

        const orderResponse = await fetch(
          `${process.env.EXPO_PUBLIC_IP}/bizRecipe/submitOrder/${recipeData._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
          }
        );

        if (!orderResponse.ok) {
          throw new Error("Something went wrong!");
        }

        alert(
          "Payment successful! Track your order status from Business Recipes."
        );
        navigation.navigate("TabScreen");
      } catch (error) {
        alert("Payment failed: " + error.message);
      }
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

          <View style={styles.mainBox}>
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Quantity:</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={decrementQuantity}
              >
                <Icon name="minus" size={20} color="white" />
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={incrementQuantity}
              >
                <Icon name="plus" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.totalPrice}>
              Total Price: {getTotalPrice()}
            </Text>
          </View>
        </View>
        {/* 
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
        </View> */}

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
            <Text style={styles.label}>Delivery Date:</Text>

            {/* <Button title="Submit Payment" onPress={handlePayment} /> */}
            <TouchableOpacity
              onPress={showDatePicker}
              style={styles.datePickerButton}
            >
              <Text style={styles.buttonText}>Select Date</Text>
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
            <Text style={styles.selectedDateText}>
              Selected Date: {formatDate(date)}
            </Text>

            <Text style={styles.label}>Delivery Time:</Text>
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
            <Text style={styles.priceTag}>Subtotal: {getTotalPrice()}</Text>
            <Text style={styles.priceTag}>
              Service fees: ${serviceFee.toFixed(2)}
            </Text>
            <Text style={styles.totalPrice}>
              Total payment: ${getTotalPayment()}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmitPayment}
            >
              <Text style={styles.buttonText}>Submit payment</Text>
            </TouchableOpacity>
          </View>
        </View>

        <StatusBar style="auto" />
      </View>
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
    marginTop: 10,
    color: "#333",
  },
  priceTag: {
    fontSize: 15,
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
  picker: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedDateText: {
    // fontSize: 18,
    // fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },
});
