import React, { useContext }from "react";
import {
    View,
    Text,
    StyleSheet,
} from "react-native";
import { Context } from "../../store/context";

const UserInfoScreen = () => {
    const [currentUser, setCurrentUser] = useContext(Context);

    return (
        <View style={styles.container}>
            <View style={styles.userInfoSection}>
                <View style={styles.userInfo}>
                    <Text style={styles.title}>{currentUser.username}</Text>
                </View>
                <View style={styles.userInfoBorder}></View>
            </View>

            <View style={styles.userDetails}>
                <View style={styles.componentContainer}>
                    <View style={styles.leftComponent}>
                        <Text style={styles.detailText1}>Age</Text>
                    </View>
                    <View style={styles.rightComponent}>
                        <Text style={styles.detailText2}> {currentUser.age} </Text>
                    </View>
                </View>
                <View style={styles.componentContainer}>
                    <View style={styles.leftComponent}>
                        <Text style={styles.detailText1}>Sex</Text>
                    </View>
                    <View style={styles.rightComponent}>
                        <Text style={styles.detailText2}> {currentUser.gender} </Text>
                    </View>
                </View>

                <View style={styles.componentContainer}>
                    <View style={styles.leftComponent}>
                        <Text style={styles.detailText1}>Weight</Text>
                    </View>
                    <View style={styles.rightComponent}>
                        <Text style={styles.detailText2}> {currentUser.weight} kg</Text>
                    </View>
                </View>

                <View style={styles.componentContainer}>
                    <View style={styles.leftComponent}>
                        <Text style={styles.detailText1}>Height</Text>
                    </View>
                    <View style={styles.rightComponent}>
                        <Text style={styles.detailText2}> {currentUser.height} cm</Text>
                    </View>
                </View>

                <View style={styles.componentContainer}>
                    <View style={styles.leftComponent}>
                        <Text style={styles.detailText1}>Calorie goal</Text>
                    </View>
                    <View style={styles.rightComponent}>
                        <Text style={styles.detailText2}> {currentUser.calorie} kcal</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default UserInfoScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    userInfoSection: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    userInfo: {

        alignItems: "center",
    }, 
    userInfoBorder: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 1,
        backgroundColor: "#dddddd",
        borderBottomWidth: 1,
        borderBottomColor: "#dddddd",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: 'white',
    },
    userDetail: {
        margin: 10,
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    userInfo: {
        alignItems: "center",
    },
    userDetails: {
        margin: 10,
        borderWidth: 1,
        borderColor: "#dddddd",
        borderRadius: 15,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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
        flex: 1,
        paddingTop: 5,
        paddingBottom: 5,
    },
    rightComponent: {
        flex: 1,
        paddingTop: 5,
        paddingBottom: 5,
    },
    detailText1: {
        fontSize: 16,
        textAlign: "left",
        paddingLeft: 10,
        color: "#7F7F7F",
    },
    detailText2: {
        fontSize: 16,
        textAlign: "right",
        paddingRight: 10,
        color: "#000000",
    },
});