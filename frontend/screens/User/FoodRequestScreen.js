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
    

    // const handleGoBack = () => {
    //     navigation.navigate("User Profile");
    // };

    // const handleGoBack = () => {
    //     navigation.goBack();
    // };

    return (
        <View style={styles.container}>
            <View style={styles.foodrequestcontainer}>
                <Text style={styles.title}>
                    Welcome <Text style={styles.user}>{currentUser.username}</Text>, please fill in the food you would like to request.
                </Text>
                
                <TextInput
                    style={styles.input}
                    placeholder="Food Name"
                    value={foodName}
                    onChangeText={setFoodName}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleFormSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: "#fff",
        marginTop: 8,
        marginHorizontal: 16,
        borderRadius: 20,
        gap: 16,
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    foodrequestcontainer: {
        gap: 8,
        alignSelf: "stretch",
    },
    title: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 15,
    },
    user: {
        fontSize: 16,
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
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#ED6F21',
        padding: 10,
        width: "100%",
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },

});

export default SubmitFoodRequest;
