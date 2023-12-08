import React, { useState, useEffect, useContext } from "react";
import { View, SafeAreaView, StyleSheet, Text } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Context } from "../../store/context";
import { useFocusEffect } from '@react-navigation/native';


const SummaryDailyScreen = ({ route }) => {
    const { user } = route.params; // Retrieve the user data passed from the previous screen
    const [currentUser, setCurrentUser] = useContext(Context);
    const [dailyCalories, setDailyCalories] = useState([]);
    const [userData, setUserData] = useState(user);
    
    const currentUserData = userData.find(user => user._id === currentUser._id);
    console.log("1.=============== userData: " + currentUserData.username + " " + " CaloriesLog: " + currentUserData.dailyCaloriesLog[currentUserData.dailyCaloriesLog.length - 1].total_calories);
    
    //current user's calorie goal and daily calorie log
    const targetCalories = currentUserData.calorie;
    const CaloriesLog = currentUserData.dailyCaloriesLog;
    console.log("2.-------------- userData: " + currentUserData.username + " " + " CaloriesLog: " + CaloriesLog[CaloriesLog.length - 1].total_calories);

    //console.log(currentUser.dailyCaloriesLog.length + " " + CaloriesLog.length);  

    // Get the latest data entry
    const latestDataEntry = CaloriesLog.length > 0 ? CaloriesLog[CaloriesLog.length - 1] : null;

    // Get total calories from the latest data entry
    const latestTotalCalories = latestDataEntry ? latestDataEntry.total_calories : 0;
    console.log("3.************** userData: " + currentUserData.username + "  latestTotalCalories: " + latestTotalCalories);

    //calories left to consume
    const caloriesLeft = targetCalories - latestTotalCalories;
    //calories more to consume
    const caloriesMore = latestTotalCalories - targetCalories;

    const roundedCaloriesLeft = caloriesLeft.toFixed(2);

    const roundedCaloriesMore = caloriesMore.toFixed(2);
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
                            {exceededTarget ? `${roundedCaloriesMore} Cal more` : `${roundedCaloriesLeft} Cal less`}
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



/*
useFocusEffect(
        React.useCallback(() => {
            const fetchUserData = async () => {
                try {
                const userId = userData._id; 
                const response = await fetch(
                    `${process.env.EXPO_PUBLIC_IP}/user/getUserById/${userId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
        
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data); // Update the userData with the fetched data
                } else {
                    console.error("Failed to fetch user data");
                    // Handle errors as appropriate
                }
                } catch (error) {
                console.error("Error fetching user data:", error);
                // Handle errors as appropriate
                }
            };
        
            fetchUserData();
        }, [])
    );
    console.log("userData: " + userData);




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