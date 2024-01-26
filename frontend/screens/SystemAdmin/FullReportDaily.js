import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";

const FullReportDaily = ({ route }) => {
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

      const currentDate = getCurrentDateFormatted();
      const filteredOrders = data.filter((order) => {
        const orderDate = order.dateToDeliver;
        return order.submittedById === userId && orderDate === currentDate;
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
          maleCount: 0,
          femaleCount: 0,
          totalAge: 0,
          totalHeight: 0,
          totalWeight: 0,
          totalCalorie: 0,
        };
      }
      const recipeGroup = orderMap[order.recipeName];
      recipeGroup.totalPrice += order.totalPrice;
      recipeGroup.quantity += order.quantity;
      recipeGroup.timeToDeliverCount[order.timeToDeliver] =
        (recipeGroup.timeToDeliverCount[order.timeToDeliver] || 0) + 1;

      if (order.userGender === "Male") recipeGroup.maleCount++;
      if (order.userGender === "Female") recipeGroup.femaleCount++;
      recipeGroup.totalAge += order.userAge;
      recipeGroup.totalHeight += order.userHeight;
      recipeGroup.totalWeight += order.userWeight;
      recipeGroup.totalCalorie += order.userCalorie;

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

    // Calculate specific metrics for each recipe group
    Object.values(orderMap).forEach((recipeGroup) => {
      const totalOrders = recipeGroup.maleCount + recipeGroup.femaleCount;
      recipeGroup.maleOrderRate = totalOrders
        ? (recipeGroup.maleCount / totalOrders) * 100
        : 0;
      recipeGroup.femaleOrderRate = totalOrders
        ? (recipeGroup.femaleCount / totalOrders) * 100
        : 0;
      recipeGroup.averageAge = totalOrders
        ? recipeGroup.totalAge / totalOrders
        : 0;
      recipeGroup.averageHeight = totalOrders
        ? recipeGroup.totalHeight / totalOrders
        : 0;
      recipeGroup.averageWeight = totalOrders
        ? recipeGroup.totalWeight / totalOrders
        : 0;
      recipeGroup.averageCalorieGoal = totalOrders
        ? recipeGroup.totalCalorie / totalOrders
        : 0;

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

    return {
      groupedOrders: Object.values(orderMap),
      totalSales,
      mostOrderedRecipes: Object.keys(recipesWithHighestQuantity),
    };
  };

  const getCurrentDateFormatted = () => {
    const now = new Date();
    const day = now.getDate(); // No leading zero for single-digit days
    const month = now.getMonth() + 1; // January is 0, no leading zero for single-digit months
    const year = now.getFullYear(); // Full year format
    return `${day}/${month}/${year}`;
  };

  const renderItem = ({ item }) => (
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
        <Text style={styles.subtitle1}>
          Most Ordered Time
        </Text>
        <Text style={styles.subtitle}>
          {item.mostOrderedTime}
        </Text>
      </View>
      <View style={styles.componentContainer}>
        <Text style={styles.subtitle1}>
          Male Order Rate
        </Text>
        <Text style={styles.subtitle}>
          {item.maleOrderRate.toFixed(2)}%
        </Text>
      </View>
      <View style={styles.componentContainer}>
        <Text style={styles.subtitle1}>
          Female Order Rate
        </Text>
        <Text style={styles.subtitle}>
          {item.femaleOrderRate.toFixed(2)}%
        </Text>
      </View>
      <View style={styles.componentContainer}>
        <Text style={styles.subtitle1}>
          Average Age
        </Text>
        <Text style={styles.subtitle}>
          {item.averageAge.toFixed(0)}
        </Text>
      </View>
      <View style={styles.componentContainer}>
        <Text style={styles.subtitle1}>
          Average Height
        </Text>
        <Text style={styles.subtitle}>
          {item.averageHeight.toFixed(0)} cm
        </Text>
      </View>
      <View style={styles.componentContainer}>
        <Text style={styles.subtitle1}>
          Average Weight
        </Text>
        <Text style={styles.subtitle}>
          {item.averageWeight.toFixed(2)} kg
        </Text>
      </View>
      <View style={styles.componentContainer}>
        <Text style={styles.subtitle1}>
          Average Calorie Goal
        </Text>
        <Text style={styles.subtitle}>
          {item.averageCalorieGoal.toFixed(0)} kcal
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <View style={styles.detailBox}>
          <Text style={styles.title2}>Daily Sales</Text>
          <View style={styles.componentContainer}>
            <Text style={styles.subtitle1}>Total Sales </Text>
            <Text style={styles.subtitle}>${totalSales}</Text>
          </View>
          <View style={styles.componentContainer}>
            <Text style={styles.subtitle1}>
              Most Ordered 
            </Text>
            <Text style={styles.subtitle}>
              {mostOrderedRecipes.join("\n")}
            </Text>
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
    flex: 1 
  },
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5", 
    padding: 10 
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
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { 
      width: 0, 
      height: 2 
    },
    shadowRadius: 3.84,
    shadowOpacity: 0.25,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    //textAlign: "center",
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
    //flex: 1,
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
    //paddingHorizontal: 20,
  },
});

export default FullReportDaily;
