import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { Context } from "../../store/context";

const ViewRequest = () => {
    const [foodRequests, setFoodRequests] = useState([]);
    const [currentUser, setCurrentUser] = useContext(Context);

    useEffect(() => {
        fetchUserFoodRequests();
    }, []);

    const fetchUserFoodRequests = async () => {
        try {
            const userId = currentUser._id; 
            console.log(currentUser);
    
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/foodrequest/getUserFoodRequests/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                setFoodRequests(data);
            } else {
                const errorData = await response.json();
                console.error('Failed to fetch food requests:', errorData.message);
                Alert.alert('Error', 'Failed to fetch food requests');
            }
           
        } catch (error) {
            console.error('Error fetching food requests:', error);
            Alert.alert('Error', 'An error occurred while fetching food requests');
        }
    };
    
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{currentUser.username}</Text>
            <FlatList
                data={foodRequests}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.title}>{item.name}</Text>
                        <Text>Status: {item.status}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    container: {
        marginTop: 30,
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    item: {
        backgroundColor: 'white',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 10,
        borderRadius: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default ViewRequest;
