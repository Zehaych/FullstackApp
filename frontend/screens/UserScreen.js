import React from "react";
import { View, SafeAreaView, StyleSheet, Alert } from "react-native";
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

const UserScreen = () => {
  const navigation = useNavigation();

  const onLogOutPressed = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "No", onPress: () => {} },
      { text: "Yes", onPress: () => navigation.navigate("LogInScreen") },
    ]);
  };

  const onSettingsPressed = () => {
    // navigation.navigate("SettingsScreen");
  };

  const onEditProfilePressed = () => {
    // navigation.navigate("EditProfileScreen");
  };

  const onAddRecipePressed = () => {
    // navigation.navigate("AddRecipeScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfoSection}>
        <View style={styles.userAvatar}>
          <View style={styles.userInfo}>
            <Title style={styles.title}>User</Title>
          </View>
        </View>
        <View style={styles.userDetails}>
          <View style={styles.userDetail}>
            <Text style={styles.detailText}>Loyalty points: 200</Text>
          </View>
        </View>
      </View>
      <Divider />
      <View style={styles.menuWrapper}>
        <TouchableRipple onPress={onEditProfilePressed}>
          <View style={styles.menuItem}>
            <Icon name="account-check-outline" color="#FF6347" size={25} />
            <Text style={styles.menuItemText}>Edit Profile</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={onAddRecipePressed}>
          <View style={styles.menuItem}>
            <Icon name="database-plus" color="#FF6347" size={25} />
            <Text style={styles.menuItemText}>Add Personalised Recipe</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={onSettingsPressed}>
          <View style={styles.menuItem}>
            <Icon name="cog" color="#FF6347" size={25} />
            <Text style={styles.menuItemText}>Settings</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={onLogOutPressed}>
          <View style={styles.menuItem}>
            <Icon name="exit-to-app" color="#FF6347" size={25} />
            <Text style={styles.menuItemText}>Log Out</Text>
          </View>
        </TouchableRipple>
      </View>
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
  userAvatar: {
    flexDirection: "row",
    justifyContent: "center",
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
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  menuItemText: {
    color: "#777777",
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,
  },
});
