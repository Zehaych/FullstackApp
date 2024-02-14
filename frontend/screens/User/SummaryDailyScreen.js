import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
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
                <View style={styles.introSection}>
                    <View style={styles.componentContainer}>
                        <View style={styles.flexColumnComponent}>
                            <Text style={styles.subTitle}>
                                Daily Intake
                            </Text>
                        </View>

                        <View style={styles.flexRowComponent}>
                            <View style={styles.leftComponent}>
                                <View>
                                    <Text style={[styles.normalText]}>
                                        Calorie Consumed
                                    </Text>
                                    <Text style={[styles.normalText, styles.orangeText]}>
                                        {Math.round(latestTotalCalories)} cal
                                    </Text>
                                </View>
                                
                                
                                {/* <Text style={[styles.normalText]}>
                                    Calories Left
                                </Text>
                                <Text style={[styles.normalText, styles.orangeText]}>
                                    {roundedCaloriesLeft} cal
                                </Text> */}
                                <View>
                                    <Text style={[styles.normalText]}>
                                        Recommended Intake
                                    </Text>
                                    <Text style={[styles.normalText, styles.orangeText]}>
                                        {targetCalories} cal
                                    </Text>
                                </View>
                                
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

                    {/* <View style={styles.componentContainer}>
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
                    </View> */}
                    <View style={styles.button}>
                        <Button
                            onPress={navigateToTrackProgressScreen}
                            style={styles.buttonText}
                            title="Add Recipes Of The Day"
                        >
                            {/* <Text style={styles.buttonText}>Add Recipes Of The Day</Text> */}
                        </Button>
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
        gap: 8,
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
        fontSize: 16,
        margin: 1,
        // textAlign: "center",
    },
    orangeText: {
        color: "#FF9130"
    },
    buttonText: {
        color: "#FFF"
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
    button: {
        backgroundColor: "#ED6F21",
        borderRadius: 10,
        width: "100%",
    },
});