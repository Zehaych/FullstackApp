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
            <View style={styles.detailBox}>
                <View style={styles.componentContainer}>
                    <View style={styles.leftComponent1}>
                        <Text style={styles.title}>No. </Text>
                    </View>
                    <View style={styles.rightComponent1}>
                        <Text style={styles.title}>Reported Recipes</Text>
                    </View>
                </View>
                <FlatList
                    data={reportedRecipes}
                    keyExtractor={item => item._id}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity 
                            onPress={() => handleRecipePress(item)}
                        >
                            <View style={styles.componentContainer}>
                                <View style={styles.leftComponent}>
                                    <Text style={styles.numbering}>{index + 1}</Text>
                                </View>
                                <View style={styles.rightComponent}>
                                    <Text style={styles.subTitle}>{item.name}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    title: {
        marginTop: 10,
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    componentContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    leftComponent: {
        flex: 0.5,
        paddingLeft: 10,
        marginBottom:10,
    },
    rightComponent: {
        flex: 1,
        marginBottom:10,
    },
    leftComponent1: {
        flex: 0.5,
    },
    rightComponent1: {
        flex: 1,
    },
    subTitle: {
        fontSize: 16,
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
    numbering: {
        fontWeight: "bold",
        fontSize: 16,
        marginRight: 10,
    },
});


export default ReportedBizRecipe;