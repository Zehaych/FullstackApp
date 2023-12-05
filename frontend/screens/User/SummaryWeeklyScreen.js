import React, { useState, useEffect, useContext } from "react";
import { View, Dimensions, StyleSheet, Text } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Context } from "../../store/context";

const SummaryWeeklyScreen = () => {
    const [currentUser, setCurrentUser] = useContext(Context);
    const [weeklyCalories, setWeeklyCalories] = useState([]);

    const targetCalories = currentUser.calorie * 7;
    const CaloriesLog = currentUser.dailyCaloriesLog;

    const getWeekNumber = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const yearStart = new Date(d.getFullYear(), 0, 1);
        const weekNumber = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
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
    
    

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.chartTextBold}>Weekly Intake</Text>
            </View>
            <BarChart
                data={chartData}
                width={Dimensions.get("window").width - 16}
                height={220}
                yAxisSuffix="k"
                chartConfig={{
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    color: (opacity = 1) => `rgba(0, 224, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                }}
                verticalLabelRotation={15}
            />
            <Text style={styles.text}>Weekly's total Calories intake: ahahahahaha</Text>
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