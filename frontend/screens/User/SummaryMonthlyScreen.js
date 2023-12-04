import React, { useState, useEffect, useContext } from "react";
import { View, SafeAreaView, StyleSheet, Text } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Context } from "../../store/context";
import { Colors } from "react-native/Libraries/NewAppScreen";

const SummaryMonthlyScreen = () => {
    const [currentUser, setCurrentUser] = useContext(Context);
    const [monthlyCalories, setMonthlyCalories] = useState([]);

    const targetCalories = currentUser.calorie * 7;
    const CaloriesLog = currentUser.dailyCaloriesLog;
    
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Monthly's total Calories intake: ahahahahaha</Text>
            <View style={styles.componentContainer}>
            <View style={styles.leftComponent}>
                    <Text style={styles.text}>Daily intake: </Text>
                    <Text style={styles.subText}>hahahahhaha</Text>
                </View>
                <View style={styles.rightComponent}>
                    <Text style={styles.text}>Target Calories:</Text>
                    <Text style={styles.subText}>{targetCalories}</Text>
                </View>
            </View>
        </View>
    );
};

export default SummaryMonthlyScreen;

const styles = StyleSheet.create({
    //containers
    container: {
        flex: 1,
        backgroundColor: "#FCFCD3",
        alignItems: "center",
    },
    componentContainer: {
        flexDirection: "row", // Arrange components horizontally from left to right
        justifyContent: "space-between", // Space them evenly
        alignItems: "center", // Center them vertically
        paddingTop: 5,
        paddingBottom: 5,
        margin: 5,
    },
    leftComponent: {
        flex: 1, // Takes up 1/3 of the available space
        paddingTop: 10,
        paddingBottom: 10,
    },
    middleComponent: {
        flex: 1, // Takes up 1/3 of the available space
        paddingTop: 10,
        paddingBottom: 10,
    },
    rightComponent: {
        flex: 1, // Takes up 1/3 of the available space
        paddingTop: 10,
        paddingBottom: 10,
    },
    //text
    text: {
        fontSize: 20,
        fontWeight: "bold",
    },
});