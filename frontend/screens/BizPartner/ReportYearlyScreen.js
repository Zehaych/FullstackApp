import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { Context } from "../../store/context";

const ReportYearlyScreen = () => {
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
    const currentYear = getCurrentYearFormatted();

    const filteredOrders = orders.filter((order) => {
      const [, , orderYear] = order.dateToDeliver.split("/");
      return (
        orderYear === currentYear && order.submittedById === currentUser._id
      );
    });
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

  const getCurrentYearFormatted = () => {
    const now = new Date();
    const year = now.getFullYear();
    return `${year}`; // Format: YYYY
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.title}>{item.recipeName}</Text>
        <Text style={styles.subtitle}>Total Sales: ${item.totalPrice}</Text>
        <Text style={styles.subtitle}>
          Total Quantity Sold: {item.quantity}
        </Text>
        <Text style={styles.subtitle}>
          Most Ordered Time: {item.mostOrderedTime}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Total Sales: ${totalSales}</Text>
        <Text style={styles.header}>
          Most Ordered: {mostOrderedRecipes.join(", ")}
        </Text>

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
    backgroundColor: "#FCFCD3",
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

export default ReportYearlyScreen;
