import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

const PaymentScreen = () => {
  const navigation = useNavigation();

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

  return (
    <View style={styles.container}>
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
      <Button title="Submit Payment" onPress={handlePayment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
});

export default PaymentScreen;
