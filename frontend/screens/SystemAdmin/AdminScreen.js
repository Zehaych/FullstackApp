import { useNavigation } from "@react-navigation/native";

import {
  Avatar,
  Title,
  Caption,
  TouchableRipple,
  Divider,
  TextInput,
  Button,
} from "react-native-paper";
import React, { useState, useContext } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  AsyncStorage,
  Touchable,
} from "react-native";
import { Context } from "../../store/context";

const AdminScreen = () => {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useContext(Context);
  const [totalCalories, setTotalCalories] = useState("");

  const onLogOutPressed = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "No", onPress: () => {} },
      {
        text: "Yes",
        onPress: async () => {
          // await AsyncStorage.removeItem("userId");
          // setCurrentUser(null);
          navigation.navigate("LogInScreen");
        },
      },
    ]);
  };

  //Function to navigate to create business Partner
  const handleCreateBusinessPartner = () => {
    navigation.navigate("BizPartnerSignUp");
  };

  const handleFoodRequested = () => {
    navigation.navigate("FoodRequested");
  };

  const handleRetrieveUserAccount = () => {
    navigation.navigate("RetrieveUserAccount");
  };

  //Function to navigate to retrieve all business partners
  const handleNavigateBizPartner = () => {
    navigation.navigate("RetrieveBizPartners");
  };

  const handleNavigateReportedRecipe = () => {
    navigation.navigate("ReportedRecipe");
  };

  const handleNavigateReportedBizRecipe = () => {
    navigation.navigate("ReportedBizRecipe");
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>{currentUser.username}</Text>
      <Text>Welcome to the System Administrator Screen</Text>

      <TouchableRipple onPress={handleCreateBusinessPartner}>
        <View style={styles.menuItem}>
          <Icon
            name="account-plus"
            size={25}
            color="#FF6347"
            style={styles.icon}
          />
          <Text style={styles.menuItemText}>
            Create Business Partner Account
          </Text>
        </View>
      </TouchableRipple>

      <TouchableRipple onPress={handleRetrieveUserAccount}>
        <View style={styles.menuItem}>
          <Icon
            name="account-search"
            size={25}
            color="#FF6347"
            style={styles.icon}
          />
          <Text style={styles.menuItemText}>Retrieve User accounts</Text>
        </View>
      </TouchableRipple>

      <TouchableRipple onPress={handleNavigateBizPartner}>
        <View style={styles.menuItem}>
          <Icon
            name="account-search"
            size={25}
            color="#FF6347"
            style={styles.icon}
          />
          <Text style={styles.menuItemText}>
            Retrieve Business Partner accounts
          </Text>
        </View>
      </TouchableRipple>

      <TouchableRipple onPress={handleNavigateReportedRecipe}>
        <View style={styles.menuItem}>
          <Icon
            name="book-alert"
            size={25}
            color="#FF6347"
            style={styles.icon}
          />
          <Text style={styles.menuItemText}>
            Reported Community Recipes
          </Text>
        </View>
      </TouchableRipple>

      <TouchableRipple onPress={handleNavigateReportedBizRecipe}>
        <View style={styles.menuItem}>
          <Icon
            name="book-alert"
            size={25}
            color="#FF6347"
            style={styles.icon}
          />
          <Text style={styles.menuItemText}>
            Reported Business Partner Recipes
          </Text>
        </View>
      </TouchableRipple>

      <TouchableRipple onPress={handleFoodRequested}>
        <View style={styles.menuItem}>
          <Icon
            name="food"
            size={25}
            color="#FF6347"
            style={styles.icon}
          />
          <Text style={styles.menuItemText}>
            Food Requested
          </Text>
        </View>
      </TouchableRipple>

      <TouchableRipple onPress={onLogOutPressed}>
        <View style={styles.menuItem}>
          <Icon
            name="exit-to-app"
            color="#FF6347"
            size={25}
            style={styles.icon}
          />
          <Text style={styles.menuItemText}>Log Out</Text>
        </View>
      </TouchableRipple>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  icon: {
    marginRight: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
  },
  menuItemText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default AdminScreen;
