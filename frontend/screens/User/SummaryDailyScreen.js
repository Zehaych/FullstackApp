import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Context } from "../../store/context";
//import { ScrollView } from "react-native-gesture-handler";



const SummaryDailyScreen = ({ route }) => {
    const { user } = route.params; // Retrieve the user data passed from the previous screen
    const [currentUser, setCurrentUser] = useContext(Context);
    const [dailyCalories, setDailyCalories] = useState([]);
    const [userData, setUserData] = useState(user);
    const navigation = useNavigation();

    const currentUserData = userData.find(user => user._id === currentUser._id);
    console.log("1.=============== userData: " + currentUserData.username + " " + " CaloriesLog: " + currentUserData.dailyCaloriesLog[currentUserData.dailyCaloriesLog.length - 1].total_calories);

    //current user's calorie goal and daily calorie log
    const targetCalories = Math.round(currentUserData.calorie);
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

    //const roundedCaloriesLeft = caloriesLeft.toFixed(2);
    const roundedCaloriesLeft = Math.round(caloriesLeft);

    //const roundedCaloriesMore = caloriesMore.toFixed(2);
    const roundedCaloriesMore = Math.round(caloriesMore);

    //percentage of calories consumed
    const percentage = (latestTotalCalories / targetCalories) * 100;

    // Determine if calories exceeded the target
    const exceededTarget = latestTotalCalories > targetCalories;
    const animatedCircularProgressColor = percentage > 100 ? "#FFEBCC" : "#FF9130";

    // Navigation
    const navigateToTrackProgressScreen = () => {
        navigation.navigate("Track Progress");
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                {/* <View style={styles.textContainer}>
                    <Text style={styles.chartTextBold}>Daily Intake</Text>
                </View>
                <View style={styles.chartContainer}>
                    <AnimatedCircularProgress
                        size={200}
                        width={30}
                        fill={percentage}
                        tintColor={animatedCircularProgressColor}
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
                                    {exceededTarget ? `${roundedCaloriesMore} Cal more` : `${roundedCaloriesLeft} Cal left`}
                                </Text>
                            </View>
                        )}
                    </AnimatedCircularProgress>
                </View>
                <View style={styles.flexRowComponent}>
                    <View style={styles.leftComponent}>
                        <Text style={styles.text}>Daily intake </Text>
                        <Text style={styles.subText}>{latestTotalCalories}</Text>
                    </View>
                    <View style={styles.rightComponent}>
                        <Text style={styles.text}>Target Calories</Text>
                        <Text style={styles.subText}>{targetCalories}</Text>
                    </View>
                </View> */}
                <View style={styles.introSection}>
                    <View style={styles.componentContainer}>
                        <View style={styles.flexColumnComponent}>
                            <Text style={styles.subTitle}>
                                Daily Intake
                            </Text>
                        </View>

                        <View style={styles.flexRowComponent}>
                            <View style={styles.leftComponent}>
                                <Text style={[styles.normalText]}
                                >Calorie Consumed</Text>
                                <Text
                                    style={[styles.normalText, styles.orangeText]}
                                >
                                    {Math.round(latestTotalCalories)} cal
                                </Text>
                                <Text style={[styles.normalText]}>
                                    Calories Left
                                </Text>
                                <Text style={[styles.normalText, styles.orangeText]}>
                                    {roundedCaloriesLeft} cal
                                </Text>
                                <Text style={[styles.normalText]}
                                >Recommended Intake
                                </Text>
                                <Text
                                    style={[styles.normalText, styles.orangeText]}
                                >
                                    {targetCalories} cal
                                </Text>
                            </View>
                            <View style={styles.rightComponent}>
                                <AnimatedCircularProgress
                                    size={130}
                                    width={30}
                                    fill={percentage} // Assuming progress is a value between 0 and 100
                                    tintColor={animatedCircularProgressColor}
                                    backgroundColor="#FFEBCC"
                                    rotation={0}
                                    lineCap="round"
                                >
                                </AnimatedCircularProgress>
                            </View>
                        </View>
                    </View>

                    <View style={styles.componentContainer}>
                        <View style={styles.flexRowComponent}>
                            <View style={styles.leftComponent}>
                                <Text style={[styles.subTitle]}
                                >Breakfast
                                </Text>
                                <Text style={[styles.normalText]}
                                >No Recipe Added
                                </Text>
                            </View>
                            <View style={[styles.rightComponent]}>
                                <TouchableOpacity
                                    style={styles.iconButton}
                                    onPress={navigateToTrackProgressScreen}
                                >
                                    <Image
                                        source={require("../../assets/plusButton.png")}
                                        style={styles.iconImage}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={styles.componentContainer}>
                        <View style={styles.flexRowComponent}>
                            <View style={styles.leftComponent}>
                                <Text style={[styles.subTitle]}
                                >Lunch
                                </Text>
                                <Text style={[styles.normalText]}
                                >No Recipe Added
                                </Text>
                            </View>
                            <View style={[styles.rightComponent]}>
                                <TouchableOpacity
                                    style={styles.iconButton}
                                    onPress={navigateToTrackProgressScreen}
                                >
                                    <Image
                                        source={require("../../assets/plusButton.png")}
                                        style={styles.iconImage}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={styles.componentContainer}>
                        <View style={styles.flexRowComponent}>
                            <View style={styles.leftComponent}>
                                <Text style={[styles.subTitle]}
                                >Dinner
                                </Text>
                                <Text style={[styles.normalText]}
                                >No Recipe Added
                                </Text>
                            </View>
                            <View style={[styles.rightComponent]}>
                                <TouchableOpacity
                                    style={styles.iconButton}
                                    onPress={navigateToTrackProgressScreen}
                                >
                                    <Image
                                        source={require("../../assets/plusButton.png")}
                                        style={styles.iconImage}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View >
        </ScrollView>    
    );
};

export default SummaryDailyScreen;

const styles = StyleSheet.create({
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
    },
    flexColumnComponent: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "start",
        width: "100%",
        flexDirection: "column",
    },
    leftComponent: {
        flex: 1, // Takes up 1/3 of the available space
    },
    middleComponent: {
        flex: 1, // Takes up 1/3 of the available space
        alignItems: "center"
    },
    rightComponent: {
        display: 'flex',
        alignItems: "end",
    },
    //text
    subTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FF9130"
    },
    normalText: {
        fontSize: 14,
        margin: 1,
        // textAlign: "center",
    },
    orangeText: {
        color: "#FF9130"
    },
    // Button
    iconButton: {
        padding: 10,
        backgroundColor: "#FFEBCC",
        borderRadius: 10,
    },
    iconImage: {
        width: 25,
        height: 25,
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