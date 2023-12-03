import React from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";


const SummaryScreen = () => {

    return (
        <View>
            <Text>Summary Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
});

export default SummaryScreen;