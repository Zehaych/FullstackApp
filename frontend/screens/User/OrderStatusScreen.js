import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Context } from "../../store/context";

const OrderStatusScreen = () => {
  const [userOrders, setUserOrders] = useState([]);
  const [currentUser, setCurrentUser] = useContext(Context);

  useEffect(() => {
    let isMounted = true;

    const fetchUserOrders = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_IP}/bizRecipe/getOrders`
        );
        const orders = await response.json();
        if (isMounted) {
          const filteredOrders = orders.filter(
            (order) => order.name._id === currentUser._id
          );

          // Sort the filtered orders by date and time
          const sortedOrders = filteredOrders.sort((a, b) => {
            const [dayA, monthA, yearA] = a.dateToDeliver.split("/");
            const startTimeA = a.timeToDeliver.split("-")[0];
            const [dayB, monthB, yearB] = b.dateToDeliver.split("/");
            const startTimeB = b.timeToDeliver.split("-")[0];
            const dateTimeA = new Date(
              `${yearA}-${monthA}-${dayA}T${startTimeA}`
            );
            const dateTimeB = new Date(
              `${yearB}-${monthB}-${dayB}T${startTimeB}`
            );

            return dateTimeA - dateTimeB; // Sort in ascending order
          });

          setUserOrders(sortedOrders);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching user orders:", error);
        }
      }
    };

    fetchUserOrders();
    const intervalId = setInterval(fetchUserOrders, 30000); // Poll every 30 seconds

    return () => {
      clearInterval(intervalId);
      isMounted = false; // Cleanup function to avoid setting state on unmounted component
    };
  }, []);

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderContainer}>
      <Text style={styles.orderTitle}>{item.recipeName}</Text>
      <Text style={styles.orderText}>
        <Text style={styles.boldLabel}>Total Price:</Text> ${item.totalPrice}
      </Text>
      <Text style={styles.orderText}>
        <Text style={styles.boldLabel}>Quantity:</Text> {item.quantity}
      </Text>
      <Text style={styles.orderText}>
        <Text style={styles.boldLabel}>Preferences:</Text> {item.preferences}
      </Text>
      <Text style={styles.orderText}>
        <Text style={styles.boldLabel}>Date to Deliver:</Text>{" "}
        {item.dateToDeliver}
      </Text>
      <Text style={styles.orderText}>
        <Text style={styles.boldLabel}>Time to Deliver:</Text>{" "}
        {item.timeToDeliver}
      </Text>
      <Text style={styles.orderText}>
        <Text style={styles.boldLabel}>Delivery Address:</Text>{" "}
        {item.deliveryAddress}
      </Text>
      <Text style={styles.orderText}>
        <Text style={styles.boldLabel}>Status:</Text> {item.status}
      </Text>
      <Text style={styles.orderText}>
        <Text style={styles.boldLabel}>Estimated Arrival Time:</Text>{" "}
        {item.estimatedArrivalTime}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={userOrders}
      renderItem={renderOrderItem}
      keyExtractor={(item) => item._id.toString()}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No ongoing orders.</Text>
      }
    />
  );
};

export default OrderStatusScreen;

const styles = StyleSheet.create({
  orderContainer: {
    backgroundColor: "white",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  orderTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  orderText: {
    fontSize: 16,
    marginBottom: 5,
  },
  boldLabel: {
    fontWeight: "bold",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
  },
});
