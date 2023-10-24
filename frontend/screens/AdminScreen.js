import { useNavigation } from '@react-navigation/native';
import {
    Avatar,
    Title,
    Caption,
    TouchableRipple,
    Divider,
  } from "react-native-paper";
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useContext } from "react";
import { Context } from "../store/context";

const AdminScreen = () => {
    const navigation = useNavigation();
    const [currentUser, setCurrentUser] = useContext(Context);

    const onLogOutPressed = () => {
        Alert.alert("Log Out", "Are you sure you want to log out?", [
          { text: "No", onPress: () => {} },
          {
            text: "Yes",
            onPress: () => {
              AsyncStorage.removeItem("userId");
              setCurrentUser(null);
              navigation.navigate("LogInScreen");
            },
          },
        ]);
      };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{currentUser.username}</Text>
            <Text>Welcome to the Admin Screen</Text>
            {/* Add more components or information specific to business partners here */}


            <TouchableRipple onPress={onLogOutPressed}>
            <View style={styles.menuItem}>
            <Icon name="exit-to-app" color="#FF6347" size={25} />
            <Text style={styles.menuItemText}>Log Out</Text>
            </View>
            </TouchableRipple>
        </View>

        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});

export default AdminScreen;
