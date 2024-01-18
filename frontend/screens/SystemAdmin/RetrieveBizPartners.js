import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { Context } from "../../store/context";

export default function RetrieveUsers() {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useContext(Context);
  const [users, setUsers] = useState([]); // State to store the list of users

  useEffect(() => {
    fetchUsersByType("bizpartner");
  }, []);

  const fetchUsersByType = async (userType) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/user/getUserTypes?userType=${userType}`
      );
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.detailBox}>
        <View style={styles.componentContainer}>
          <View style={styles.leftComponent1}>
            <Text style={styles.title}>No. </Text>
          </View>
          <View style={styles.rightComponent1}>           
            <Text style={styles.title}>Business Accounts</Text>
          </View>
        </View>
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("BizPartnerInfo", { user: item })
              }
            >
              <View style={styles.componentContainer}>
                <View style={styles.leftComponent}>
                  <Text style={styles.numbering}>{index + 1}</Text>
                </View>
                <View style={styles.rightComponent}>
                  <Text style={styles.subTitle}>{item.username}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  componentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  leftComponent: {
    flex: 0.5,
    paddingLeft: 10,
    marginBottom:10,
  },
  rightComponent: {
    flex: 1,
    paddingLeft: 20,
    marginBottom:10,
  },
  leftComponent1: {
    flex: 0.5,
  },
  rightComponent1: {
    flex: 1,
  },
  // titleRow: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   marginBottom: 10,
  //   paddingHorizontal: 20,
  // },
  title: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    //textAlign: "center",
  },
  // row: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   paddingVertical: 10,
  //   paddingHorizontal: 25,
  // },
  detailBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    margin: 10,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3.84,
    shadowOpacity: 0.25,
    elevation: 5,
  },
  numbering: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 10,
  },
});
