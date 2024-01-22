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
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Context } from "../../store/context";
import FoodAndDrinksInfo from "./FoodAndDrinksInfo";

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
          //navigation.navigate("LogInScreen");
          navigation.reset({
            index: 0,
            routes: [{ name: "LogInScreen" }],
          });
        },
      },
    ]);
  };

  //Function to navigate to create business Partner
  const handleCreateBusinessPartner = () => {
    navigation.navigate("BizPartnerSignUp");
  };

  const handleFoodRequested = () => {
    navigation.navigate("FoodRequestedTabs");
  };

  const handleRetrieveUserAccount = () => {
    navigation.navigate("RetrieveUserAccount");
  };

  const handleRetrieveBizPartner = () => {
    navigation.navigate("RetrieveBizPartners");
  };

  //Function to navigate to retrieve all business partners
  const handleNavigateBizPartner = () => {
    navigation.navigate("RetrieveBizReports");
  };

  const handleNavigateReportedRecipe = () => {
    navigation.navigate("ReportedRecipe");
  };

  const handleNavigateReportedBizRecipe = () => {
    navigation.navigate("ReportedBizRecipe");
  };

  const handleNavigateFoodAndDrinks = () => {
    navigation.navigate("FoodAndDrinksInfo");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.userInfoSection}>
          <View style={styles.userInfo}>
            <Text style={styles.title}>{currentUser.username}</Text>
          </View>
          <View style={styles.privilegeSection}>
            <Icon
              name="crown"
              size={25}
              color="#ED6F21"
            />
            <Text style={styles.detailText}> Admin Access Granted </Text>
            <Icon
              name="crown"
              size={25}
              color="#ED6F21"
            />
          </View>
        </View>

        <View style={styles.menuWrapper}>
          <Text style={styles.subTitle}>Account</Text>
          <TouchableRipple onPress={handleCreateBusinessPartner}>
            <View style={styles.menuItem}>
              <Icon
                name="account-plus"
                size={25}
                color="#ED6F21"
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
                color="#ED6F21"
              />
              <Text style={styles.menuItemText}>Retrieve User accounts</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={handleRetrieveBizPartner}>
            <View style={styles.menuItem}>
              <Icon
                name="account-search"
                size={25}
                color="#ED6F21"
              />
              <Text style={styles.menuItemText}>
                Retrieve Business Partner accounts
              </Text>
            </View>
          </TouchableRipple>

          <View style={styles.divider} />
          <Text style={styles.subTitle}>Report</Text>
          <TouchableRipple onPress={handleNavigateReportedRecipe}>
            <View style={styles.menuItem}>
              <Icon
                name="book-alert"
                size={25}
                color="#ED6F21"
              />
              <Text style={styles.menuItemText}>Reported Community Recipes</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={handleNavigateReportedBizRecipe}>
            <View style={styles.menuItem}>
              <Icon
                name="book-alert"
                size={25}
                color="#ED6F21"
              />
              <Text style={styles.menuItemText}>
                Reported Business Partner Recipes
              </Text>
            </View>
          </TouchableRipple>

          <View style={styles.divider} />
          <Text style={styles.subTitle}>Request</Text>
          <TouchableRipple onPress={handleFoodRequested}>
            <View style={styles.menuItem}>
              <Icon name="food" size={25} color="#ED6F21" />
              <Text style={styles.menuItemText}>Food Requested</Text>
            </View>
          </TouchableRipple>

          <View style={styles.divider} />
          <Text style={styles.subTitle}>Database</Text>
          <TouchableRipple onPress={handleNavigateFoodAndDrinks}>
            <View style={styles.menuItem}>
              <Icon name="food" size={25} color="#ED6F21" />
              <Text style={styles.menuItemText}>Food And Drinks Database</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={handleNavigateBizPartner}>
            <View style={styles.menuItem}>
              <Icon
                name="notebook-outline"
                size={25}
                color="#ED6F21"
              />
              <Text style={styles.menuItemText}>Generate Reports</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={onLogOutPressed}>
            <View style={styles.menuItem}>
              <Icon
                name="exit-to-app"
                color="#ED6F21"
                size={25}
              />
              <Text style={styles.menuItemText}>Log Out</Text>
            </View>
          </TouchableRipple>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  userInfoSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  userInfo: {
    alignItems: "center",
  },
  privilegeSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  detailText: {
    fontSize: 16,
    color: "grey",
  },
  divider: {
    borderBottomColor: "#C6C6CD",
    borderBottomWidth: 1,
    alignSelf: "center",
    width: "90%",
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    color: "grey",
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 30,
    //borderBottomWidth: 1,
    //borderBottomColor: "#dddddd",
  },
  menuItemText: {
    color: "#000000",
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,
  },
});

export default AdminScreen;
