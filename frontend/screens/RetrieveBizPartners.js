import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    Pressable,
    StyleSheet
  } from "react-native";
import React, { useState, useContext } from 'react';
import { useNavigation } from "@react-navigation/native";
import { Context } from "../store/context";

export default function RetrieveBizPartners() {
    const navigation = useNavigation();
    const [currentUser, setCurrentUser] = useContext(Context);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{currentUser.username}</Text>
            <Text>Business Partner Accounts</Text>

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