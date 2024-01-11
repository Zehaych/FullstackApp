import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Context } from "../../store/context";

const OrderStatusScreen = () => {
  const [userOrders, setUserOrders] = useState([]);
  const [currentUser, setCurrentUser] = useContext(Context);

  // Check if there are any 'Done' or 'Rejected' orders
  const hasDoneOrRejectedOrders = userOrders.some((order) =>
    ["Done", "Rejected"].includes(order.status)
  );

  const confirmOrderClear = () => {
    Alert.alert(
      "Confirm Deletion",
      "Do you want to clear all done or rejected orders?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => clearOrders() },
      ],
      { cancelable: true }
    );
  };

  const clearOrders = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/bizRecipe/clearOrders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: currentUser._id }),
        }
      );
      const result = await response.json();
      if (result.success) {
        setUserOrders(
          userOrders.filter(
            (order) => !["Done", "Rejected"].includes(order.status)
          )
        );
        Alert.alert("Success", "Orders cleared successfully");
      } else {
        Alert.alert("Error", "Failed to clear orders");
      }
    } catch (error) {
      console.error("Error clearing orders:", error);
    }
  };

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
    <View style={styles.itemContainer}>
      <View style={styles.orderContainer}>

        {/* title & status */}
        <View style={styles.titleContainer}>
          <View>
            <Text style={styles.title}>{item.recipeName}</Text>
          </View>

          <View style={styles.itemDetailRight}>
            <Text style={styles.itemDetailRightText}>{item.status}</Text>
          </View>
        </View>

        {/* cost & quantity */}
        <View style={styles.amountContainer}>
          <View style={styles.amount}>
            <Text style={styles.amountText}>${item.totalPrice}</Text>
          </View>

          <View style={styles.quantity}>
            <Text style={styles.amountText}>x {item.quantity}</Text>
          </View>      
        </View>
        
        <View style={styles.divider} />    

        {/* preferences */}
        <View style={styles.itemDetailContainer}>
          <View>
            <Text style={styles.itemDetailLeftText}>Preferences</Text>
          </View>

          <View style={styles.itemDetailRight}>
            <Text style={styles.itemDetailRightText}>{item.preferences}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.orderDetailContainer}>

        {/* Date of Delivery */}
        <View style={styles.itemDetailContainer}>        
          <View>
            <Text style={styles.itemDetailLeftText}>Date of Delivery</Text>
          </View>

          <View style={styles.itemDetailRight}>
            <Text style={styles.itemDetailRightText}>{item.dateToDeliver}</Text>
          </View>
        </View>

        {/* Time of Delivery */}
        <View style={styles.itemDetailContainer}>        
          <View>
            <Text style={styles.itemDetailLeftText}>Time of Delivery</Text>
          </View>

          <View style={styles.itemDetailRight}>
            <Text style={styles.itemDetailRightText}>{item.timeToDeliver}</Text>
          </View>
        </View>

        {/* Estimated Arrival Time */}
        <View style={styles.itemDetailContainer}>
          <View>
            <Text style={styles.itemDetailLeftText}>Estimated Arrival Time</Text>
          </View>

          <View style={styles.itemDetailRight}>
            <Text style={styles.itemDetailRightText}>{item.estimatedArrivalTime}</Text>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.itemDetailContainer}>
          <View>
            <Text style={styles.itemDetailLeftText}>Delivery Address</Text>
          </View>

          <View style={styles.itemDetailRight}>
            <Text style={styles.itemDetailRightText}>{item.deliveryAddress}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Conditionally render the button */}
      {hasDoneOrRejectedOrders && (
        <TouchableOpacity
          onPress={confirmOrderClear}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>
            Clear Done/Rejected Orders
          </Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={userOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item._id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No ongoing orders.</Text>
        }
      />
    </View>
  );
};

export default OrderStatusScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: "white",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  deleteButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 10,
    margin: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  orderContainer: {
    gap: 4,
    paddingBottom: 4,
    paddingTop: 8,
  },
  orderDetailContainer: {
    gap: 6,
    paddingBottom: 4,
    paddingTop: 4,
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemDetailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemDetailRight: {
    width: "50%",
  },
  amountText: {
    fontSize: 16,
    color: "#676767",
  },
  itemDetailLeftText: {
    fontSize: 14,
  },
  itemDetailRightText: {
    fontSize: 14,
    color: "#F97316",
    textAlign: "right",
  },
  divider: {
    borderBottomColor: "#C6C6CD",
    borderBottomWidth: 1,
    alignSelf: "center",
    width: "100%",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
  },
});
