import React, { useState, useEffect, useContext } from "react";
import { View, SafeAreaView, StyleSheet, Text, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Context } from "../../store/context";

const SummaryMonthlyScreen = () => {
    const [currentUser, setCurrentUser] = useContext(Context);
    const [monthlyCalories, setMonthlyCalories] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);

    const averageTargetCalories = (currentUser.calorie * 365)/12;        //use day in month with the month from calender?
    const CaloriesLog = currentUser.dailyCaloriesLog;

    const dailyCaloriesLogEntries = currentUser.dailyCaloriesLog.map((entry) => (
        <View key={entry._id}>
            <Text>Date: {new Date(entry.date).toDateString()}</Text>
            <Text>Total Calories: {entry.total_calories}</Text>
        </View>
    ));     //test
    console.log("dailyCaloriesLog: " + currentUser.dailyCaloriesLog[4].date);
    
    useEffect(() => {
        const today = new Date();
        const monthsToDisplay = 6; // Adjust as needed
    
        const data = [];
        for (let i = monthsToDisplay - 1; i >= 0; i--) {
            const monthStartDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthEndDate = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
        
            const monthlyCalories = CaloriesLog.reduce((total, entry) => {
                const entryDate = new Date(entry.date);
                if (entryDate >= monthStartDate && entryDate <= monthEndDate) {
                    total += entry.total_calories;
                    console.log("total: " + total);
                }
                return total;
            }, 0);
        
            const daysInMonth = monthEndDate.getDate();
            const targetCaloriesForMonth = currentUser.calorie * daysInMonth;
        
            data.push({
                month: monthStartDate.toLocaleString('default', { month: 'long' }), // Month name
                consumed: monthlyCalories,
                target: targetCaloriesForMonth,
            });
        }
    
        setMonthlyData(data);
    }, [CaloriesLog]);
    
    const chartData = {
        labels: monthlyData.map((entry) => entry.month),
        datasets: [
            {
                data: monthlyData.map((entry) => entry.consumed),
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                label: "Consumed",
            },
            {
                data: monthlyData.map((entry) => entry.target),
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                label: "Target",
            },
            ],
    };
    
    return (
        <View style={styles.container}>
            {/*<Text>{dailyCaloriesLogEntries}</Text>*/}
            <BarChart
                data={chartData}
                width={Dimensions.get("window").width - 16}
                height={220}
                yAxisSuffix=" Cal"
                chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                color: (opacity = 1) => `rgba(0, 224, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                    borderRadius: 16,
                },
                }}
            />
            <Text style={styles.text}>Monthly Intake</Text>
            <View style={styles.componentContainer}>
                <View style={styles.leftComponent}>
                    <Text style={styles.text}>(AVG)Monthly intake: </Text>
                    <Text style={styles.subText}>hahahahhaha</Text>
                </View>
                <View style={styles.rightComponent}>
                    <Text style={styles.text}>(AVG)Target Calories:</Text>
                    <Text style={styles.subText}>{averageTargetCalories} kCal</Text>
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
        textAlign: "center",
    },
    subText: {
        fontSize: 16,
        textAlign: "center",
    },
});


/*
useEffect(() => {
        // Calculate total calories for each day in the past month
        const today = new Date();
        const pastMonth = new Date(today);
        pastMonth.setMonth(today.getMonth() - 1); // Subtract 1 month for the past month
    
        const monthlyCaloriesData = [];
        for (let i = pastMonth.getDate(); i <= today.getDate(); i++) {
          const currentDate = new Date(pastMonth);
          currentDate.setDate(i);
    
          const dailyCalories = CaloriesLog.reduce((total, entry) => {
            const entryDate = new Date(entry.date); // Assuming date is a string
            if (entryDate.toDateString() === currentDate.toDateString()) {
              total += entry.total_calories;
            }
            return total;
          }, 0);
    
          monthlyCaloriesData.push(dailyCalories);
        }
    
        setMonthlyCalories(monthlyCaloriesData);
    }, [CaloriesLog]);
    
    //chart config
    const data = {
        labels: ["Consumed", "Target"],
        datasets: [
          {
            data: [monthlyCalories, targetCalories],
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Adjust the color
          },
        ],
    };
    
    return (
        <View>
            <Text>Monthly Intake</Text>
            <BarChart
                data={data}
                width={Dimensions.get("window").width - 16}
                height={220}
                chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                color: (opacity = 1) => `rgba(0, 224, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                    borderRadius: 16,
                },
                }}
            />
            <View style={styles.componentContainer}>
                <View style={styles.leftComponent}>
                    <Text style={styles.text}>(AVG)Monthly intake: </Text>
                    <Text style={styles.subText}>hahahahhaha</Text>
                </View>
                <View style={styles.rightComponent}>
                    <Text style={styles.text}>(AVG)Target Calories:</Text>
                    <Text style={styles.subText}>{averageTargetCalories} kCal</Text>
                </View>
            </View>
        </View>
    );
};
*/