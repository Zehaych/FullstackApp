import React, { useContext, useEffect, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { Context } from "../../store/context";

export default function ViewFoodRecognitionLog({ navigation }) {
    const [foodRecognitionLog, setFoodRecognitionLog] = useState([])
    const [currentUser, setCurrentUser] = useContext(Context);

    const fetchFoodRecognitionLog = async () => {
        try {
            // Fetch all food recognition log
            const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/user/getFoodRecognition/${currentUser._id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const foodRecognitionLog = await response.json();

            setFoodRecognitionLog(foodRecognitionLog)
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchFoodRecognitionLog();
    }, [currentUser._id])

    return (
        <SafeAreaView style={styles.container}>
            {foodRecognitionLog?.length !== 0 ? <FlatList
                data={foodRecognitionLog}
                numColumns={1}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => {
                    const date = new Date(item.date)
                    return (
                        <View
                            style={styles.foodRecognitionLogCard}
                        >
                            {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />
                            }
                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                                <View>
                                    <Text style={styles.resultsHeader}>Date</Text>
                                </View>
                                <View>
                                    <Text style={styles.resultsHeader}>{`${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()}`}</Text>
                                </View>
                            </View>
                            <View style={{ flex: 1, justifyContent: "space-between", width: "100%" }}>
                                <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                                    <View>
                                        <Text style={styles.resultsHeader}>Food</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.resultsHeader} >Calories</Text>
                                    </View>
                                </View>

                                {item?.food?.map((food, index) => {
                                    const { name, calories } = food || {}
                                    return (
                                        <View style={styles.classifiedResultsView} key={index}>
                                            <View>
                                                <Text style={styles.resultText}>{name}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.resultText}>{calories}</Text>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    )
                }}
            /> : <View style={{ display: "flex", alignItems: 'center', gap: 10 }}><Text>No data yet!</Text>
                <TouchableOpacity
                    style={{ backgroundColor: '#FFF', padding: 12, borderRadius: 10, backgroundColor: '#ED6F21', width: "100%", alignItems: "center" }}
                    onPress={() =>
                        navigation.navigate("FoodRecognitionScreen")
                    }
                ><Text style={{ color: '#FFF', fontWeight: "bold" }}>Recognize Food Now!</Text></TouchableOpacity></View>}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        margin: 20,
    },
    foodRecognitionLogCard: {
        display: "flex",
        gap: 12,
        marginBottom: 10,
        padding: 10,
        backgroundColor: "#FFF",
        borderRadius: 10,

    }, image: {
        width: "100%",
        height: 300,
        resizeMode: "cover",
        borderRadius: 10,
    },
    classifiedResultsView: {
        marginTop: 12,
        // marginLeft: 48,
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
    },
    selectImageButton: {
        backgroundColor: "#ED6F21",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        width: Dimensions.get('window').width * 0.8
    },
    selectImageButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    resultText: {
        fontSize: 14
    },
    resultsHeader: {
        fontWeight: "bold", fontSize: 17
    },
    // dateResults: {
    //     fontWeight: "normal", fontSize: 17
    // }
})