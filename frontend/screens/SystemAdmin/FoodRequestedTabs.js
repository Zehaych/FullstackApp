import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import FoodRequestedPending from './FoodRequestedPending';
import FoodRequestedApproved from './FoodRequestedApproved';
import FoodRequestedRejected from './FoodRequestedRejected';

const Tab = createMaterialTopTabNavigator();

const FoodRequestedTabs = () => {
    return(
    <Tab.Navigator
        initialRouteName="Pending"
    >
        <Tab.Screen name="Pending" component={FoodRequestedPending} options={{tabBarLabel: "Pending",}}/>
        <Tab.Screen name="Approved" component={FoodRequestedApproved} options={{tabBarLabel: "Approved",}}/>
        <Tab.Screen name="Rejected" component={FoodRequestedRejected} options={{tabBarLabel: "Rejected",}}/>
    </Tab.Navigator>
)};

export default FoodRequestedTabs;
