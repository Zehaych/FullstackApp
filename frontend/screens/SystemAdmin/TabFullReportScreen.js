import React, { useState, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";

import { Context } from "../../store/context";
import FullReportDaily from "./FullReportDaily";
import FullReportMonthly from "./FullReportMonthly";
import FullReportYearly from "./FullReportYearly";

const Tab = createMaterialTopTabNavigator();

const TabFullReportScreen = ({ route }) => {
  //   const { user } = route.params; // Retrieve the user data passed from the previous screen
  //   const [currentUser, setCurrentUser] = useContext(Context);
  //   const currentUserData = user.find((user) => user._id === currentUser._id);
  //   console.log("user: " + currentUserData.username);

  const { user } = route.params;

  return (
    <Tab.Navigator
      initialRouteName="Daily"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconName;
          let iconColor = focused ? "goldenrod" : "black"; // Set the color to golden for focused icons
          if (route.name === "Daily") {
            iconName = focused ? "pie-chart" : "pie-chart";
          } else if (route.name === "Monthly") {
            iconName = focused ? "bar-chart" : "bar-chart-o";
          } else if (route.name === "Yearly") {
            iconName = focused ? "bar-chart" : "bar-chart-o";
          }
          return <Icon name={iconName} size={size} color={iconColor} />;
        },
        tabBarLabelStyle: {
          color: "black", // Set the text color for tab labels (names of the icons)
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen
        name="Daily"
        component={FullReportDaily}
        initialParams={{ user }}
        options={{ tabBarLabel: "Daily" }}
      />
      <Tab.Screen
        name="Monthly"
        component={FullReportMonthly}
        initialParams={{ user }}
        options={{ tabBarLabel: "Monthly" }}
      />
      <Tab.Screen
        name="Yearly"
        component={FullReportYearly}
        initialParams={{ user }}
        options={{ tabBarLabel: "Yearly" }}
      />
    </Tab.Navigator>
  );
};

export default TabFullReportScreen;
