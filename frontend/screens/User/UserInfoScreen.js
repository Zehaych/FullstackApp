import React, { useContext }from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
} from "react-native";
import { Context } from "../../store/context";

const UserInfoScreen = () => {
    const [currentUser, setCurrentUser] = useContext(Context);

    return (
        <View style={styles.container}>

            <View style={styles.userInfoSection}>
                <Image 
                    source={require("../../assets/person-placeholder.jpg")} 
                    style={styles.userImage} 
                />
                <Text style={styles.infoTitle}>{currentUser.username}</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.detailBox}>
                <View style={styles.componentContainer}>
                    <Text style={styles.detailText1}>Age</Text>
                    <Text style={styles.detailText2}>{currentUser.age}</Text>
                </View>
                <View style={styles.componentContainer}>
                    <Text style={styles.detailText1}>Sex</Text>
                    <Text style={styles.detailText2}>{currentUser.gender}</Text>
                </View>

                <View style={styles.componentContainer}>
                    <Text style={styles.detailText1}>Weight</Text>
                    <Text style={styles.detailText2}>{currentUser.weight} kg</Text>
                </View>

                <View style={styles.componentContainer}>
                    <Text style={styles.detailText1}>Height</Text>
                    <Text style={styles.detailText2}>{currentUser.height} cm</Text>
                </View>

                <View style={styles.componentContainer}>
                    <Text style={styles.detailText1}>Calorie goal</Text>
                    <Text style={styles.detailText2}>{currentUser.calorie} kcal</Text>
                </View>
            </View>
        </View>
    );
};

export default UserInfoScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    userInfoSection: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        alignItems: "center",
    }, 
    detailBox: {
        //flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 20,
        marginVertical: 10,
        marginHorizontal: 20,
        shadowColor: "#000000",
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowRadius: 3.84,
        shadowOpacity: 0.25,
        elevation: 5,
        gap: 15,
    },
    componentContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        // marginBottom: 10,
        paddingHorizontal: 10,
    },
    detailText1: {
        fontSize: 16,
        color: "grey",
        // marginBottom: 5, 
    },
    detailText2: {
        fontSize: 16,
        // marginBottom: 5,
        width: "70%",
        textAlign: "right",
    },
    userImage: {
        width: 80,
        height: 80,
        borderRadius: 50,
        margin: 10,
    },
    infoTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333", 
      },
    divider: {
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
});