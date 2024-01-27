import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Context } from "../../store/context";
import ViewFavouritesScreen from "./ViewFavouritesScreen";
import ViewBizFavouritesScreen from "./ViewBizFavouritesScreen";

const Tab = createMaterialTopTabNavigator();

const TabFavourites = ({ route }) => {
    //const { user } = route.params; 
    const [currentUser, setCurrentUser] = useContext(Context);
    //const currentUserData = user.find(user => user._id === currentUser._id);
    //console.log("user: " + currentUserData.username);

    return (
        <Tab.Navigator
            initialRouteName="Daily"
            screenOptions={({ route }) => ({
                tabBarLabelStyle: {
                    color: "black", 
                    fontSize: 12,
                },
            })}
        >
            <Tab.Screen 
                name="Community" 
                component={ViewFavouritesScreen} 
                options={{tabBarLabel: 'Community',}}
            />
            <Tab.Screen 
                name="Business" 
                component={ViewBizFavouritesScreen} 
                options={{tabBarLabel: 'Business',}}
            />
        </Tab.Navigator>
    );
};

export default TabFavourites;