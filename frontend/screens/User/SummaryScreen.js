import React, { useState, useEffect, useContext } from "react";
import { View, SafeAreaView, StyleSheet, Text } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Context } from "../../store/context";


const SummaryScreen = () => {
    const [currentUser, setCurrentUser] = useContext(Context);
    const [dailyCalories, setDailyCalories] = useState([]);

    //current user's calorie goal and daily calorie log
    const targetCalories = currentUser.calorie;
    const CaloriesLog = currentUser.dailyCaloriesLog;

    //console.log(currentUser.dailyCaloriesLog.length + " " + CaloriesLog.length);  

    // Get the latest data entry
    const latestDataEntry = CaloriesLog.length > 0 ? CaloriesLog[CaloriesLog.length - 1] : null;

    // Get total calories from the latest data entry
    const latestTotalCalories = latestDataEntry ? latestDataEntry.total_calories : 0;
    console.log("latestTotalCalories: " + latestTotalCalories);

    //calories left to consume
    const caloriesLeft = targetCalories - latestTotalCalories;
    //percentage of calories consumed
    const percentage = (latestTotalCalories / targetCalories) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.chartContainer}>
                <AnimatedCircularProgress
                    size={200}
                    width={15}
                    fill={percentage}
                    tintColor="#00e0ff"
                    backgroundColor="#3d5875"
                    rotation={0}
                    lineCap="round"
                >
                    {(fill) => (
                    <View>
                        <Text style={styles.chartTextBold}>
                        {latestTotalCalories} / {targetCalories} Cal consumed
                        </Text>
                        <Text style={styles.chartText}>{caloriesLeft} Cal left</Text>
                    </View>
                    )}
                </AnimatedCircularProgress>
                <View style={styles.textContainer}>
                    <Text style={styles.chartTextBold}>Daily Intake</Text>
                </View>
            </View>
            <Text style={styles.text}>Target Calories: {targetCalories}</Text>
            <Text style={styles.text}>Today's total Calories intake: {latestTotalCalories}</Text>
        </View>
    );
};

export default SummaryScreen;

const styles = StyleSheet.create({
    //containers
    container: {
        flex: 1,
        backgroundColor: "#FCFCD3",
        alignItems: "center",
    },
    chartContainer: {
        marginTop: 50,
        marginBottom: 50,
    },
    textContainer: {    
        marginTop: 10,
        marginBottom: 10,
    },
    //text
    chartTextBold: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },

    chartText: {
        fontSize: 18,
        textAlign: "center",
    },

    text: {
        fontSize: 20,
        fontWeight: "bold",
    },
});



/*

<AnimatedCircularProgress
                size={200}
                width={15}
                fill={percentage}
                tintColor="#00e0ff"
                backgroundColor="#3d5875"
                rotation={0}
                lineCap="round"
            >
                {(fill) => (
                <View>
                    <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                    {dailyCalories} / {targetCalories} Calories
                    </Text>
                    <Text style={{ fontSize: 16 }}>Daily Intake</Text>
                </View>
                )}
            </AnimatedCircularProgress>


            //today's date
    const currentDate = new Date();

    const dailyCaloriesLogEntries = currentUser.dailyCaloriesLog.map((entry) => (
        <View key={entry._id}>
            <Text>Date: {new Date(entry.date).toDateString()}</Text>
            <Text>Total Calories: {entry.total_calories}</Text>
        </View>
    ));       //test

    console.log("currentDate: " + currentDate + " " + typeof  currentDate + " " + currentDate.toDateString());
    console.log("dailyCaloriesLog: " + currentUser.dailyCaloriesLog);

    //current user's calorie daily intake for the day
    const currentDayEntry = currentUser.dailyCaloriesLog.findLast((entry) => {
        const entryDate = new Date(entry.date);
        return (
          entryDate.getFullYear() === currentDate.getFullYear() &&
          entryDate.getMonth() === currentDate.getMonth() &&
          entryDate.getDate() === currentDate.getDate()-1
        );
    });

    const dailyCalories = currentDayEntry ? currentDayEntry.total_calories : 0;

    //percentage of calories consumed
    const percentage = (dailyCalories / targetCalories) * 100;
*/