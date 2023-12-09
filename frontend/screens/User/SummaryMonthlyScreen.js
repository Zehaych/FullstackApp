import React, { useState, useEffect, useContext } from "react";
import { View, ScrollView, StyleSheet, Text, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Context } from "../../store/context";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const SummaryMonthlyScreen = ({route}) => {
    const { user } = route.params; // Retrieve the user data passed from the previous screen
    const [currentUser, setCurrentUser] = useContext(Context);
    //const [monthlyCalories, setMonthlyCalories] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [monthlyDataProgress, setMonthlyDataProgress] = useState([]);
    const [userData, setUserData] = useState(user);

    const currentUserData = userData.find(user => user._id === currentUser._id);

    const averageTargetCalories = (currentUserData.calorie * 365)/12;        //use day in month with the month from calender?
    const CaloriesLog = currentUserData.dailyCaloriesLog;
    console.log("1.=====monthly===== userData: " + currentUserData.username + "  CurrentUser's targetCalories: " + CaloriesLog[CaloriesLog.length - 1].total_calories);

    const dailyCaloriesLogEntries = currentUserData.dailyCaloriesLog.map((entry) => (
        <View key={entry._id}>
            <Text>Date: {new Date(entry.date).toDateString()}</Text>
            <Text>Total Calories: {entry.total_calories}</Text>
        </View>
    ));     //test
    console.log("dailyCaloriesLog: " + currentUserData.dailyCaloriesLog[4].date);
    
    useEffect(() => {
        const today = new Date();
        const monthsToDisplay = 6; // Adjust this to change how many months to display
    
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
            const targetCaloriesForMonth = currentUserData.calorie * daysInMonth;
            const progress = (monthlyCalories / targetCaloriesForMonth) * 100;

            data.push({
                month: monthStartDate.toLocaleString('default', { month: 'short' }), // Month name
                consumed: monthlyCalories,
                target: targetCaloriesForMonth,
                progress: progress,
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

    //sort decending
    // const sortedMonthlyData = [...monthlyData].sort((a, b) => {
    //     return new Date(b.month + " 1, 2000") - new Date(a.month + " 1, 2000");
    // });  

    const monthNumbers = {
        Jan: 1,
        Feb: 2,
        Mar: 3,
        Apr: 4,
        May: 5,
        Jun: 6,
        Jul: 7,
        Aug: 8,
        Sep: 9,
        Oct: 10,
        Nov: 11,
        Dec: 12
    };

    const monthlyDataSorted = [...monthlyData];
    
    monthlyDataSorted.sort((a, b) => {
        if (monthNumbers[a.month] > monthNumbers[b.month]) {
            return -1;
        }
        if (monthNumbers[a.month] < monthNumbers[b.month]) {
            return 1;
        }
        return 0;
    });

    const chartConfig = {
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        color: (opacity = 1) => `rgba(0, 224, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },
    };
    
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.chartTextBold}>Monthly Intake</Text>
            </View>
            {/*<Text>{dailyCaloriesLogEntries}</Text>*/}
            <BarChart
                data={chartData}
                width={Dimensions.get("window").width - 16}
                height={220}
                yAxisSuffix=" Cal"
                chartConfig={chartConfig}
                verticalLabelRotation={0}
            />
            <View style={styles.componentContainer}>
                <View style={styles.leftComponent}>
                    <Text style={styles.text}>(AVG)Latest Month: </Text>
                    <Text style={styles.subText}></Text>
                </View>
                <View style={styles.rightComponent}>
                    <Text style={styles.text}>(AVG)Target Calories:</Text>
                    <Text style={styles.subText}>{Math.round(averageTargetCalories)} Cal</Text>
                </View>
            </View>
            <ScrollView style={styles.chartContainer}>
                {monthlyDataSorted.map((month) => (
                    <View key={month.month}>
                        <Text style={styles.chartTextBold}>
                            Monthly Intake - {month.month}
                        </Text>
                        <View style={styles.chartContainerToo}>
                            <AnimatedCircularProgress
                            size={200}
                            width={15}
                            fill={month.progress}
                            tintColor="#00e0ff"
                            backgroundColor="#3d5875"
                            >
                            {(fill) => (
                                <View>
                                <Text style={styles.chartTextBold}>
                                    {Math.round(month.consumed)} / {Math.round(month.target)} Cal consumed
                                </Text>
                                <Text style={styles.chartText}>
                                    {month.consumed > month.target ? `${Math.round(month.consumed - month.target)} Cal more`  : `${Math.round(month.target - month.consumed)} Cal less` }
                                </Text>
                                </View>
                            )}
                            </AnimatedCircularProgress>
                        </View>
                    </View>
                ))}
            </ScrollView>
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
    textContainer: {    
        marginTop: 10,
        marginBottom: 10,
    },
    chartContainer: {
        marginTop: 25,
        marginBottom: 25,
        margin: 5,
    },
    chartContainerToo: {
        flex: 1,
        marginTop: 10,
        marginBottom: 10,
        margin: 5,
        alignItems: "center",
        alignContent: "center",
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