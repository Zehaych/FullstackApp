import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const CompletedOrdersScreen = () => {
  const [pastOrders, setPastOrders] = useState([]);

  useEffect(() => {
    const fetchPastOrders = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_IP}/bizRecipe/getOrderHistory`
        );
        const data = await response.json();

        // Sort the past orders by date and time
        const sortedData = data.sort((a, b) => {
          // Convert dateToDeliver to MM/DD/YYYY format for sorting
          const [dayA, monthA, yearA] = a.dateToDeliver.split("/");
          const [dayB, monthB, yearB] = b.dateToDeliver.split("/");

          // Combine the date and time into a full datetime string
          const dateTimeStringA = `${yearA}-${monthA}-${dayA}T${a.estimatedArrivalTime}:00`;
          const dateTimeStringB = `${yearB}-${monthB}-${dayB}T${b.estimatedArrivalTime}:00`;

          // Create Date objects from the datetime strings
          const dateTimeA = new Date(dateTimeStringA);
          const dateTimeB = new Date(dateTimeStringB);

          // Sort in descending order - most recent first
          return dateTimeB - dateTimeA;
        });

        setPastOrders(sortedData);
      } catch (error) {
        console.error("Error fetching past orders: ", error);
      }
    };

    fetchPastOrders();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>{item.recipeName}</Text>
      {/* Display other details of the past order */}
      <Text style={styles.subtitle}>
        Name: {item.userName ? item.userName : "N/A"}
      </Text>
      <Text style={styles.subtitle}>Total Price: ${item.totalPrice}</Text>
      <Text style={styles.subtitle}>Quantity: {item.quantity}</Text>
      <Text style={styles.subtitle}>Preferences: {item.preferences}</Text>
      <Text style={styles.subtitle}>
        Delivery Address: {item.deliveryAddress}
      </Text>
      <Text style={styles.subtitle}>Delivery Date: {item.dateToDeliver}</Text>
      <Text style={styles.subtitle}>
        Food arrival time: {item.estimatedArrivalTime}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={pastOrders}
      renderItem={renderItem}
      keyExtractor={(item) => item._id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "white",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default CompletedOrdersScreen;
