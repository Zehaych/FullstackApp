import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    Pressable,
    FlatList,
    StyleSheet
  } from "react-native";
import React, { useState, useEffect, useContext } from 'react';
import { useNavigation } from "@react-navigation/native";
import { Context } from "../store/context";

export default function RetrieveUsers() {
    const navigation = useNavigation();
    const [currentUser, setCurrentUser] = useContext(Context);
    const [users, setUsers] = useState([]); // State to store the list of users

    useEffect(() => {
        fetchUsersByType('bizpartner'); 
    }, []);

    const fetchUsersByType = async (userType) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/user/getUserTypes?userType=${userType}`);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{currentUser.username}</Text>
            <Text>Business Partner Accounts</Text>
            <FlatList
                data={users}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <Text>{item.username}</Text>} // Update this to display the user data as needed
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
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
    }
});