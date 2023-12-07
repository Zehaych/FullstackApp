import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useContext, useEffect} from "react";
import { Context } from "../../store/context";
import { useFocusEffect } from "@react-navigation/native";

const FoodRequested = () => {
    const [foodRequests, setFoodRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useContext(Context);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentRequest, setCurrentRequest] = useState(null);
    const [nutritionInfo, setNutritionInfo] = useState({
        calories: '',
        protein: '',
        fats: '',
        carbs: ''
    });


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

    const approveFoodRequest = async (requestId) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/foodrequest/approveFoodRequest/${requestId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to approve food request');
            }
    
            const result = await response.json();
            console.log('Food request approved:', result);
        } catch (error) {
            console.error('Error approving food request:', error);
        }
    };


    const postToFoodAndDrinks = async (nutritionInfo) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/foodanddrinks/addFoodAndDrink`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nutritionInfo)
            });
    
            const result = await response.json();
            if (response.ok) {
                console.log('Added to foodanddrinks:', result);
                return true;
            } else if (response.status === 400 && result.message.includes("already exists")) {
                throw new Error(result.message);
            } else {
                throw new Error('Failed to add food to foodanddrinks collection');
            }
        } catch (error) {
            console.error('Error posting to foodanddrinks:', error);
            alert(error.message);
        }
    };
        
    
    const openModal = (request) => {
        setCurrentRequest(request);
        setModalVisible(true);
    };

    const handleConfirm = async () => {
        const foodData = {
            name: currentRequest.name, 
            ...nutritionInfo
        };
        
        const success = await postToFoodAndDrinks(foodData);
        if (success) {
        await approveFoodRequest(currentRequest._id);
        } else {
        setModalVisible(false);
        fetchFoodRequests(); // Refresh the list
        }
    };
    const closeModal = () => {
        setModalVisible(false);
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

                            <TouchableOpacity style={[styles.button, styles.secondButton]} onPress={() => openModal(item)}>
                                <Text style={styles.buttonText}>Approve Request</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.thirdButton]} onPress={() => rejectFoodRequest(item._id)}>
                                <Text style={styles.buttonText}>Reject Request</Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}

{
    modalVisible && (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TextInput
                        style={styles.input}
                        placeholder="Calories"
                        value={nutritionInfo.calories}
                        onChangeText={(text) => setNutritionInfo({...nutritionInfo, calories: text})}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Protein"
                        value={nutritionInfo.protein}
                        onChangeText={(text) => setNutritionInfo({...nutritionInfo, protein: text})}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Fats"
                        value={nutritionInfo.fats}
                        onChangeText={(text) => setNutritionInfo({...nutritionInfo, fats: text})}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Carbs"
                        value={nutritionInfo.carbs}
                        onChangeText={(text) => setNutritionInfo({...nutritionInfo, carbs: text})}
                        keyboardType="numeric"
                    />
                    <View style = {styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.confirmButton} 
                        onPress={handleConfirm}
                    >
                        <Text style={styles.confirmButtonText}>Confirm</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={closeModal}
                    >
                        <Text style={styles.confirmButtonText}>Close</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%', // Adjust as needed
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: '100%', // Adjust as needed
    },
    confirmButton: {
        backgroundColor: '#2196F3',
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        marginTop: 20,
    },
    confirmButtonText: {
        color: 'white',
    },
    buttonText: {
        textAlign: "center",
        color: "white",
        fontSize: 16,
      },
    buttonContainer: {
        margin: 10,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
      },
    button: {
        backgroundColor: "#007bff", // Blue color for the primary button
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: "center",
      },
    secondButton: {
        backgroundColor: "green",
    },
    thirdButton: {
        backgroundColor: "#FF0000",
      },
    container: {
        marginTop: 30,
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
