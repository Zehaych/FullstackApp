import React, { useState, useEffect, useContext } from "react";
import { FlatList, View, Text, Modal, StyleSheet, Button, TouchableOpacity, TextInput, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Context } from "../../store/context";

const FoodAndDrinksInfo = () => {
    const [currentUser, setCurrentUser] = useContext(Context);
    const [foodAndDrinks, setFoodAndDrinks] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [AddFoodModalVisible, setAddFoodModalVisible] = useState(false);
    
    const [selectedItemId, setSelectedItemId] = useState(null);

    const [adminPassword, setAdminPassword] = useState('');
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [currentRequest, setCurrentRequest] = useState("");
    const [updateData, setUpdateData] = useState({
        name: '',
        calories: '',
        protein: '',
        fats: '',
        carbs: '',
    });

    const [name, setName] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [fats, setFats] = useState('');
    const [carbs, setCarbs] = useState('');


    useEffect(() => {
        fetchFoodAndDrinks();
    }, []);

    const fetchFoodAndDrinks = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/foodanddrinks/getFoodAndDrinks`);
            const data = await response.json();
            setFoodAndDrinks(data);
        } catch (error) {
            console.error('Error fetching food and drinks:', error);
        }
    };

    const addFoodAndDrink = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/foodanddrinks/addFoodAndDrink`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    calories: Number(calories),
                    protein: Number(protein),
                    fats: Number(fats),
                    carbs: Number(carbs),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add food and drink');
            }

            const result = await response.json();
            Alert.alert('Success', 'Food and drink added successfully');
            setAddFoodModalVisible(false); // Close the modal
            fetchFoodAndDrinks();
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Failed to add food and drink');
        }
    };


    const validateAndDeleteFoodAndDrinks = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/user/validateAdminPassword/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: adminPassword }),
            });
            const data = await response.json();
    
            if (data.isValid) {
                deleteFoodAndDrink(selectedItemId); 
                setModalVisible(false); 
                setSelectedItemId(null); 
            } else {
                Alert.alert('Invalid Password', 'The entered password is incorrect.');
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'An error occurred during validation.');
        }
    };

    const deleteFoodAndDrink = async (id) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/foodanddrinks/deleteFoodAndDrink/${id}`, {
                method: 'DELETE'
            });
    
            if (response.ok) {
                alert('Food and drink deleted successfully');
                fetchFoodAndDrinks(); // Refresh the list
            } else {
                alert('Failed to delete food and drink');
            }
        } catch (error) {
            console.error('Error deleting food and drink:', error);
            alert('Error occurred while deleting food and drink');
        }
    };

    
    const openDeleteModal = (itemId) => {
        setSelectedItemId(itemId);  
        setModalVisible(true); 
    };
    
    const updateFoodAndDrink = async (id, updatedData) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/foodanddrinks/updateFoodAndDrink/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData)
            });
    
            if (response.ok) {
                alert('Food and drink updated successfully');
                fetchFoodAndDrinks(); // Refresh the list
            } else {
                alert('Failed to update food and drink');
            }
        } catch (error) {
            console.error('Error updating food and drink:', error);
            alert('Error occurred while updating food and drink');
        }
    };


    const openUpdateModal = (item) => {
        setUpdateData({
            name: item.name,
            calories: item.calories,
            protein: item.protein,
            fats: item.fats,
            carbs: item.carbs
        });
        setCurrentRequest(item);
        setUpdateModalVisible(true);
    };


    const handleUpdateConfirm = async () => {
        await updateFoodAndDrink(currentRequest._id, updateData);
        setUpdateModalVisible(false);
        fetchFoodAndDrinks(); // Refresh the list
    };
    
    const handleCloseModalUpdate = () => {
        setUpdateModalVisible(false);
    };
    

    // Render item for FlatList
    const renderItem = ({ item }) => (
        <View style={styles.detailBox}>
            <Text style={styles.title}>{item.name}</Text>
            <View style={styles.componentContainer}>
                <Text style={styles.subtitle1}>Calories</Text>
                <Text style={styles.subtitle}>{item.calories} kcal</Text>
            </View>
            <View style={styles.componentContainer}>
                <Text style={styles.subtitle1}>Protein</Text>
                <Text style={styles.subtitle}>{item.protein} g</Text>
            </View>
            <View style={styles.componentContainer}>
                <Text style={styles.subtitle1}>Fats</Text>
                <Text style={styles.subtitle}>{item.fats} g</Text>
            </View>
            <View style={styles.componentContainer}>
                <Text style={styles.subtitle1}>Carbs</Text>
                <Text style={styles.subtitle}>{item.carbs} g</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => openUpdateModal(item)}>
                <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
    
            <TouchableOpacity style={styles.deleteButton} onPress={() => openDeleteModal(item._id)}>
                <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>


            <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TextInput
                        secureTextEntry
                        style={styles.input}
                        placeholder="Enter Admin Password"
                        value={adminPassword}
                        onChangeText={setAdminPassword}
                    />
                    <View style = {styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.modalButtonSubmit}
                        onPress={() => {
                            setModalVisible(false);
                            validateAndDeleteFoodAndDrinks();
                        }}
                    >
                    <Text style={styles.buttonText}>Confirm</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.modalButtonDelete}
                        onPress={() => {
                            setModalVisible(false);
                        }}
                    >
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

        {updateModalVisible && (
        <Modal
            animationType="slide"
            transparent={true}
            visible={updateModalVisible}
            onRequestClose={() => setUpdateModalVisible(false)}
        >
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                {/* TextInput for Name */}
                <Text style={styles.subtitle}>Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={updateData.name}
                    onChangeText={(text) => setUpdateData({...updateData, name: text})}
                />

                {/* TextInput for Calories */}
                <Text style={styles.subtitle}>Calories</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Calories"
                    value={updateData.calories ? updateData.calories.toString() : ''}
                    onChangeText={(text) => setUpdateData({...updateData, calories: text})}
                    keyboardType="numeric"
                />

                {/* TextInput for Protein */}
                <Text style={styles.subtitle}>Protein</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Protein"
                    value={updateData.protein ? updateData.protein.toString() : ''}
                    onChangeText={(text) => setUpdateData({...updateData, protein: text})}
                    keyboardType="numeric"
                />

                {/* TextInput for Fats */}
                <Text style={styles.subtitle}>Fats</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Fats"
                    value={updateData.fats ? updateData.fats.toString() : ''}
                    onChangeText={(text) => setUpdateData({...updateData, fats: text})}
                    keyboardType="numeric"
                />

                {/* TextInput for Carbs */}
                <Text style={styles.subtitle}>Carbs</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Carbs"
                    value={updateData.carbs ? updateData.carbs.toString() : ''}
                    onChangeText={(text) => setUpdateData({...updateData, carbs: text})}
                    keyboardType="numeric"
                />

                <View style = {styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.modalButtonSubmit} 
                    onPress={handleUpdateConfirm}
                >
                    <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.modalButtonDelete} 
                    onPress={handleCloseModalUpdate}
                >
                    <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
                </View>
            </View>
        </View>
        </Modal>
        )}
    </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.addbutton} onPress={() => setAddFoodModalVisible(true)}>
                <Text style={styles.buttonText}> + Add New Food and Drink </Text>
            </TouchableOpacity>

            <FlatList
                data={foodAndDrinks}
                keyExtractor={item => item._id}
                renderItem={renderItem}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={AddFoodModalVisible}
                onRequestClose={() => setAddFoodModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.subtitle}>Name</Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Name" 
                            value={name} 
                            onChangeText={setName} 
                        />
                        <Text style={styles.subtitle}>Calories</Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Calories" 
                            value={calories} 
                            onChangeText={setCalories} 
                            keyboardType="numeric" 
                        />
                        <Text style={styles.subtitle}>Protein</Text>
                        <TextInput style={styles.input} 
                            placeholder="Protein" 
                            value={protein} 
                            onChangeText={setProtein} 
                            keyboardType="numeric" 
                        />
                        <Text style={styles.subtitle}>Fats</Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Fats" 
                            value={fats} 
                            onChangeText={setFats} 
                            keyboardType="numeric" 
                        />
                        <Text style={styles.subtitle}>Carbs</Text>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Carbs" 
                            value={carbs} 
                            onChangeText={setCarbs} 
                            keyboardType="numeric" 
                        />

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.modalButtonSubmit} onPress={addFoodAndDrink}>
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButtonDelete} onPress={() => setAddFoodModalVisible(false)}>
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        width: '100%',  // Adjust as needed
        borderWidth: 1,
        borderColor: '#d0d0d0', // Light grey border
        borderRadius: 5, // Rounded corners
        padding: 10, // Inner padding
        fontSize: 16, // Text size
        backgroundColor: '#fff', // White background
        marginBottom: 10, // Space between each input
        marginTop: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    modalView: {
        width: '80%', 
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        //alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        //padding: 10,
    },

    // item: {
    //     backgroundColor: '#f9f9f9',
    //     padding: 20,
    //     marginVertical: 8,
    //     borderRadius: 5,
    // },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        width: '100%', // Adjust as needed
    },
    addbutton:{
        backgroundColor: '#ED6F21',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
        marginHorizontal: 20,
    },
    button: {
        backgroundColor: '#ED6F21',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#A9A9A9',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
    },
    detailBox: {
        //flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 20,
        marginVertical: 10,
        marginHorizontal: 20,
        shadowColor: "#000000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowRadius: 3.84,
        shadowOpacity: 0.25,
        elevation: 5,
    },
    componentContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    modalButtonSubmit: {
        backgroundColor: '#ED6F21',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
        marginHorizontal: 10,
        width: '100%', // Adjust as needed
    },
    modalButtonDelete: {
        backgroundColor: '#A9A9A9',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
        marginHorizontal: 10,
        width: '100%', // Adjust as needed
    },
    subtitle1: {
        fontSize: 16,
        //fontWeight: 'bold',
        //color: '#ED6F21',
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default FoodAndDrinksInfo;
