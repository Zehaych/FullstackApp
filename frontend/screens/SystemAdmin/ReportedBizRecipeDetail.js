import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Context } from "../../store/context";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from 'react-native-gesture-handler';


const ReportedBizRecipeDetails = ({ route }) => {
    const { recipe } = route.params;
    const navigation = useNavigation();
    const [currentUser, setCurrentUser] = useContext(Context);

    
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
                {recipe.reportedBy.map((report, index) => (
                    <View key={index} style={styles.reportItem}>
                        <Text style={styles.reportText}>User ID: {report.user.username}</Text>
                        <Text style={styles.reportText}>Feedback: {report.feedback}</Text>
                        <Text style={styles.reportText}>Additional Comment: {report.additionalComment}</Text>
                        <Text style={styles.reportText}>Reported At: {new Date(report.reportedAt).toLocaleString()}</Text>
                    </View>
                ))}
            </View>
        </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    dismissButton: {
        backgroundColor: 'green', 
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
        elevation: 3, // For Android shadow
    },
    reportText: {
        fontSize: 16,
        marginBottom: 5,
        color: '#555', // Slightly lighter text for details
    },
    recipeItem: {
        padding: 10,
        marginVertical: 8,
        backgroundColor: 'white',
        borderRadius: 5,
        // Other styling as needed
    },
    recipeTitle: {
        marginTop: 30,
        fontSize: 18,
        fontWeight: 'bold',
        // Other text styling as needed
    },
});

export default ReportedBizRecipeDetails;