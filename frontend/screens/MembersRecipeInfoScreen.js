import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, SafeAreaView, TextInput, TouchableOpacity, Button } from "react-native";
import React, { useState, useEffect } from "react";

export default function MembersRecipeInfoScreen({ route }) {
    const { recipeData } = route.params;
  
    return (
        <View style={styles.container}>
            <Image source={{ uri: recipeData.image }} style={styles.image} />
            <Text style={styles.text}>Name: {recipeData.name}</Text>
            <Text>
                Ingredients:{" "}
                {recipeData.ingredients.map((ingredient, index) => (
                    <Text key={index}>{ingredient}, </Text>))
                }
            </Text>
            <Text>Instructions: </Text>
            <Text>{recipeData.instructions}</Text>
            <Text>Calories: </Text>
            <Text>{recipeData.calories}</Text>
            <StatusBar style="auto" />
        </View>
    );
}
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
    },
    //style for the header
    header: {
        flex: 1,
        justifyContent: "flex-end",
        paddingHorizontal: 20,
        paddingBottom: 50,
    },
    //style for the image
    image: {
        flex: 1,
        width: 400,
        height: 400,
        resizeMode: "contain",
    },
    text: {
        color: "gold",
        fontSize: 30,
        fontWeight: "bold",
    },
});