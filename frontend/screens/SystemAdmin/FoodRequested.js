import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useContext, useEffect} from "react";
import { Context } from "../../store/context";
import { useFocusEffect } from "@react-navigation/native";

const FoodRequested = () => {
    const [foodRequests, setFoodRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useContext(Context);

    useEffect(() => {
        fetchFoodRequests();
    }, []);

    const fetchFoodRequests = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/foodrequest/getFoodRequests`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setFoodRequests(data);
            } else {
                console.error('Failed to fetch food requests');
            }
        } catch (error) {
            console.error('Error fetching food requests:', error);
        } finally {
            setLoading(false);
        }
    };




    const rejectFoodRequest = async (requestId) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/foodrequest/rejectFoodRequest/${requestId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (response.ok) {
                alert('Food request rejected successfully');
                fetchFoodRequests();
            } else {
                alert('Failed to reject food request');
            }
        } catch (error) {
            console.error('Error rejecting food request:', error);
            alert('Error occurred while rejecting food request');
        }
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{currentUser.username}</Text>
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={foodRequests}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.title}>{item.name}</Text>
                            <Text style={styles.subtitle}>Status: {item.status}</Text>

                            <View style={styles.buttonContainer}>
                            <TouchableOpacity style={[styles.button, styles.thirdButton]} onPress={() => rejectFoodRequest(item._id)}>
                                <Text style={styles.buttonText}>Reject Request</Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    buttonText: {
        color: "white",
        fontSize: 16,
      },
    buttonContainer: {
        margin: 10,
        overflow: "hidden",
      },
    button: {
        backgroundColor: "#007bff", // Blue color for the primary button
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: "center",
      },
    thirdButton: {
        backgroundColor: "#FF0000",
      },
    container: {
        marginTop: 30,
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10,
    },
    item: {
        backgroundColor: 'white', 
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 20,
        marginBottom: 5,
    },  
    status: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#2e2e2e',
    },
});


export default FoodRequested;
