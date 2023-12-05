import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Context } from "../../store/context";
import { useNavigation } from "@react-navigation/native";


const ReportedBizRecipeDetails = ({ route }) => {
    const { recipe } = route.params;
    const navigation = useNavigation();
    const [currentUser, setCurrentUser] = useContext(Context);

    return (
        <View style={styles.container}>
            <Text style={styles.recipeTitle}>Reported Recipe: {recipe.name}</Text>
            <View style={styles.reportsContainer}>
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
    );
};

const styles = StyleSheet.create({
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
    // ... other styles ...
});

export default ReportedBizRecipeDetails;