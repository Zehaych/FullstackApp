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
        <ScrollView>
        <View style={styles.container}>
            <Text style={styles.recipeTitle}>Reported Recipe: {recipe.name}</Text>
            <View style={styles.reportsContainer}>
                <TouchableOpacity
                    style={styles.dismissButton}
                    onPress={() => dismissReport(recipe._id)}
                >
                <Text style={styles.buttonText}>Dismiss Report</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.seconddismissButton} 
                    onPress={() => setIsModalVisible(true)}>
                    <Text style={styles.buttonText}>Delete Recipe</Text>
                </TouchableOpacity>

                {recipe.reportedBy.map((report, index) => (
                    <View key={index} style={styles.reportItem}>
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
                    />
                    <Button
                        title="Confirm Deletion"
                        onPress={() => {
                            setIsModalVisible(false);
                            deleteReportedRecipe(recipe._id);
                        }}
                    />
                    <Button
                        title="Close"
                        onPress={() => {
                            setIsModalVisible(false);
                        }}
                    />
                    </View>
                </View>
            </Modal>

        </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
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
        backgroundColor: 'green', 
        padding: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    seconddismissButton: {
        backgroundColor: 'red', 
        padding: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    container:{
        marginTop: 30,
    },
    reportsContainer: {
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        marginTop: 10,
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
        marginTop: 30,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ReportedBizRecipeDetails;