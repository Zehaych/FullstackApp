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

  // useFocusEffect(() => {
  //   fetchUsersByType("bizpartner");
  // }, []);

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
      <Text style={styles.title}>{currentUser.username}</Text>
      <Text style={styles.subtitle}>Business Partner Accounts</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate("BizPartnerInfo", { user: item })
            }
          >
            <Text>{item.username}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  title: {
    marginTop: 30,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "#333", 
    textAlign: "center",
  },
  item: {
    backgroundColor: "white",
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
