import React, { useState, useEffect, useContext } from "react";
import { View, Dimensions, StyleSheet, Text } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Context } from "../../store/context";

const SummaryWeeklyScreen = () => {
    const [currentUser, setCurrentUser] = useContext(Context);
    const [weeklyCalories, setWeeklyCalories] = useState([]);

    const targetCalories = currentUser.calorie * 7;
    const CaloriesLog = currentUser.dailyCaloriesLog;

    useEffect(() => {
        // Calculate total calories for the past week
        const today = new Date();
        const pastWeek = new Date(today);
        pastWeek.setDate(today.getDate() - 7); // Subtract 7 days for the past week
    
        const weeklyCalories = CaloriesLog.reduce((total, entry) => {
          const entryDate = new Date(entry.date); 
          if (entryDate >= pastWeek && entryDate <= today) {
            total += entry.total_calories;
          }
          return total;
        }, 0);
    
        setWeeklyCalories(weeklyCalories);
    }, [CaloriesLog]);

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.chartTextBold}>Weekly Intake</Text>
            </View>
            <Text style={styles.text}>Weekly's total Calories intake: ahahahahaha</Text>
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

export default SummaryWeeklyScreen;

const styles = StyleSheet.create({
    //containers
    container: {
        flex: 1,
        backgroundColor: "#FCFCD3",
        alignItems: "center",
    },
    textContainer: {    
        marginTop: 10,
        marginBottom: 10,
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
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    subText: {
        fontSize: 16,
        textAlign: "center",
    },
    chartText: {
        fontSize: 16,
        textAlign: "center",
    },
    chartTextBold: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
});