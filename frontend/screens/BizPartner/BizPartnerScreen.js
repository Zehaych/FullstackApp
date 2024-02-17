import React from "react";
import { View, SafeAreaView, StyleSheet, Alert, Image } from "react-native";
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
import { useState } from "react";
import { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";

const BizPartnerScreen = () => {
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
          //navigation.navigate("LogInScreen");
          navigation.reset({
            index: 0,
            routes: [{ name: "LogInScreen" }],
          });
        },
      },
    ]);
  };

  // const onBizReportsPressed = () => {
  //   navigation.push("Biz Reports");
  // };
  const onBizReportsPressed = () => {
    navigation.push("TabReportScreen");
  };
  const onAddBizRecipePressed = () => {
    navigation.push("Add Business Recipe");
  };

  const onViewBizRecipePressed = () => {
    navigation.push("View Business Recipe");
  };

  const onViewOrdersPressed = () => {
    navigation.push("View Orders");
  };

  const onCompletedtOrdersPressed = () => {
    navigation.push("Completed Orders");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.userInfoSection}>
          <Image 
            source={require("../../assets/person-placeholder.jpg")} 
            style={styles.userImage} 
          />

          <Title style={styles.title}>{currentUser.username}</Title>

          <Text style={styles.detailText}>Business Partner Profile</Text>

          {/* <View style={styles.userDetails}>
            <View style={styles.userDetail}>
              <Text style={styles.detailText}>Sex: {currentUser.gender}</Text>
              <Text style={styles.detailText}>Age: {currentUser.age}</Text>

              <Text style={styles.detailText}>Weight: {currentUser.weight}</Text>

              <Text style={styles.detailText}>Height: {currentUser.height}</Text>
              <Text style={styles.detailText}>
                Calorie goal: {currentUser.calorie}
              </Text>
            </View>
          </View> */}
        </View>
        {/* <Divider /> */}

        <View style={styles.menuWrapper}>
          {/* <TouchableRipple onPress={onEditProfilePressed}>
            <View style={styles.menuItem}>
              <Icon name="account-edit" color="#FF6347" size={25} />
              <Text style={styles.menuItemText}>Edit Profile</Text>
            </View>
          </TouchableRipple> */}
          <Text style={styles.subTitle}>Recipe</Text>
          <TouchableRipple onPress={onAddBizRecipePressed}>
            <View style={styles.menuItem}>
              <Icon name="silverware-fork-knife" color="#ED6F21" size={25} />
              <Text style={styles.menuItemText}>Add Business Recipe</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={onViewBizRecipePressed}>
            <View style={styles.menuItem}>
              <Icon name="silverware-fork-knife" color="#ED6F21" size={25} />
              <Text style={styles.menuItemText}>View Added Recipe</Text>
            </View>
          </TouchableRipple>

          <View style={styles.divider} />
          <Text style={styles.subTitle}>Orders</Text>
          <TouchableRipple onPress={onViewOrdersPressed}>
            <View style={styles.menuItem}>
              <Icon name="clipboard-list-outline" color="#ED6F21" size={25} />
              <Text style={styles.menuItemText}>View Customer Orders</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={onCompletedtOrdersPressed}>
            <View style={styles.menuItem}>
              <Icon name="clipboard-list-outline" color="#ED6F21" size={25} />
              <Text style={styles.menuItemText}>View Completed Orders</Text>
            </View>
          </TouchableRipple>

          <View style={styles.divider} />
          <Text style={styles.subTitle}>Database</Text>
          <TouchableRipple onPress={onBizReportsPressed}>
            <View style={styles.menuItem}>
              <Icon name="notebook-outline" color="#ED6F21" size={25} />
              <Text style={styles.menuItemText}>Generate Reports</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={onLogOutPressed}>
            <View style={styles.menuItem}>
              <Icon name="exit-to-app" color="#ED6F21" size={25} />
              <Text style={styles.menuItemText}>Log Out</Text>
            </View>
          </TouchableRipple>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BizPartnerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  userInfoSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
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
    fontSize: 14,
    color: "grey",
  },
  divider: {
    borderBottomColor: "#C6C6CD",
    borderBottomWidth: 1,
    alignSelf: "center",
    width: "90%",
    marginTop: 10,
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 30,
    alignItems: "center",
    //borderBottomWidth: 1,
    //borderBottomColor: "#dddddd",
  },
  menuItemText: {
    color: "#000000",
    marginLeft: 20,
    // fontWeight: "600",
    fontSize: 16,
    lineHeight: 26,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 20,
    color: "grey",
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    margin: 10,
  },
});
