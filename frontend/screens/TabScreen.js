import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UserScreen from "./UserScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "./HomeScreen";
import OnlineRecipeScreen from "./OnlineRecipeScreen";
import MembersRecipeScreen from "./MembersRecipeScreen";
import BizPartnerScreen from "./BizPartnerScreen";
import AdminScreen from "../SystemAdmin/AdminScreen";
import ProgressScreen from "./ProgressScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import BusinessRecipeScreen from "./BusinessRecipeScreen";
import { Context } from "../store/context";
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
          } else if (route.name === "Community Recipes") {
            iconName = focused ? "account-group" : "account-group-outline";
            return (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={iconColor}
              />
            );
          } else if (route.name === "Business Recipes") {
            iconName = focused ? "chef-hat" : "chef-hat";
            return (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={iconColor}
              />
            );
          }
          // else if (route.name === "Track Progress") {
          //   iconName = focused ? "bar-chart" : "bar-chart-outline";
          // }
          else if (route.name === "User") {
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
        options={{ headerShown: false, tabBarLabel: "Home" }}
      />
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
      {/* <Tab.Screen
        name="Track Progress"
        component={ProgressScreen}
        options={{ tabBarLabel: "Progress" }}
      /> */}
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
