import React, { useState, useEffect, useContext } from "react";
import { View, Dimensions, StyleSheet, Text } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Context } from "../../store/context";
import { useFocusEffect } from '@react-navigation/native';

const SummaryWeeklyScreen = ({ route }) => {
    const { user } = route.params; // Retrieve the user data passed from the previous screen
    const [currentUser, setCurrentUser] = useContext(Context);
    const [weeklyCalories, setWeeklyCalories] = useState([]);
    const [userData, setUserData] = useState(user);
    const currentUserData = userData.find(user => user._id === currentUser._id);

    const targetCalories = currentUserData.calorie;
    //const targetCalories = currentUser.calorie * 7;
    const CaloriesLog = currentUserData.dailyCaloriesLog;
    console.log("1.=====weekly===== userData: " + currentUserData.username + "  CurrentUser's targetCalories: " + CaloriesLog[CaloriesLog.length - 1].total_calories);
        

    useEffect(() => {
        //calculate weekly total calories and set the state
        const weeklyData = calculateWeeklyData(CaloriesLog, targetCalories);
        setWeeklyCalories(weeklyData);
    }, [CaloriesLog, targetCalories]);

    //week Number of the year
    const getWeekNumber = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);             // Set to 12 midnight  
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));             //  Set to nearest Thursday: current date + 4 - current day number, make Sunday's day number 7
        const yearStart = new Date(d.getFullYear(), 0, 1);          // start of current year
        const weekNumber = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        console.log("weekNumber: " + weekNumber);
        return weekNumber;
    };

    //calculate weekly total calories and set the state
    const calculateWeeklyData = (dailyCaloriesLog, dailyTargetCalories) => {
        const weeklyData = [];
        let currentWeek = null;
        let weeklyTotal = 0;
    
        //iterate through daily calories log
        for (const entry of dailyCaloriesLog) {
            const entryDate = new Date(entry.date);
            const entryWeek = getWeekNumber(entryDate);
        
            // Check if a new week starts
            if (currentWeek !== entryWeek) {
                //save weekly data for the previous week
                if (currentWeek !== null) {
                    weeklyData.push({
                        week: currentWeek,
                        totalCalories: weeklyTotal,
                        exceededTarget: weeklyTotal > dailyTargetCalories * 7, //compare weekly total with weekly target
                    });
                }
        
                //get for the new week
                currentWeek = entryWeek;
                weeklyTotal = 0;
            }
        
            //add daily calories for the current week
            weeklyTotal += entry.total_calories;
        }
    
        // Save the last week
        if (currentWeek !== null) {
            weeklyData.push({
                week: currentWeek,
                totalCalories: weeklyTotal,
                exceededTarget: weeklyTotal > dailyTargetCalories * 7,
            });
        }
    
        return weeklyData;
    };

    const chartData = {
        labels: weeklyCalories.map((week) => `Week ${week.week}`),
        datasets: [
            {
                data: weeklyCalories.map((week) => week.totalCalories),
                color: (opacity = 1) => (week.exceededTarget ? `rgba(255, 0, 0, ${opacity})` : `rgba(134, 65, 244, ${opacity})`),
            },
        ],
    };
    
    const chartConfig = {
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        color: (opacity = 1) => `rgba(0, 224, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },
    };
    
            


    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.chartTextBold}>Weekly Intake</Text>
            </View>
            <BarChart
                data={chartData}
                width={Dimensions.get("window").width - 16}
                height={220}
                yAxisSuffix=" Cal"
                chartConfig={chartConfig}
                verticalLabelRotation={0}
            />
            <Text style={styles.text}>Weekly's total Calories intake:   </Text>
            <View style={styles.componentContainer}>
                <View style={styles.leftComponent}>
                    <Text style={styles.text}>Weekly intake: </Text>
                    <Text style={styles.subText}></Text>
                </View>
                <View style={styles.rightComponent}>
                    <Text style={styles.text}>Target Calories:</Text>
                    <Text style={styles.subText}>{targetCalories} Cal</Text>
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

/*

const getWeekNumber = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);             // Set to 12 midnight  
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));             //  Set to nearest Thursday: current date + 4 - current day number, make Sunday's day number 7
        const yearStart = new Date(d.getFullYear(), 0, 1);          // start of current year
        const weekNumber = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        console.log("weekNumber: " + weekNumber);
        return weekNumber;
    };
    
    //aggregate daily data into weekly totals
    const weeklyData = CaloriesLog.reduce((acc, entry) => {
        const date = new Date(entry.date);
        const weekNumber = getWeekNumber(date);
    
        //init the weekly total if not exists
        if (!acc[weekNumber]) {
            acc[weekNumber] = 0;
        }

        acc[weekNumber] += entry.total_calories;
    
        return acc;
    }, {});
    
    const chartData = {
        labels: Object.keys(weeklyData).map((week) => `Week ${week}`),
        datasets: [
            {
                data: Object.values(weeklyData),
            },
        ],
    };


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

    const weeklyChartData = {
        labels: weeklyData.map((entry) => entry.day), // Assuming you have a "day" property in your weekly data
        datasets: [
            {
                data: weeklyData.map((entry) => entry.consumed),
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                label: "Consumed",
            },
            {
                data: weeklyData.map((entry) => entry.target),
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                label: "Target",
            },
        ],
    };
*/