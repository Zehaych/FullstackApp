import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Context } from "../../store/context";

const ViewPastOrdersScreen = () => {
  const [pastOrders, setPastOrders] = useState([]);
  const [currentUser, setCurrentUser] = useContext(Context);

  useEffect(() => {
    const fetchPastOrders = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_IP}/bizRecipe/getOrderHistory`
        );
        const data = await response.json();
        if (data && currentUser) {
          // Filter orders to only include those that match currentUser._id
          const filteredOrders = data.filter(
            (order) =>
              order.name &&
              order.name._id.toString() === currentUser._id.toString()
          );
          setPastOrders(filteredOrders);
        }
      } catch (error) {
        console.error("Error fetching past orders: ", error);
      }
    };

    fetchPastOrders();
  }, [currentUser]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>{item.recipeName}</Text>

      <Text style={styles.subtitle}>Total Price: ${item.totalPrice}</Text>
      <Text style={styles.subtitle}>Quantity: {item.quantity}</Text>
      <Text style={styles.subtitle}>Preferences: {item.preferences}</Text>
      <Text style={styles.subtitle}>
        Delivery Address: {item.deliveryAddress}
      </Text>
      <Text style={styles.subtitle}>
        Food Arrival Time: {item.estimatedArrivalTime}
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

export default ViewPastOrdersScreen;
