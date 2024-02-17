import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Text,
  Title,
  TouchableRipple
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Context } from "../../store/context";

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
          //navigation.navigate("LogInScreen");
          navigation.reset({
            index: 0,
            routes: [{ name: "LogInScreen" }],
          });
        },
      },
    ]);
  };

  const handleViewUserProfile = () => {
    navigation.navigate("View User Profile");
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
    navigation.push("View Added Recipe");
  };

  const onViewFoodRecognitionLog = () => {
    navigation.push("View Food Recognition Log")
  }

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
  const onViewFavouritesPressed = () => {
    // Navigate to the "Insert Medical History" screen
    navigation.push("Favourites", { screen: "Community" });
  };
  const onViewBizFavouritesPressed = () => {
    // Navigate to the "Insert Medical History" screen
    navigation.push("Favourites", { screen: "Business" });
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

          <Text
            onPress={() => handleViewUserProfile()}
            style={styles.detailText}
          >User Profile</Text>
        </View>

        <View style={styles.menuWrapper}>
          {/* <TouchableRipple onPress={onEditProfilePressed}>
          <View style={styles.menuItem}>
            <Icon name="account-edit" color="#FF6347" size={25} />
            <Text style={styles.menuItemText}>Edit Profile</Text>
          </View>
        </TouchableRipple> */}

          <Text style={styles.subTitle}>Account</Text>
          <TouchableRipple onPress={onCalculateCaloriePressed}>
            <View style={styles.menuItem}>
              <Icon
                name="calculator"
                size={25}
                color="#ED6F21"
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
                color="#ED6F21"
                style={styles.icon}
              />
              <Text style={styles.menuItemText}>Insert Medical History</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={onTrackProgressPressed}>
            <View style={styles.menuItem}>
              <Icon name="chart-bar" color="#ED6F21" size={25} />
              <Text style={styles.menuItemText}>Track Progress</Text>
            </View>
          </TouchableRipple>

          <View style={styles.divider} />
          <Text style={styles.subTitle}>Recipe</Text>
          <TouchableRipple onPress={onAddRecipePressed}>
            <View style={styles.menuItem}>
              <Icon name="silverware-fork-knife" color="#ED6F21" size={25} />
              <Text style={styles.menuItemText}>Add Recipe</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={onViewRecipePressed}>
            <View style={styles.menuItem}>
              <Icon name="silverware-fork-knife" color="#ED6F21" size={25} />
              <Text style={styles.menuItemText}>View Added Recipe</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={onViewFoodRecognitionLog}>
            <View style={styles.menuItem}>
              <Icon name="silverware-fork-knife" color="#ED6F21" size={25} />
              <Text style={styles.menuItemText}>View Food Recognition Log</Text>
            </View>
          </TouchableRipple>

          <View style={styles.divider} />
          <Text style={styles.subTitle}>Favourite Recipe</Text>
          <TouchableRipple onPress={onViewFavouritesPressed}>
            <View style={styles.menuItem}>
              <Icon name="heart" color="#ED6F21" size={25} />
              <Text style={styles.menuItemText}>
                Favourite Community Recipe
              </Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={onViewBizFavouritesPressed}>
            <View style={styles.menuItem}>
              <Icon name="hand-heart-outline" color="#ED6F21" size={25} />
              <Text style={styles.menuItemText}>Favourite Business Recipe</Text>
            </View>
          </TouchableRipple>

          <View style={styles.divider} />
          <Text style={styles.subTitle}>Request</Text>
          <TouchableRipple onPress={handleSubmitFoodRequest}>
            <View style={styles.menuItem}>
              <Icon name="silverware-variant" color="#ED6F21" size={25} />
              <Text style={styles.menuItemText}>Add Food & Drinks Request</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={handleNavigateToViewRequest}>
            <View style={styles.menuItem}>
              <Icon name="silverware-variant" color="#ED6F21" size={25} />
              <Text style={styles.menuItemText}>View Request Status</Text>
            </View>
          </TouchableRipple>
          <View style={styles.divider} />
          <Text style={styles.subTitle}>Others</Text>
          <TouchableRipple onPress={onPastOrderspressed}>
            <View style={styles.menuItem}>
              <Icon name="clipboard-list-outline" color="#ED6F21" size={25} />
              <Text style={styles.menuItemText}>View Completed Orders</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={onSettingsPressed}>
            <View style={styles.menuItem}>
              <Icon name="cog" color="#ED6F21" size={25} />
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
              <Icon name="exit-to-app" color="#ED6F21" size={25} />
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
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333", 
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
    // fontWeight: "bold",
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
