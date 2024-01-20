import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal, TextInput, Button } from 'react-native';
import { Context } from "../../store/context";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from 'react-native-gesture-handler';


const ReportedBizRecipeDetails = ({ route }) => {
    const { recipe } = route.params;
    const navigation = useNavigation();
    const [currentUser, setCurrentUser] = useContext(Context);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");
    
    const dismissReport = async (recipeId) => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/bizrecipe/dismissReport/${recipeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log('Dismissing report for recipeId:', recipeId);

            if (response.ok) {
                Alert.alert('Success', 'Report dismissed as false.');
            } else {
                Alert.alert('Error', 'Failed to dismiss the report.');
            }
        } catch (error) {
            console.error('Error dismissing report:', error);
            Alert.alert('Error', 'An error occurred while dismissing the report.');
        }
    };

    const deleteReportedRecipe = async (recipeId) => {
        try {
            //Validate Admin Password
            const validationResponse = await fetch(`${process.env.EXPO_PUBLIC_IP}/user/validateAdminPassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: adminPassword })
            });
    
            if (!validationResponse.ok) {
                Alert.alert('Validation Failed', 'Incorrect admin password.');
                return;
            }
    
            //Delete the Recipe
            const deleteResponse = await fetch(`${process.env.EXPO_PUBLIC_IP}/bizrecipe/deleteBizRecipe/${recipeId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (deleteResponse.ok) {
                Alert.alert('Success', 'Recipe deleted successfully.');
            } else {
                Alert.alert('Error', 'Failed to delete the recipe.');
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'An error occurred during the process.');
        }
    };
    

    return (
        <View style={styles.mainContainer}>
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.recipeTitle}>{recipe.name}</Text>

                    <View style={styles.reportsContainer}>                        
                        {recipe.reportedBy.map((report, index) => (
                            <View key={index} style={styles.detailBox}>
                                <Text style={styles.reportText}>User ID: {report.user.username}</Text>
                                <Text style={styles.reportText}>Feedback: {report.feedback}</Text>
                                <Text style={styles.reportText}>Additional Comment: {report.additionalComment}</Text>
                                <Text style={styles.reportText}>Reported At: {new Date(report.reportedAt).toLocaleString()}</Text>
                            </View>
                        ))}
                    </View>

                    <Modal
                        visible={isModalVisible}
                        onRequestClose={() => setIsModalVisible(false)}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <TextInput
                                    secureTextEntry
                                    placeholder="Enter Admin Password"
                                    value={adminPassword}
                                    onChangeText={setAdminPassword}
                                    style={styles.inputTextModal}
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        setIsModalVisible(false);
                                        deleteReportedRecipe(recipe._id);
                                    }}
                                    style={styles.modalButton}
                                >
                                    <Text style={styles.buttonText}>Confirm Deletion</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        setIsModalVisible(false);
                                    }}
                                    style={styles.modalButton}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.seconddismissButton} 
                    onPress={() => setIsModalVisible(true)}
                >
                    <Text style={styles.buttonText}>Delete Recipe</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.dismissButton}
                    onPress={() => dismissReport(recipe._id)}
                >
                    <Text style={styles.buttonText}>Dismiss Report</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    detailBox: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 20,
        margin: 10,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowRadius: 3.84,
        shadowOpacity: 0.25,
        elevation: 5,
    }, 
    modalView: {
        width: '80%', 
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    dismissButton: {
        backgroundColor: '#ED6F21', 
        padding: 10,
        alignItems: 'center',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        borderRadius: 10,
    },
    seconddismissButton: {
        backgroundColor: '#ED6F21', 
        padding: 10,
        alignItems: 'center',
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    container:{
        flex: 1,
        marginTop: 20,
    },
    reportsContainer: {
        paddingTop: 10,
    },
    reportItem: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 3, 
    },
    reportText: {
        fontSize: 16,
        marginBottom: 5,
        color: '#555',
    },
    recipeItem: {
        padding: 10,
        marginVertical: 8,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    recipeTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonContainer: {
        paddingBottom: 20,
        paddingTop: 10,
        backgroundColor: 'white',
    },
    inputTextModal: {
        height: 40,
        width: '100%',
        borderColor: '#C6C6CD',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
    modalButton: {
        width: '100%',
        backgroundColor: '#ED6F21', 
        padding: 10,
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 10,
    },
});

export default ReportedBizRecipeDetails;