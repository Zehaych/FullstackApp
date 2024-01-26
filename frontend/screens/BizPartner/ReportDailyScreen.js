import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { Context } from "../../store/context";

const ReportDailyScreen = () => {
  const [groupedOrders, setGroupedOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [mostOrderedRecipes, setMostOrderedRecipes] = useState(["-"]);
  const [currentUser, setCurrentUser] = useContext(Context);

  useEffect(() => {
    const fetchPastOrders = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_IP}/bizRecipe/getOrderHistory`
        );
        const data = await response.json();

        const processedData = processOrderData(data);
        setGroupedOrders(processedData.groupedOrders);
        setTotalSales(processedData.totalSales);
        setMostOrderedRecipes(processedData.mostOrderedRecipes);
      } catch (error) {
        console.error("Error fetching past orders: ", error);
      }
    };

    fetchPastOrders();
  }, []);

  const processOrderData = (orders) => {
    const currentDate = getCurrentDateFormatted();
    // const filteredOrders = orders.filter(
    //   (order) => order.dateToDeliver === currentDate
    // );
    const filteredOrders = orders.filter(
      (order) =>
        order.dateToDeliver === currentDate &&
        order.submittedById === currentUser._id
    );
    const orderMap = {};
    let totalSales = 0;
    let highestQuantity = 0;
    let recipesWithHighestQuantity = {};

    filteredOrders.forEach((order) => {
      // Group by recipeName
      if (!orderMap[order.recipeName]) {
        orderMap[order.recipeName] = {
          recipeName: order.recipeName,
          totalPrice: 0,
          quantity: 0,
          timeToDeliverCount: {},
        };
      }
      const recipeGroup = orderMap[order.recipeName];
      recipeGroup.totalPrice += order.totalPrice;
      recipeGroup.quantity += order.quantity;

      // Count occurrences of timeToDeliver
      const time = order.timeToDeliver;
      recipeGroup.timeToDeliverCount[time] =
        (recipeGroup.timeToDeliverCount[time] || 0) + 1;

      //   orderMap[order.recipeName].totalPrice += order.totalPrice;
      //   orderMap[order.recipeName].quantity += order.quantity;
      totalSales += order.totalPrice;

      // Calculate most ordered time for each recipe
      Object.values(orderMap).forEach((recipeGroup) => {
        let mostOrderedTime = "-";
        let maxCount = 0;

        for (const [time, count] of Object.entries(
          recipeGroup.timeToDeliverCount
        )) {
          if (count > maxCount) {
            mostOrderedTime = time;
            maxCount = count;
          }
        }

        recipeGroup.mostOrderedTime = mostOrderedTime;
      });

      // Track most ordered recipe
      if (orderMap[order.recipeName].quantity > highestQuantity) {
        highestQuantity = orderMap[order.recipeName].quantity;
        recipesWithHighestQuantity = { [order.recipeName]: true };
      } else if (orderMap[order.recipeName].quantity === highestQuantity) {
        recipesWithHighestQuantity[order.recipeName] = true;
      }
    });

    const mostOrderedRecipes = Object.keys(recipesWithHighestQuantity);

    // Check if there are no most ordered recipes for the current day
    if (mostOrderedRecipes.length === 0) {
      mostOrderedRecipes.push("-");
    }

    return {
      groupedOrders: Object.values(orderMap),
      totalSales,
      mostOrderedRecipes,
    };
  };

  const getCurrentDateFormatted = () => {
    const now = new Date();
    const day = now.getDate(); // No leading zero for single-digit days
    const month = now.getMonth() + 1; // January is 0, no leading zero for single-digit months
    const year = now.getFullYear(); // Full year format
    return `${day}/${month}/${year}`;
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.title}>{item.recipeName}</Text>
        <View style={styles.componentContainer}>
          <Text style={styles.subtitle1}>Total Sales</Text>
          <Text style={styles.subtitle}>${item.totalPrice}</Text>
        </View>
        <View style={styles.componentContainer}>
          <Text style={styles.subtitle1}>Total Quantity Sold</Text>
          <Text style={styles.subtitle}>{item.quantity}</Text>
        </View>
        <View style={styles.componentContainer}>
          <Text style={styles.subtitle1}>Most Ordered Time</Text>
          <Text style={styles.subtitle}>{item.mostOrderedTime}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <View style={styles.detailBox}>
          <Text style={styles.title2}>Daily Sales</Text>
          <View style={styles.componentContainer}>
            <Text style={styles.subtitle1}>Total Sales</Text>
            <Text style={styles.subtitle}>${totalSales}</Text>
          </View>
          <View style={styles.componentContainer}>
            <Text style={styles.subtitle1}>Most Ordered</Text>
            <Text style={styles.subtitle}>{mostOrderedRecipes.join(", ")}</Text>
          </View>
        </View>

        <FlatList
          data={groupedOrders}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContentContainer}
        />        
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },

  listContentContainer: {
    flexGrow: 1,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
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
    shadowRadius: 3.84,
    shadowOpacity: 0.25,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  title2: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ED6F21",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: { 
    fontSize: 16, 
    marginBottom: 5 
  },
  subtitle1: {
    fontSize: 16,
    color: "grey",
    marginBottom: 5,
  },
  detailBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    margin: 10,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3.84,
    shadowOpacity: 0.25,
    elevation: 5,
  },
  componentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default ReportDailyScreen;
