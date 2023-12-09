import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

const ViewOrdersScreen = () => {
  const [orders, setOrders] = useState([]);

  const [selectedStatus, setSelectedStatus] = useState({});
  const [selectedDate, setSelectedDate] = useState({});
  const [showPicker, setShowPicker] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_IP}/bizRecipe/getOrders`
        );
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };

    fetchOrders();
  }, []);

  const onStatusChange = (item, value) => {
    setSelectedStatus({ ...selectedStatus, [item._id]: value });
  };

  const showTimepicker = (item) => {
    setShowPicker({ ...showPicker, [item._id]: true });
  };

  const onDateChange = (event, selectedDateValue, item) => {
    const currentDate = selectedDateValue || selectedDate[item._id];
    setSelectedDate({ ...selectedDate, [item._id]: currentDate });

    // Hide the picker regardless of the user's action
    setShowPicker({ ...showPicker, [item._id]: false });
  };
  const formatTime = (date) => {
    let hours = String(date.getHours()).padStart(2, "0");
    let minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const updateOrder = async (item) => {
    if (
      !selectedStatus[item._id] ||
      selectedStatus[item._id] === "Select status:"
    ) {
      alert("Please select a valid status.");
      return;
    }
    if (!selectedDate[item._id]) {
      alert("Please select an estimated arrival time");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/bizRecipe/updateOrder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: item._id, // ID of the order to update
            estimatedArrivalTime: formatTime(selectedDate[item._id]), // Format the date into a time string
            status: selectedStatus[item._id], // Status selected from the picker
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error updating order");
      }

      const data = await response.json();
      console.log("Order update response:", data);
      // Update the local state to reflect changes immediately
      if (selectedStatus[item._id] === "Rejected") {
        // Remove the order from the local state if it is rejected
        const updatedOrders = orders.filter((order) => order._id !== item._id);
        setOrders(updatedOrders);

        alert("Order has been deleted.");
      } else {
        // Update the local state to reflect changes immediately
        const updatedOrders = orders.map((order) => {
          if (order._id === item._id) {
            return {
              ...order,
              status: selectedStatus[item._id],
              estimatedArrivalTime: formatTime(selectedDate[item._id]),
            };
          }
          return order;
        });

        setOrders(updatedOrders);

        alert("Order changes updated.");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Error updating order. Please try again.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>{item.recipeName}</Text>
      <Text style={styles.subtitle}>
        Name: {item.userName ? item.userName : "N/A"}
      </Text>
      <Text style={styles.subtitle}>Total Price: ${item.totalPrice}</Text>
      <Text style={styles.subtitle}>Quantity: {item.quantity}</Text>
      <Text style={styles.subtitle}>Preferences: {item.preferences}</Text>
      <Text style={styles.subtitle}>Date to Deliver: {item.dateToDeliver}</Text>
      <Text style={styles.subtitle}>Time to Deliver: {item.timeToDeliver}</Text>
      <Text style={styles.subtitle}>
        Delivery Address: {item.deliveryAddress}
      </Text>
      <Text style={styles.subtitle}>Status: {item.status}</Text>
      <Text style={styles.subtitle}>
        Estimated Arrival Time: {item.estimatedArrivalTime}
      </Text>

      <Picker
        selectedValue={selectedStatus[item._id] || ""}
        style={{ height: 50, width: "100%" }}
        onValueChange={(itemValue) => onStatusChange(item, itemValue)}
      >
        <Picker.Item label="Select status:" value="" />
        <Picker.Item label="Rejected" value="Rejected" />
        <Picker.Item label="Pending" value="Pending" />
        <Picker.Item label="Preparing" value="Preparing" />
        <Picker.Item label="On the way" value="On the way" />
        <Picker.Item label="Arriving" value="Arriving" />
        <Picker.Item label="Done" value="Done" />
      </Picker>

      {showPicker[item._id] && (
        <DateTimePicker
          value={selectedDate[item._id] || new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, date) => onDateChange(event, date, item)}
        />
      )}

      <Button
        title="Select Arrival Time"
        onPress={() => showTimepicker(item)}
        color="#28a745"
      />

      <Text style={styles.timeText}>
        {selectedDate[item._id]
          ? `Time selected: ${formatTime(selectedDate[item._id])}`
          : "Time not selected"}
      </Text>

      <View style={styles.separator} />

      <Button
        title="Submit"
        onPress={() => updateOrder(item)}
        color="#007bff"
      />
    </View>
  );

  return (
    <FlatList
      data={orders}
      renderItem={renderItem}
      keyExtractor={(item) => item._id.toString()}
    />
  );
};

export default ViewOrdersScreen;

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
    // fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#007bff",
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  timeText: {
    marginTop: 5,
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  separator: {
    height: 10,
  },
});
