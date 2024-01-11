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

      <View style={styles.orderContainer}>
        {/* title */}
        <Text style={styles.title}>{item.recipeName}</Text>

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
          <View style={styles.itemDetailLeft}>
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
          <View style={styles.itemDetailLeft}>
            <Text style={styles.itemDetailLeftText}>Date of Delivery</Text>
          </View>

          <View style={styles.itemDetailRight}>
            <Text style={styles.itemDetailRightText}>{item.dateToDeliver}</Text>
          </View>
        </View>

        {/* Estimated Arrival Time */}
        <View style={styles.itemDetailContainer}>
          <View style={styles.itemDetailLeft}>
            <Text style={styles.itemDetailLeftText}>Estimated Arrival Time</Text>
          </View>

          <View style={styles.itemDetailRight}>
            <Text style={styles.itemDetailRightText}>{item.estimatedArrivalTime}</Text>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.itemDetailContainer}>
          <View style={styles.itemDetailLeft}>
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
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
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
});

export default ViewPastOrdersScreen;
