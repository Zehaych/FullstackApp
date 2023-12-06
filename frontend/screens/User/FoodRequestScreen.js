import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { Context } from "../../store/context";

const SubmitFoodRequest = () => {
    const navigation = useNavigation();
    const [foodName, setFoodName] = useState('');
    const [currentUser, setCurrentUser] = useContext(Context);

    const submitRequest = async (foodName, userId) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/foodrequest/createFoodRequest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: foodName,
                    userId: userId
                })
            });
            console.log(userId)
    
            const result = await response.json(); // Always parsing the response
            if (response.ok) {
                console.log('Food request submitted:', result);
                return { success: true, data: result };
            } else {
                console.error('Failed to submit food request:', result);
                return { success: false, error: result.message || 'Failed to submit food request' };
            }
        } catch (error) {
            console.error('Error submitting food request:', error);
            return { success: false, error: error.message || 'An error occurred' };
        }
    };
    

    const handleFormSubmit = async () => {
        if (!foodName.trim()) {
            Alert.alert('Please enter a food name');
            return;
        }
    
        // const foodData = { name: foodName }; // Creating an object with the name property
        try {
            await submitRequest(foodName, currentUser._id);
            Alert.alert('Food request submitted successfully');
            setFoodName(""); 
        } catch (error) {
            Alert.alert('Error', 'Failed to submit food request');
        }
    };
    

    const handleGoBack = () => {
        navigation.navigate("User Profile");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{currentUser.username}</Text>
            <Text style={styles.title}>Submit a Food Request</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter food name"
                value={foodName}
                onChangeText={setFoodName}
            />
            <TouchableOpacity style={styles.button} onPress={handleFormSubmit}>
                <Text style={styles.buttonText}>Submit Request</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleGoBack}>
                <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: '#ffffff',
        textAlign: 'center',
    },

});

export default SubmitFoodRequest;
