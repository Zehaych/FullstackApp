import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";

const FullReportYearly = ({ route }) => {
  const { user } = route.params;
  const [groupedOrders, setGroupedOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [mostOrderedRecipes, setMostOrderedRecipes] = useState(["-"]);

  useEffect(() => {
    fetchOrderHistoryForUser(user._id);
  }, [user._id]);

  const fetchOrderHistoryForUser = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/bizRecipe/getOrderHistory`
      );
      const data = await response.json();

      const currentYear = getCurrentYearFormatted();
      const filteredOrders = data.filter((order) => {
        const [, , year] = order.dateToDeliver.split("/"); // Extract year from the date
        return order.submittedById === userId && year === currentYear;
      });

      const processedData = processOrderData(filteredOrders);
      setGroupedOrders(processedData.groupedOrders);
      setTotalSales(processedData.totalSales);
      setMostOrderedRecipes(processedData.mostOrderedRecipes);
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
  };

  const processOrderData = (orders) => {
    const orderMap = {};
    let totalSales = 0;
    let highestQuantity = 0;
    let recipesWithHighestQuantity = {};

    orders.forEach((order) => {
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
      recipeGroup.timeToDeliverCount[order.timeToDeliver] =
        (recipeGroup.timeToDeliverCount[order.timeToDeliver] || 0) + 1;

      totalSales += order.totalPrice;

      if (recipeGroup.quantity > highestQuantity) {
        highestQuantity = recipeGroup.quantity;
        recipesWithHighestQuantity = { [order.recipeName]: true };
      } else if (recipeGroup.quantity === highestQuantity) {
        recipesWithHighestQuantity[order.recipeName] = true;
      }
    });

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

    Object.values(orderMap).forEach((recipeGroup) => {
      if (recipeGroup.quantity > highestQuantity) {
        highestQuantity = recipeGroup.quantity;
        recipesWithHighestQuantity = { [recipeGroup.recipeName]: true };
      } else if (recipeGroup.quantity === highestQuantity) {
        recipesWithHighestQuantity[recipeGroup.recipeName] = true;
      }
    });

    const mostOrderedRecipes = Object.keys(recipesWithHighestQuantity);
    if (mostOrderedRecipes.length === 0) mostOrderedRecipes.push("-");

    return {
      groupedOrders: Object.values(orderMap),
      totalSales,
      mostOrderedRecipes,
    };
  };

  const getCurrentYearFormatted = () => {
    const now = new Date();
    return now.getFullYear().toString();
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>{item.recipeName}</Text>
      <Text style={styles.subtitle}>Total Sales: ${item.totalPrice}</Text>
      <Text style={styles.subtitle}>Total Quantity Sold: {item.quantity}</Text>
      <Text style={styles.subtitle}>
        Most Ordered Time: {item.mostOrderedTime}
      </Text>
    </View>
  );

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
  safeAreaContainer: { flex: 1 },
  container: { flex: 1, backgroundColor: "#FCFCD3", padding: 10 },
  listContentContainer: { flexGrow: 1 },
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
    shadowOffset: { width: 0, height: 2 },
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
  subtitle: { fontSize: 16, marginBottom: 5 },
});

export default FullReportYearly;
