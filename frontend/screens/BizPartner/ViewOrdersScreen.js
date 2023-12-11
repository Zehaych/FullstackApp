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

  const [disabledOrders, setDisabledOrders] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_IP}/bizRecipe/getOrders`
        );
        const data = await response.json();

        // Function to parse date strings into Date objects
        const parseDate = (dateStr, timeStr) => {
          const [day, month, year] = dateStr.split("/");
          const [hour, minute] = timeStr.split(":");
          return new Date(year, month - 1, day, hour, minute);
        };

        // Sort the orders
        const sortedData = data.sort((a, b) => {
          // Prioritize 'Rejected' and 'Done' statuses
          if (a.status === "Rejected" && b.status !== "Rejected") return 1;
          if (b.status === "Rejected" && a.status !== "Rejected") return -1;
          if (a.status === "Done" && b.status !== "Done") return 1;
          if (b.status === "Done" && a.status !== "Done") return -1;

          // Parse dates for 'Rejected' and 'Done' statuses
          if (a.status === "Rejected" || a.status === "Done") {
            const dateA = parseDate(a.dateToDeliver, a.estimatedArrivalTime);
            const dateB = parseDate(b.dateToDeliver, b.estimatedArrivalTime);
            return dateA - dateB;
          }

          // Parse dates for other statuses
          const [timeToDeliverA] = a.timeToDeliver.split("-");
          const [timeToDeliverB] = b.timeToDeliver.split("-");
          const dateA = parseDate(a.dateToDeliver, timeToDeliverA);
          const dateB = parseDate(b.dateToDeliver, timeToDeliverB);
          return dateA - dateB;
        });

        // Initialize the disabledOrders state
        const initialDisabledState = data.reduce((acc, order) => {
          acc[order._id] =
            order.status === "Rejected" || order.status === "Done";
          return acc;
        }, {});

        setDisabledOrders(initialDisabledState);
        setOrders(sortedData);
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
    if (!selectedStatus[item._id]) {
      alert("Please select a valid status.");
      return;
    }

    if (selectedStatus[item._id] !== "Rejected" && !selectedDate[item._id]) {
      alert("Please select an estimated arrival time for the order.");
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
            orderId: item._id,
            estimatedArrivalTime:
              selectedStatus[item._id] === "Rejected"
                ? "-"
                : formatTime(selectedDate[item._id]),
            status: selectedStatus[item._id],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error updating order");
      }

      if (response.ok) {
        // Mark the order as disabled if the status is 'Rejected' or 'Done'
        if (
          selectedStatus[item._id] === "Rejected" ||
          selectedStatus[item._id] === "Done"
        ) {
          setDisabledOrders((prev) => ({ ...prev, [item._id]: true }));
        }
      }

      const updatedOrderData = await response.json();
      console.log("Order update response:", updatedOrderData);

      // Update the order in the local state
      const updatedOrders = orders.map((order) => {
        if (order._id === item._id) {
          return {
            ...order,
            status: selectedStatus[item._id],
            estimatedArrivalTime:
              selectedStatus[item._id] === "Rejected"
                ? "-"
                : formatTime(selectedDate[item._id]),
          };
        }
        return order;
      });

      setOrders(updatedOrders);
      alert("Order status updated successfully.");
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Error updating order. Please try again.");
    }
  };

  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     try {
  //       const response = await fetch(
  //         `${process.env.EXPO_PUBLIC_IP}/bizRecipe/getOrders`
  //       );
  //       const data = await response.json();

  //       // Sort the orders
  //       const sortedData = data.sort((a, b) => {
  //         // Place 'Rejected' orders at the bottom
  //         if (a.status === "Rejected" && b.status !== "Rejected") return 1;
  //         if (b.status === "Rejected" && a.status !== "Rejected") return -1;

  //         // Place 'Done' orders above 'Rejected' but below others
  //         if (a.status === "Done" && b.status !== "Done") return 1;
  //         if (b.status === "Done" && a.status !== "Done") return -1;

  //         // Convert dateToDeliver to MM/DD/YYYY format and extract the start time from timeToDeliver
  //         const [dayA, monthA, yearA] = a.dateToDeliver.split("/");
  //         const startTimeA = a.timeToDeliver.split("-")[0];
  //         const [dayB, monthB, yearB] = b.dateToDeliver.split("/");
  //         const startTimeB = b.timeToDeliver.split("-")[0];

  //         const dateA = new Date(`${monthA}/${dayA}/${yearA} ${startTimeA}`);
  //         const dateB = new Date(`${monthB}/${dayB}/${yearB} ${startTimeB}`);
  //         return dateA - dateB;
  //       });

  //       setOrders(sortedData);
  //     } catch (error) {
  //       console.error("Error fetching orders: ", error);
  //     }
  //   };

  //   fetchOrders();
  // }, []);

  const renderItem = ({ item }) => {
    const isDisabled = disabledOrders[item._id];

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.title}>{item.recipeName}</Text>
        <Text style={styles.subtitle}>
          <Text style={styles.boldLabel}>Name:</Text>{" "}
          {item.userName ? item.userName : "N/A"}
        </Text>
        <Text style={styles.subtitle}>
          <Text style={styles.boldLabel}>Total Price:</Text> ${item.totalPrice}
        </Text>
        <Text style={styles.subtitle}>
          <Text style={styles.boldLabel}>Quantity:</Text> {item.quantity}
        </Text>
        <Text style={styles.subtitle}>
          <Text style={styles.boldLabel}>Preferences:</Text> {item.preferences}
        </Text>
        <Text style={styles.subtitle}>
          <Text style={styles.boldLabel}>Date to Deliver:</Text>{" "}
          {item.dateToDeliver}
        </Text>
        <Text style={styles.subtitle}>
          <Text style={styles.boldLabel}>Time to Deliver:</Text>{" "}
          {item.timeToDeliver}
        </Text>
        <Text style={styles.subtitle}>
          <Text style={styles.boldLabel}>Delivery Address:</Text>{" "}
          {item.deliveryAddress}
        </Text>
        <Text style={styles.subtitle}>
          <Text style={styles.boldLabel}>Status:</Text> {item.status}
        </Text>
        <Text style={styles.subtitle}>
          <Text style={styles.boldLabel}>Estimated Arrival Time:</Text>{" "}
          {item.estimatedArrivalTime}
        </Text>
        {/* <Text style={styles.subtitle}>
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
      </Text> */}
        <Picker
          selectedValue={selectedStatus[item._id] || ""}
          style={{ height: 50, width: "100%" }}
          onValueChange={(itemValue) => onStatusChange(item, itemValue)}
          enabled={!isDisabled} // Disable the picker if the order is marked as disabled
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
          disabled={isDisabled} // Disable the button if the order is marked as disabled
        />
        <Text style={styles.timeText}>
          {selectedDate[item._id]
            ? `Time selected: ${formatTime(selectedDate[item._id])}`
            : "Time not selected"}
        </Text>
        <View style={styles.separator} />
        <Button
          title="Update Order Status"
          onPress={() => updateOrder(item)}
          color="#007bff"
          disabled={isDisabled} // Disable the button if the order is marked as disabled
        />
      </View>
    );
  };

  //   return (
  //     <FlatList
  //       data={orders}
  //       renderItem={renderItem}
  //       keyExtractor={(item) => item._id.toString()}
  //       ListEmptyComponent={renderEmptyComponent}
  //     />
  //   );
  // };
  return (
    <FlatList
      data={orders}
      renderItem={renderItem}
      keyExtractor={(item) => item._id.toString()}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            There are no orders at the moment.
          </Text>
        </View>
      }
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
  emptyContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#555",
  },
  boldLabel: {
    fontWeight: "bold",
  },
});
