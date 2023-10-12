import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, SafeAreaView, TextInput, TouchableOpacity, Button } from "react-native";
import React, { useState, useEffect } from "react";

export default function MembersRecipeInfoScreen({ route }) {
    const { recipeData } = route.params;
  
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Recipe Info</Text>
            <Text>Name: {recipeData.name}</Text>
            <Text>
                Ingredients:{" "}
                {recipeData.ingredients.map((ingredient, index) => (
                    <Text key={index}>{ingredient}, </Text>))
                }
            </Text>
            <Text>Instructions: {recipeData.instructions}</Text>
            <Text>Calories: {recipeData.calories}</Text>
            <StatusBar style="auto" />
        </View>
    );
}
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    //style for the header
    header: {
        flex: 1,
        justifyContent: "flex-end",
        paddingHorizontal: 20,
        paddingBottom: 50,
    },
});