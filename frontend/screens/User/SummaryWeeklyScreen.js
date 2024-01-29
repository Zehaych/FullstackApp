import React, { useContext, useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import * as Progress from "react-native-progress";
import { Context } from "../../store/context";
//import { calculateWeeklyDataUtil } from './utils';

const SummaryWeeklyScreen = ({ route }) => {
    const { user } = route.params; // Retrieve the user data passed from the previous screen
    const [currentUser, setCurrentUser] = useContext(Context);
    const [weeklyCalories, setWeeklyCalories] = useState([]);
    const [userData, setUserData] = useState(user);
    const currentUserData = userData.find(user => user._id === currentUser._id);
    const [weeklyData, setWeeklyData] = useState([]);

    const targetCalories = currentUserData.calorie;
    //const targetCalories = currentUser.calorie * 7;
    const CaloriesLog = currentUserData.dailyCaloriesLog;
    console.log("1.=====weekly===== userData: " + currentUserData.username + "  CurrentUser's targetCalories: " + CaloriesLog[CaloriesLog.length - 1].total_calories);


    useEffect(() => {
        //calculate weekly total calories and set the state
        const calWeeklyData = calculateWeeklyData(CaloriesLog, targetCalories);
        setWeeklyCalories(calWeeklyData);
        setWeeklyData(calWeeklyData);
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
        let weeklyDays = [];

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
                        dailyCalories: weeklyDays, // Save daily details for the week
                        exceededTarget: weeklyTotal > dailyTargetCalories * 7, //compare weekly total with weekly target
                    });
                }

                //get for the new week
                currentWeek = entryWeek;
                weeklyTotal = 0;
                weeklyDays = [];
            }

            //add daily calories for the current week
            weeklyTotal += entry.total_calories;
            weeklyDays.push({
                day: entryDate.getDay(), // Assuming you want to track the day as well
                total_calories: entry.total_calories,
            });
        }

        // Save the last week
        if (currentWeek !== null) {
            weeklyData.push({
                week: currentWeek,
                totalCalories: weeklyTotal,
                dailyCalories: weeklyDays,
                exceededTarget: weeklyTotal > dailyTargetCalories * 7,
            });
        }

        return weeklyData;
    };

    const chartData = {
        labels: weeklyCalories.map((week) => ` ${week.week}`),
        // labels: weeklyCalories.map((week) => `week ${week.week}`),
        datasets: [
            {
                data: weeklyCalories.map((week) => Math.round(week.totalCalories)),
                color: (opacity = 1) => (week.exceededTarget ? `rgba(255, 0, 0, ${opacity})` : `rgba(134, 65, 244, ${opacity})`),
            },
        ],
    };

    const chartConfig = {
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        // style: {
        //     borderRadius: 16,
        // },
    };

    const weeklyTargetCalories = targetCalories * 7;
    const roundTargetCalories = Math.round(weeklyTargetCalories);

    const weeklyDataSorted = [...weeklyData].sort((a, b) => b.week - a.week);

    return (
        <ScrollView style={styles.chartContainer}>
            <View style={styles.introSection}>
                <View style={styles.componentContainer}>
                    <Text style={styles.subTitle}>Weekly Intake</Text>
                    <ScrollView horizontal={true}>
                    <BarChart
                        data={chartData}
                        width={Dimensions.get("window").width - 16}
                        height={220}
                        yAxisSuffix="cal"
                        chartConfig={chartConfig}
                        verticalLabelRotation={0}
                    />
                    </ScrollView>
                </View>
                <View style={styles.componentContainer}>
                    <Text style={styles.subTitle}>Total Calories Intake </Text>
                    {weeklyDataSorted.map((week) => (
                        <View key={week.week}>
                            <Text style={[styles.normalText, styles.bold]}> Week {week.week}</Text>
                            <View style={styles.flexColumnComponent}>
                                <Progress.Bar
                                    progress={week.totalCalories / roundTargetCalories} // Progress based on the ratio
                                    width={330}
                                    height={15}
                                    color="#FF9130"
                                    unfilledColor="#FFEBCC"
                                    borderWidth={0}
                                />
                                <View style={styles.flexRowComponent}>
                                    <Text style={[styles.normalText]}>
                                        {Math.round(week.totalCalories)} / {roundTargetCalories} cal consumed
                                    </Text>
                                    <Text style={[styles.normalText]}>
                                        {week.totalCalories > roundTargetCalories
                                            ? `${Math.round(week.totalCalories - roundTargetCalories)} cal more`
                                            : `${Math.round(roundTargetCalories - week.totalCalories)} cal less`}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>

    );
};

export default SummaryWeeklyScreen;

const styles = StyleSheet.create({
    //containers
    introSection: {
        padding: 12,
        borderBottomColor: "#ccc",
    },
    // component
    componentContainer: {
        display: "flex",
        width: "100%",
        padding: 16,
        backgroundColor: "#FFF",
        borderRadius: 20,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    flexRowComponent: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        flexDirection: "row",
        marginBottom: 10
    },
    flexColumnComponent: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "left",
        width: "100%",
        flexDirection: "column",
        margin: 4,
        marginBottom: 10
    },
    leftComponent: {
        flex: 1, // Takes up 1/3 of the available space
    },
    middleComponent: {
        flex: 1, // Takes up 1/3 of the available space
        alignItems: "center"
    },
    rightComponent: {
        flex: 1, // Takes up 1/3 of the available space
        alignItems: "center"
    },
    //text
    subTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FF9130",
        marginBottom: 10
    },
    normalText: {
        fontSize: 14,
        margin: 1,
        // textAlign: "center",
    },
    orangeText: {
        color: "#FF9130"
    },
    bold: {
        fontWeight: "bold"
    },
});

/*
// ======================================================================================================================================================

<ScrollView style={styles.chartContainer}>
                {weeklyDataSorted.map((week) => (
                    <View key={week.week}>
                        <Text style={styles.chartTextBold}>Weekly Intake - Week {week.week}</Text>
                        <View style={styles.chartContainerToo}>
                            <AnimatedCircularProgress
                            size={200}
                            width={15}
                            fill={week.totalCalories / (roundTargetCalories) * 100} // Fill percentage based on the ratio
                            tintColor="#00e0ff"
                            backgroundColor="#3d5875"
                            >
                                {(fill) => (
                                    <View>
                                        <Text style={styles.chartTextBold}>
                                        {Math.round(week.totalCalories)} / {roundTargetCalories} Cal consumed
                                        </Text>
                                        <Text style={styles.chartText}>
                                            {week.totalCalories > roundTargetCalories ? `${Math.round(week.totalCalories - roundTargetCalories)} Cal more` : `${Math.round(roundTargetCalories - week.totalCalories)} Cal less`}
                                        </Text>
                                    </View>
                                )}
                            </AnimatedCircularProgress>
                        </View>
                    </View>
                ))}
            </ScrollView>

=====================================================================

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