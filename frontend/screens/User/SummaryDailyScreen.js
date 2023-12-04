import React, { useState, useEffect, useContext } from "react";
import { View, SafeAreaView, StyleSheet, Text } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Context } from "../../store/context";


const SummaryDailyScreen = () => {
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
    //calories more to consume
    const caloriesMore = latestTotalCalories - targetCalories;
    //percentage of calories consumed
    const percentage = (latestTotalCalories / targetCalories) * 100;

    // Determine if calories exceeded the target
    const exceededTarget = latestTotalCalories > targetCalories;
    const tintColor = exceededTarget ? "#ff0000" : "#55dfe6";

    return (
        <View style={styles.container}>
                <View style={styles.textContainer}>
                    <Text style={styles.chartTextBold}>Daily Intake</Text>
                </View>
            <View style={styles.chartContainer}>
                <AnimatedCircularProgress
                    size={250}
                    width={15}
                    fill={percentage}
                    tintColor={tintColor}
                    backgroundColor="#e1e2e3"
                    rotation={0}
                    lineCap="round"
                >
                    {(fill) => (
                    <View>
                        <Text style={styles.chartTextBold}>
                        {latestTotalCalories} / {targetCalories} Cal consumed
                        </Text>
                        <Text style={styles.chartText}>
                            {exceededTarget ? `${caloriesMore} Cal more` : `${caloriesLeft} Cal left`}
                        </Text>
                    </View>
                    )}
                </AnimatedCircularProgress>
            </View>
            <View style={styles.componentContainer}>
                <View style={styles.leftComponent}>
                    <Text style={styles.text}>Daily intake: </Text>
                    <Text style={styles.subText}>{latestTotalCalories}</Text>
                </View>
                <View style={styles.rightComponent}>
                    <Text style={styles.text}>Target Calories:</Text>
                    <Text style={styles.subText}>{targetCalories}</Text>
                </View>
            </View>
        </View>
    );
};

export default SummaryDailyScreen;

const styles = StyleSheet.create({
    //containers
    container: {
        flex: 1,
        backgroundColor: "#FCFCD3",
        alignItems: "center",
    },
    chartContainer: {
        marginTop: 25,
        marginBottom: 25,
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
    chartTextBold: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    chartText: {
        fontSize: 16,
        textAlign: "center",
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    subText: {
        fontSize: 16,
        textAlign: "center",
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