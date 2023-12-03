import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const UserInfo = ({ route, navigation }) => {
    const { user } = route.params; // Retrieve the user data passed from the previous screen

    const suspendUser = async (userId) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/user/suspend/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any necessary headers like authorization tokens
                },
            });
            const data = await response.json();
            if (response.ok) {
                alert('User suspended successfully');
                // Additional logic to update UI or state
            } else {
                alert(data.message || 'Error suspending user');
            }
        } catch (error) {
            console.error('Error suspending user:', error);
            alert('Error suspending user');
        }
    };
    
    const unsuspendUser = async (userId) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/user/unsuspend/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any necessary headers like authorization tokens
                },
            });
            const data = await response.json();
            if (response.ok) {
                alert('User unsuspended successfully');
                // Additional logic to update UI or state
            } else {
                alert(data.message || 'Error reactivating user');
            }
        } catch (error) {
            console.error('Error reactivating user:', error);
            alert('Error reactivating user');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.infoTitle}>User Information</Text>
            <Text style={styles.userInfo}>User: {user.username}</Text>
            <Text style={styles.userInfo}>Email: {user.email}</Text>
            <Text style={styles.userInfo}>Status: {user.isActive ? 'Active' : 'Suspended'}</Text>
            <View style={styles.buttonContainer}>
                <View style={styles.button}>
                    <Button
                        title="Suspend User"
                        color="white" // Set the text color
                        onPress={() => suspendUser(user._id)}
                    />
                </View>
                <View style={[styles.button, styles.secondaryButton]}>
                    <Button
                        title="Reactivate User"
                        color="white" // Set the text color
                        onPress={() => unsuspendUser(user._id)}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        margin: 10,
        overflow: 'hidden',
    },
    button: {
        backgroundColor: '#007bff', // Blue color for the primary button
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    secondaryButton: {
        backgroundColor: '#28a745', // Green color for the secondary button
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
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
