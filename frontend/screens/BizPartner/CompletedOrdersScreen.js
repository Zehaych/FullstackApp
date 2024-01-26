import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Context } from "../../store/context";

const CompletedOrdersScreen = () => {
  const [currentUser] = useContext(Context);
  const [pastOrders, setPastOrders] = useState([]);

  const [BizRecipePrice, setBizRecipePrice] = useState([]);

  useEffect(() => {
    const fetchPastOrders = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_IP}/bizRecipe/getOrderHistory`
        );
        const data = await response.json();

        // Filter orders to show only those submitted by the current user
        const filteredData = data.filter(
          (order) => order.submittedById === currentUser._id
        );

        // Sort the past orders by date and time
        const sortedData = filteredData.sort((a, b) => {
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

        setPastOrders(sortedData);
      } catch (error) {
        console.error("Error fetching past orders: ", error);
      }
    };

    fetchPastOrders();
  }, []);

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

          const ordersData = pastOrders.map(order => ({ name: order.recipeName }));

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
  }, [pastOrders]);

  const renderItem = ({ item }) => {
    const currentRecipePrices = BizRecipePrice.filter(
      (recipe) => recipe.name === item.recipeName
    );

    return (

    <View style={styles.itemContainer}>

      {/* Display other details of the past order */}
      <View style={styles.componentContainer}>
        <Text style={styles.titleName}>Customer Name</Text>
        <Text style={styles.titleNameOrange}>{item.submittedByName}</Text>
      </View>
      <Text style={styles.subtitle}>Delivery Address:</Text>
      <Text style={styles.subtitleOrange}>{item.deliveryAddress}</Text>
      <View style={styles.divider}></View>

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
        <Text style={styles.subtitle}>     Preferences</Text>
        <Text style={styles.subtitleOrange}>{item.preferences ? item.preferences : "N/A"}</Text>
      </View>
      <View style={styles.componentContainer}>
        <Text style={styles.subtitle}>Total Price</Text>
        <Text style={styles.subtitleOrange}>${item.totalPrice}</Text>
      </View>
      <View style={styles.divider}></View>

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
    </View>
  );
  };

  return (
    <FlatList
      data={pastOrders}
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
  emptyContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#555",
  },
  componentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    //paddingHorizontal: 20,
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
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: "center",
  },
  boldLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  priceLabel: {
    fontSize: 14,
    color: "#676767",
    marginBottom: 5,
  },
});

export default CompletedOrdersScreen;

/*
      <Text style={styles.title}>{item.recipeName}</Text>
*/