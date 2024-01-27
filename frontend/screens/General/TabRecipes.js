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
import OnlineRecipeScreen from "./OnlineRecipeScreen";
import MembersRecipeScreen from "./MembersRecipeScreen";
import BusinessRecipeScreen from "./BusinessRecipeScreen";

const Tab = createMaterialTopTabNavigator();

const TabRecipes = ({ route }) => {
    //const { user } = route.params; 
    //const [currentUser, setCurrentUser] = useContext(Context);
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
            <Tab.Screen name="Online" component={OnlineRecipeScreen} options={{tabBarLabel: 'Online',}}/>
            <Tab.Screen name="Community" component={MembersRecipeScreen} options={{tabBarLabel: 'Community',}}/>
            <Tab.Screen name="Business" component={BusinessRecipeScreen} options={{tabBarLabel: 'Business',}}/>
        </Tab.Navigator>
    );
};

export default TabRecipes;