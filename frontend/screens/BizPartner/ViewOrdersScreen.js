import React, { useState, useEffect, useContext } from "react";
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
import { Context } from "../../store/context";
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome';

const ViewOrdersScreen = () => {
  const [currentUser] = useContext(Context);
  const [orders, setOrders] = useState([]);
  const [BizRecipePrice, setBizRecipePrice] = useState([]);

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

        // Filter orders to show only those submitted by the current user
        const filteredData = data.filter(
          (order) => order.submittedById === currentUser._id
        );

        // Function to parse date strings into Date objects
        const parseDate = (dateStr, timeStr) => {
          const [day, month, year] = dateStr.split("/");
          const [hour, minute] = timeStr.split(":");
          return new Date(year, month - 1, day, hour, minute);
        };

        // Sort the orders
        const sortedData = filteredData.sort((a, b) => {
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
        const initialDisabledState = filteredData.reduce((acc, order) => {
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
  }, [currentUser._id]);

  useEffect(() => {
    const fetchCurrentUserRecipe= async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_IP}/bizRecipe/getBizRecipeByUserId`
        );
  
        if (response.ok) {
          const data = await response.json();
          
          const recipeData = data.map(recipe => ({ name: recipe.name, price: recipe.price }));

          //console.log("Recipe Data:", recipeData);

          const ordersData = orders.map(order => ({ name: order.recipeName }));

          //console.log("Orders Data:", ordersData);

          const ordersWithPrices = ordersData.map(order => {
            const matchingRecipe = recipeData.find(recipe => recipe.name === order.name);
            return { ...order, recipePrice: matchingRecipe ? matchingRecipe.price : 0 };
          });

          //console.log("Orders with Prices:", ordersWithPrices);

          const uniqueOrdersWithPrices = ordersWithPrices.filter(
            (order, index, self) =>
              index === self.findIndex((o) => o.name === order.name)
          );
  
          //console.log("Orders with Prices(new):", uniqueOrdersWithPrices);

          setBizRecipePrice(uniqueOrdersWithPrices);
        } else {
          console.error('Failed to fetch recipes');
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };
  
    fetchCurrentUserRecipe();
  }, [orders]);

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

    const currentRecipePrices = BizRecipePrice.filter(
      (recipe) => recipe.name === item.recipeName
    );

    return (
      <View style={styles.itemContainer}>
        <View style={styles.componentContainer}>
          <Text style={styles.titleName}>Customer Name</Text>  
          <Text style={styles.titleNameOrange}>{item.userName ? item.userName : "N/A"} </Text>       
        </View>
        <Text style={styles.subtitle}>Delivery Address:</Text>
        <Text style={styles.subtitleOrange}>{item.deliveryAddress}</Text>
        <View style={styles.divider} />

        <Text style={styles.boldLabel}>Orders</Text>
        <Text style={styles.subtitle}>{item.recipeName}</Text>
        <View style={styles.componentContainer}>
          {currentRecipePrices.map((recipe, index)=> (
            <View key={index}>
              <Text style={styles.priceLabel}>     ${recipe.recipePrice}</Text>
            </View>
          ))}
          <Text style={styles.priceLabel}>x{item.quantity}</Text>
        </View>
        <View style={styles.componentContainer}>
          <Text style={styles.preferencesLeftText}>     Preferences</Text>
          <Text style={styles.preferencesRightText}>{item.preferences ? item.preferences : "N/A"}</Text>
        </View>
        <View style={styles.componentContainer}>
          <Text style={styles.subtitle}>Total Price</Text>
          <Text style={styles.subtitleOrange}>${item.totalPrice}</Text>
        </View>
        <View style={styles.divider} />

        <Text style={styles.boldLabel}>Order Details</Text>
        <View style={styles.componentContainer}>
          <Text style={styles.subtitle}>Date of Delivery</Text>
          <Text style={styles.subtitleOrange}>{item.dateToDeliver}</Text> 
        </View>
        <View style={styles.componentContainer}>
          <Text style={styles.subtitle}>Time of Delivery</Text>
          <Text style={styles.subtitleOrange}>{item.timeToDeliver}</Text>
        </View>
        <View style={styles.componentContainer}>
          <Text style={styles.subtitle}>Estimated Arrival Time</Text>
          <Text style={styles.subtitleOrange}>{item.estimatedArrivalTime}</Text>
        </View>
        <View style={styles.componentContainer}>
          <Text style={styles.subtitle}>Status</Text>
          <Text style={styles.subtitleOrange}>{item.status}</Text>
        </View>
        <View style={styles.divider} />
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
        <Text style={styles.boldLabel}>Select status</Text>

        <View style={styles.pickerContainer}>
          <RNPickerSelect
            onValueChange={(itemValue) => onStatusChange(item, itemValue)}
            items={[
              { label: "Rejected", value: "Rejected" },
              { label: "Pending", value: "Pending" },
              { label: "Preparing", value: "Preparing" },
              { label: "On the way", value: "On the way" },
              { label: "Arriving", value: "Arriving" },
              { label: "Done", value: "Done" },
            ]}
            style={{
              inputIOS: { height: 40, width: "100%", paddingHorizontal: 10 },
              inputAndroid: { height: 40, width: "100%", paddingHorizontal: 10 },
              placeholder: { color: '#676767' },
              iconContainer: { 
                top: 10, right: 12
              },
            }}
            value={selectedStatus[item._id] || ""}
            disabled={isDisabled}
            placeholder={{ label: "Select status", value: null, color: '#676767' }}
            useNativeAndroidPickerStyle={false}
            Icon={() => {
              return <Icon name="sort-down" size={16} color="#676767" />;
            }}
          />
        </View>

        <Text style={styles.boldLabel}>Select Arrival Time</Text>
        
        {showPicker[item._id] && (
          <DateTimePicker
            value={selectedDate[item._id] || new Date()}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={(event, date) => onDateChange(event, date, item)}
          />
        )}

        {/* <View style={styles.componentContainer}>
          <Text style={styles.priceLabel}>Estimated Arrival Time</Text>
          <Text style={styles.priceLabel}>
            {selectedDate[item._id]
              ? `${formatTime(selectedDate[item._id])}`
              : "N/A"}
          </Text>
        </View> */}

        <TouchableOpacity
          onPress={() => showTimepicker(item)}
          style={styles.selectTimeContainer}
          disabled={isDisabled} // Disable the button if the order is marked as disabled
        >
          {/* <Text style={styles.selectTimeText}>Select Arrival Time</Text> */}

          <Text style={styles.selectTimeText}>
            {selectedDate[item._id]
              ? formatTime(selectedDate[item._id])
              : "Select Arrival Time"}
          </Text>

          <Icon name="sort-down" size={16} color="#676767" marginBottom={3}/>
        </TouchableOpacity>


        <View style={styles.buttonContainer}>
          {/* <View style={styles.separator} /> */}

          <TouchableOpacity
            onPress={() => updateOrder(item)}
            style={styles.button}
            disabled={isDisabled} // Disable the button if the order is marked as disabled
          >
            <Text style={styles.buttonText}>Update Order Status</Text>
          </TouchableOpacity>
        </View>
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
    borderRadius: 20,
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
    fontSize: 14,
    marginBottom: 5,
  },
  subtitleOrange: {
    // fontWeight: "bold",
    fontSize: 14,
    color: "#ED6F21",
    marginBottom: 5,
  },
  preferencesLeftText: {
    fontSize: 14,
    marginBottom: 5,
    // width: "40%",
  },
  preferencesRightText: {
    fontSize: 14,
    color: "#ED6F21",
    marginBottom: 5,
    width: "70%",
    textAlign: "right",
  },
  buttonContainer: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#ED6F21",
    borderRadius: 10,
    padding: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  componentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    //paddingHorizontal: 20,
  },
  titleName:{
    fontSize: 18,
    fontWeight: "bold",
    //textAlign: "center",
  },
  titleNameOrange:{
    fontSize: 18,
    fontWeight: "bold",
    color: "#ED6F21",
  },
  divider: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 5,
  },
  priceLabel: {
    fontSize: 14,
    color: "#676767",
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 16,
    justifyContent: "center",
  },
  selectTimeContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 12,
  },
  selectTimeText: {
    padding: 10,
    color: '#676767',
  },
});
