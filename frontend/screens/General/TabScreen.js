import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import UserScreen from "../User/UserScreen";
import HomeScreen from "./HomeScreen";
import BizPartnerScreen from "../BizPartner/BizPartnerScreen";
import AdminScreen from "../SystemAdmin/AdminScreen";
import TabRecipes from "./TabRecipes";
import TabFavourites from "../User/TabFavourites";
import ViewOrdersScreen from "../BizPartner/ViewOrdersScreen";
import FoodRequestedTabs from "../SystemAdmin/FoodRequestedTabs";

import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Context } from "../../store/context";
import { useContext } from "react";
import { useEffect } from "react";

const Tab = createBottomTabNavigator();

function ConditionalUserScreen({ navigation }) {
  const [currentUser, setCurrentUser] = useContext(Context);

  useEffect(() => {
    if (currentUser.userType === "user") {
      navigation.reset({
        index: 0,
        routes: [{ name: "User Profile" }],
      });
    } else if (currentUser.userType === "bizpartner") {
      navigation.reset({
        index: 0,
        routes: [{ name: "Business Profile" }],
      });
    } else if (currentUser.userType === "admin") {
      navigation.reset({
        index: 0,
        routes: [{ name: "Admin Profile" }],
      });
    }
  }, [currentUser]);

  return null;
}

function FavouritesUserScreen({ navigation }) {
  const [currentUser, setCurrentUser] = useContext(Context);

  useEffect(() => {
    if (currentUser.userType === "user") {
      navigation.reset({
        index: 0,
        routes: [{ name: "Favourites Recipes" }],
      });
    } else if (currentUser.userType === "bizpartner") {
      navigation.reset({
        index: 0,
        routes: [{ name: "Customer Orders" }],
      });
    } else if (currentUser.userType === "admin") {
      navigation.reset({
        index: 0,
        routes: [{ name: "Food Request" }],
      });
    }
  }, [currentUser]);

  return null;
}

export default function TabScreen() {
  const [currentUser, setCurrentUser] = useContext(Context);

  const getTabLabel = () => {
    switch (currentUser.userType) {
      case "user":
        return "User";
      case "bizpartner":
        return "BizPartner";
      case "admin":
        return "Admin";
      default:
        return "User";
    }
  };

  const getTabLabelToo = () => {
    switch (currentUser.userType) {
      case "user":
        return "Favourites";
      case "bizpartner":
        return "Orders";
      case "admin":
        return "Requests";
      default:
        return "Favourites";
    }
  }

  const heartIcon =(
    <MaterialCommunityIcons
      name={focused ? "heart" : "heart-outline"}
      size={30}
      color="#ED6F21"
    />
  )


  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconName;
          let iconColor = focused ? "#ED6F21" : "#000000"; // Set the color to golden for focused icons

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline", size = 30;
            return (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={iconColor}
              />
            );
          } else if (route.name === "Discover Recipes") {
            iconName = focused ? "restaurant" : "restaurant-outline", size = 25;
            return (
              <Ionicons
                name={iconName}
                size={size}
                color={iconColor}
              />
            );
          } else if (route.name === "Recipes Stuff" && currentUser.userType === "user") {
            iconName = heartIcon;
            
          } else if (route.name === "Recipes Stuff" && currentUser.userType === "bizpartner") {
            iconName = focused ? "clipboard-list" : "clipboard-list-outline", size = 30;
            return (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={iconColor}
              />
            );
          } else if (route.name === "Recipes Stuff" && currentUser.userType === "admin") {
            iconName = focused ? "food" : "food-outline", size = 30;
            return (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={iconColor}
              />
            );
          } else if (route.name === "User") {
            iconName = focused ? "person" : "person-outline", size = 25;
            return (
              <Ionicons 
                name={iconName} 
                size={size} 
                color={iconColor} 
              />            
            );
          }
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
        options={{ headerShown: false, tabBarLabel: "Home" }}
      />
      <Tab.Screen
        name="Discover Recipes"
        component={TabRecipes}
        options={{ tabBarLabel: "Recipes" }}
      />
      <Tab.Screen
        name="Recipes Stuff"
        component={FavouritesUserScreen}
        options={{ tabBarLabel: () => <Text>{getTabLabelToo()}</Text> }}
      />

      <Tab.Screen
        name="Favourites Recipes" 
        component={TabFavourites}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Customer Orders"
        component={ViewOrdersScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Food Request"
        component={FoodRequestedTabs}
        options={{ tabBarButton: () => null }}
      />

      <Tab.Screen
        name="User"
        component={ConditionalUserScreen}
        options={{ tabBarLabel: () => <Text>{getTabLabel()}</Text> }}
      />
      {/* Add these screens to your Navigator, but make them hidden from the tab bar */}
      <Tab.Screen
        name="User Profile"
        component={UserScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Business Profile"
        component={BizPartnerScreen}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="Admin Profile"
        component={AdminScreen}
        options={{ tabBarButton: () => null }}
      />
    </Tab.Navigator>
  );
}

/*
     <Tab.Screen
        name="Online Recipes"
        component={OnlineRecipeScreen}
        options={{ tabBarLabel: "Online" }}
      />
      <Tab.Screen
        name="Community Recipes"
        component={MembersRecipeScreen}
        options={{ tabBarLabel: "Community" }}
      />
      <Tab.Screen
        name="Business Recipes"
        component={BusinessRecipeScreen}
        options={{ tabBarLabel: "Business" }}
      /> 
      <Tab.Screen
        name="Track Progress"
        component={ProgressScreen}
        options={{ tabBarLabel: "Progress" }}
      />
*/
