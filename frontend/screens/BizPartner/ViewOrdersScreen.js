import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";
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

        // Set default status for each order
        const defaultStatuses = {};
        data.forEach((item) => {
          defaultStatuses[item._id] = "Pending";
        });
        setSelectedStatus(defaultStatuses);
      } catch (error) {
        console.error("Error fetching data: ", error);
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

  const submitOrderChanges = (item) => {
    // Logic to submit the changes
    console.log(
      "Submitting order:",
      item._id,
      selectedStatus[item._id],
      selectedDate[item._id]
    );
    // Here you would typically make a PUT/POST request to your backend
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.titleText}>{item.recipeName}</Text>
      {/* Add recipe name as title */}
      <Text style={styles.itemText}>Name: {item.name.username}</Text>
      <Text style={styles.itemText}>Total Price: ${item.totalPrice}</Text>
      <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
      <Text style={styles.itemText}>Preferences: {item.preferences}</Text>
      <Text style={styles.itemText}>Date to Deliver: {item.dateToDeliver}</Text>
      <Text style={styles.itemText}>Time to Deliver: {item.timeToDeliver}</Text>
      <Text style={styles.itemText}>
        Delivery Address: {item.deliveryAddress}
      </Text>
      <Picker
        selectedValue={selectedStatus[item._id]}
        style={{ height: 50, width: 200 }}
        onValueChange={(itemValue) => onStatusChange(item, itemValue)}
      >
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

      <View style={styles.buttonContainer}>
        <Button
          title="Estimated Arrival Time"
          onPress={() => showTimepicker(item)}
          color="#28a745"
        />
        <View style={styles.separator} />
        <Button
          title="Submit"
          onPress={() => submitOrderChanges(item)}
          color="#007bff"
        />
      </View>
    </View>
  );

  return (
    <FlatList
      data={orders}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 10,
  },
  separator: {
    height: 10,
  },
});

export default ViewOrdersScreen;
