import React from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
  Divider,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import { Context } from "../../store/context";
import { useState, useEffect } from "react";

const UserScreen = () => {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useContext(Context);

  const onLogOutPressed = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "No", onPress: () => {} },
      {
        text: "Yes",
        onPress: () => {
          // setCurrentUser(null);
          // AsyncStorage.removeItem("userId");
          navigation.navigate("LogInScreen");
        },
      },
    ]);
  };

  const handleNavigateToViewRequest = () => {
    navigation.navigate("View Request");
  };

  const handleSubmitFoodRequest = () => {
    navigation.navigate("SubmitFoodRequest");
  };

  const onSettingsPressed = () => {
    navigation.push("Settings");
  };

  const onEditProfilePressed = () => {
    navigation.push("Edit Profile");
  };

  const onAddRecipePressed = () => {
    navigation.push("Add Recipe");
  };

  const onViewRecipePressed = () => {
    navigation.push("View Recipe");
  };

  const onTrackProgressPressed = () => {
    navigation.push("Track Progress");
  };

  const onPastOrderspressed = () => {
    navigation.push("Past Orders");
  };

  const onCalculateCaloriePressed = () => {
    // Navigate to the "Calculate Calorie" screen
    navigation.push("Calculate Calorie");
  };

  const onInsertMedicalHistoryPressed = () => {
    // Navigate to the "Insert Medical History" screen
    navigation.push("Medical History");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.userInfoSection}>
          <View style={styles.userInfo}>
            <Title style={styles.title}>{currentUser.username}</Title>
          </View>

          <View style={styles.userDetails}>
            <View style={styles.userDetail}>
              <Text style={styles.detailText}>Sex: {currentUser.gender}</Text>
              <Text style={styles.detailText}>Age: {currentUser.age}</Text>

              <Text style={styles.detailText}>
                Weight: {currentUser.weight}
              </Text>

              <Text style={styles.detailText}>
                Height: {currentUser.height}
              </Text>
              <Text style={styles.detailText}>
                Calorie goal: {currentUser.calorie}
              </Text>
            </View>
          </View>
        </View>
        <Divider />

        <View style={styles.menuWrapper}>
          {/* <TouchableRipple onPress={onEditProfilePressed}>
          <View style={styles.menuItem}>
            <Icon name="account-edit" color="#FF6347" size={25} />
            <Text style={styles.menuItemText}>Edit Profile</Text>
          </View>
        </TouchableRipple> */}

          <TouchableRipple onPress={onCalculateCaloriePressed}>
            <View style={styles.menuItem}>
              <Icon
                name="calculator"
                size={25}
                color="#FF6347"
                style={styles.icon}
              />
              <Text style={styles.menuItemText}>Calculate Calorie</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple onPress={onInsertMedicalHistoryPressed}>
            <View style={styles.menuItem}>
              <Icon
                name="clipboard-account"
                size={25}
                color="#FF6347"
                style={styles.icon}
              />
              <Text style={styles.menuItemText}>Insert Medical History</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={onTrackProgressPressed}>
            <View style={styles.menuItem}>
              <Icon name="chart-bar" color="#FF6347" size={25} />
              <Text style={styles.menuItemText}>Track Progress</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={onAddRecipePressed}>
            <View style={styles.menuItem}>
              <Icon name="silverware-fork-knife" color="#FF6347" size={25} />
              <Text style={styles.menuItemText}>Add Recipe</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={onViewRecipePressed}>
            <View style={styles.menuItem}>
              <Icon name="silverware-fork-knife" color="#FF6347" size={25} />
              <Text style={styles.menuItemText}>View Added Recipe</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={handleSubmitFoodRequest}>
            <View style={styles.menuItem}>
              <Icon name="silverware-variant" color="#FF6347" size={25} />
              <Text style={styles.menuItemText}>Add Food & Drinks Request</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={handleNavigateToViewRequest}>
            <View style={styles.menuItem}>
              <Icon name="silverware-variant" color="#FF6347" size={25} />
              <Text style={styles.menuItemText}>View Request Status</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={onPastOrderspressed}>
            <View style={styles.menuItem}>
              <Icon name="clipboard-list-outline" color="#FF6347" size={25} />
              <Text style={styles.menuItemText}>View Past Orders</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={onSettingsPressed}>
            <View style={styles.menuItem}>
              <Icon name="cog" color="#FF6347" size={25} />
              <Text style={styles.menuItemText}>Settings</Text>
            </View>
          </TouchableRipple>

          {/* <TouchableRipple onPress={onSettingsPressed}>
          <View style={styles.menuItem}>
            <Icon name="cog" color="#FF6347" size={25} />
            <Text style={styles.menuItemText}>Delete Account</Text>
          </View>
        </TouchableRipple> */}
          {/* 
        <TouchableRipple onPress={onSettingsPressed}>
          <View style={styles.menuItem}>
            <Icon name="cog" color="#FF6347" size={25} />
            <Text style={styles.menuItemText}>Settings</Text>
          </View>
        </TouchableRipple> */}

          <TouchableRipple onPress={onLogOutPressed}>
            <View style={styles.menuItem}>
              <Icon name="exit-to-app" color="#FF6347" size={25} />
              <Text style={styles.menuItemText}>Log Out</Text>
            </View>
          </TouchableRipple>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  userInfoSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
  },

  userInfo: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500",
  },
  userDetails: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-around",
  },
  userDetail: {
    alignItems: "center",
  },
  detailText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
  },
  menuItemText: {
    color: "#777777",
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,
  },
});
