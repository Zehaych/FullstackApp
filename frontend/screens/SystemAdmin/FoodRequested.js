import { View, Text, FlatList, StyleSheet } from 'react-native';
import React, { useState, useContext, useEffect} from "react";
import { Context } from "../../store/context";

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
                    // Include authorization headers if necessary
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
                            <Text>Status: {item.status}</Text>
                            {/* Display other details as needed */}
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        flex: 1,
        backgroundColor: '#f5f5f5', // Light gray background
        padding: 10,
    },
    item: {
        backgroundColor: 'white', // White background for each item
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
    status: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#2e2e2e',
    },
    // Additional styling for other details can be added here
});


export default FoodRequested;
