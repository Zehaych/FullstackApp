import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UserScreen from "./UserScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "./HomeScreen";
import OnlineRecipeScreen from "./OnlineRecipeScreen";
import MembersRecipeScreen from "./MembersRecipeScreen";
import ProgressScreen from "./ProgressScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createBottomTabNavigator();

export default function TabScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconName;
          let iconColor = focused ? "goldenrod" : "black"; // Set the color to golden for focused icons

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Online Recipes") {
            iconName = focused ? "restaurant" : "restaurant-outline";
          } else if (route.name === "Members Recipes") {
            iconName = focused ? "account-group" : "account-group-outline";
            return (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={iconColor}
              />
            );
          } else if (route.name === "Track Progress") {
            iconName = focused ? "bar-chart" : "bar-chart-outline";
          } else if (route.name === "User") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={iconColor} />;
        },
        tabBarLabelStyle: {
          color: "black", // Set the text color for tab labels (names of the icons)
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen
        name="Online Recipes"
        component={OnlineRecipeScreen}
        options={{ tabBarLabel: "Online" }}
      />
      <Tab.Screen
        name="Members Recipes"
        component={MembersRecipeScreen}
        options={{ tabBarLabel: "Members" }}
      />
      <Tab.Screen
        name="Track Progress"
        component={ProgressScreen}
        options={{ tabBarLabel: "Progress" }}
      />
      <Tab.Screen
        name="User"
        component={UserScreen}
        options={{ tabBarLabel: "User" }}
      />
    </Tab.Navigator>
  );
}
