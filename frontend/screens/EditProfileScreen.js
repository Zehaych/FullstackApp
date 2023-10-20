import React from "react";
import { View, StyleSheet } from "react-native";
import { TouchableRipple, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const EditProfileScreen = () => {
  const navigation = useNavigation();

  const onCalculateCaloriePressed = () => {
    // Navigate to the "Calculate Calorie" screen
    navigation.push("Calculate Calorie");
  };

  const onInsertMedicalHistoryPressed = () => {
    // Navigate to the "Insert Medical History" screen
    navigation.push("Medical History");
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
  },
  icon: {
    marginRight: 16,
  },
  menuItemText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default EditProfileScreen;
