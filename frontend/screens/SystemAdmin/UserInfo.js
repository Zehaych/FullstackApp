import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UserInfo = ({ route, navigation }) => {
    const { user } = route.params; // Retrieve the user data passed from the previous screen

    return (
        <View style={styles.container}>
            <Text style={styles.infoTitle}>User Information</Text>
            <Text style={styles.userInfo}>User: {user.username}</Text>
            <Text style={styles.userInfo}>Email: {user.email}</Text>
            <Text style={styles.userInfo}>Status: {user.isActive ? 'Active' : 'Suspended'}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,
        alignItems: 'center', // Center content horizontally
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    infoTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333', // Adjust the color as needed
    },
    userInfo: {
        fontSize: 20,
        color: '#444', // Adjust the color as needed
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd', // Adjust the border color as needed
        borderRadius: 5,
        width: '80%', // Adjust the width as needed
        textAlign: 'center', // Center-align text
        backgroundColor: 'white', // Adjust the background color as needed
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    // ... other styles ...
});


export default UserInfo;
