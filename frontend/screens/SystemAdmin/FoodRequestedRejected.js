import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useContext, useEffect} from "react";
import { Context } from "../../store/context";
import { useFocusEffect } from "@react-navigation/native";
import IconToo from "react-native-vector-icons/MaterialIcons";

const FoodRequestedRejected = () => {
    const [foodRequests, setFoodRequests] = useState([]);
    const [rejectRequests, setRejectRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [currentUser, setCurrentUser] = useContext(Context);
    // const [modalVisible, setModalVisible] = useState(false);
    // const [currentRequest, setCurrentRequest] = useState(null);
    // const [nutritionInfo, setNutritionInfo] = useState({
    //     calories: '',
    //     protein: '',
    //     fats: '',
    //     carbs: ''
    // });


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

                const rejectRequests = data.filter(item => item.status === 'rejected');
                setRejectRequests(rejectRequests);
            } else {
                console.error('Failed to fetch food requests');
            }
        } catch (error) {
            console.error('Error fetching food requests:', error);
        } finally {
            setLoading(false);
        }
    };


    // const rejectFoodRequest = async (requestId) => {
    //     try {
    //         const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/foodrequest/rejectFoodRequest/${requestId}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             }
    //         });
    
    //         if (response.ok) {
    //             alert('Food request rejected successfully');
    //             fetchFoodRequests();
    //         } else {
    //             alert('Failed to reject food request');
    //         }
    //     } catch (error) {
    //         console.error('Error rejecting food request:', error);
    //         alert('Error occurred while rejecting food request');
    //     }
    // };

    // const approveFoodRequest = async (requestId) => {
    //     try {
    //         const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/foodrequest/approveFoodRequest/${requestId}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             }
    //         });
    
    //         if (!response.ok) {
    //             throw new Error('Failed to approve food request');
    //         }
    
    //         const result = await response.json();
    //         console.log('Food request approved:', result);
    //     } catch (error) {
    //         console.error('Error approving food request:', error);
    //     }
    // };


    // const postToFoodAndDrinks = async (nutritionInfo) => {
    //     try {
    //         const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/foodanddrinks/addFoodAndDrink`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(nutritionInfo)
    //         });
    
    //         const result = await response.json();
    //         if (response.ok) {
    //             console.log('Added to foodanddrinks:', result);
    //             return true;
    //         } else if (response.status === 400 && result.message.includes("already exists")) {
    //             throw new Error(result.message);
    //         } else {
    //             throw new Error('Failed to add food to foodanddrinks collection');
    //         }
    //     } catch (error) {
    //         console.error('Error posting to foodanddrinks:', error);
    //         alert(error.message);
    //     }
    // };
        
    
    // const openModal = (request) => {
    //     setCurrentRequest(request);
    //     setModalVisible(true);
    // };

    // const handleConfirm = async () => {
    //     const foodData = {
    //         name: currentRequest.name, 
    //         ...nutritionInfo
    //     };
        
    //     const success = await postToFoodAndDrinks(foodData);
    //     if (success) {
    //     await approveFoodRequest(currentRequest._id);
    //     setModalVisible(false);
    //     fetchFoodRequests();
    //     } else {
    //     setModalVisible(false);
    //     fetchFoodRequests(); // Refresh the list
    //     }
    // };
    // const closeModal = () => {
    //     setModalVisible(false);
    // };
    

    return (
        <View style={styles.container}>

            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={rejectRequests}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <Text style={styles.title}>{item.name}</Text>
                            <View style={styles.statusContainer}>
                                <Text style={styles.status1}>Status </Text>
                                <Text style={styles.status2}>{item.status}</Text>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        backgroundColor: '#f5f5f5',
        padding: 10,
        marginBottom: 10,
    },
    item: {
        backgroundColor: 'white', 
        paddingVertical: 10,
        paddingHorizontal: 20,
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
    status1: {
        fontSize: 16,
        //fontStyle: 'italic',
        color: '#000000',
    },
    status2: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#ED6F21',
    },
    statusContainer: {
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
});


export default FoodRequestedRejected;