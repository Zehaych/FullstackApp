import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Context } from "../../store/context";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';

const ReportedBizRecipe = () => {
    const [reportedRecipes, setReportedRecipes] = useState([]);
    const navigation = useNavigation();
    const [currentUser, setCurrentUser] = useContext(Context);

    // useEffect(() => {
    //     fetchReportedRecipes();
    // }, []);

    // const fetchReportedRecipes = async () => {
    //     try {
    //         const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/bizrecipe/getReportedBizRecipe`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });

    //         if (response.ok) {
    //             const data = await response.json();
    //             setReportedRecipes(data);
    //         } else {
    //             Alert.alert('Error', 'Failed to fetch reported recipes.');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching reported recipes:', error);
    //         Alert.alert('Error', 'An error occurred while fetching reported recipes.');
    //     }
    // };

    useFocusEffect(
        React.useCallback(()=> {
        const fetchReportedRecipes = async () => {
            try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/bizrecipe/getReportedBizRecipe`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setReportedRecipes(data);
                } else {
                    Alert.alert('Error', 'Failed to fetch reported recipes.');
                }
            } catch (error) {
                console.error('Error fetching reported recipes:', error);
                Alert.alert('Error', 'An error occurred while fetching reported recipes.');
            }
        };
        fetchReportedRecipes();
        } 
        ,[]));
    
    const handleRecipePress = (recipe) => {
        navigation.navigate('ReportedBizRecipeDetails', { recipe });
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>{currentUser.username}</Text>
        <Text style={styles.subtitle}>Reported Business Partner Recipes</Text>
        <FlatList
                data={reportedRecipes}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.recipeItem} 
                        onPress={() => handleRecipePress(item)}
                    >
                        <Text style={styles.recipeTitle}>{item.name}</Text>
                    </TouchableOpacity>
                )}
        />
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        marginTop: 30,
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: "#333", 
        textAlign: "center",
    },
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5', // Adjust background color as needed
    },
    recipeItem: {
        backgroundColor: 'white',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 5,
    },
    recipeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});


export default ReportedBizRecipe;