import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import SummaryDailyScreen from "./SummaryDailyScreen";
import SummaryWeeklyScreen from "./SummaryWeeklyScreen";
import SummaryMonthlyScreen from "./SummaryMonthlyScreen";

const Tab = createMaterialTopTabNavigator();

const SummaryNavigation = ( ) => {
    return (
        <Tab.Navigator
        initialRouteName="Daily"
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, size }) => {
                let iconName;
                let iconColor = focused ? "goldenrod" : "black"; // Set the color to golden for focused icons

                if (route.name === "Daily") {
                    iconName = focused ? "pie-chart" : "pie-chart";
                } else if (route.name === "Weekly") {
                    iconName = focused ? "bar-chart" : "bar-chart-o";
                } else if (route.name === "Monthly") {
                    iconName = focused ? "bar-chart" : "bar-chart-o";                    
                }
                return (
                    <Icon name={iconName} size={size} color={iconColor} />
                ); 
            },
            tabBarLabelStyle: {
                color: "black", // Set the text color for tab labels (names of the icons)
                fontSize: 12,
            },
        })}
        >
            <Tab.Screen name="Daily" component={SummaryDailyScreen} />
            <Tab.Screen name="Weekly" component={SummaryWeeklyScreen} />
            <Tab.Screen name="Monthly" component={SummaryMonthlyScreen} />
        </Tab.Navigator>
    );
};

export default SummaryNavigation;