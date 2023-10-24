import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useContext } from "react";
import { Context } from "../store/context";

const BizPartnerScreen = () => {
    const navigation = useNavigation();
    const [currentUser, setCurrentUser] = useContext(Context);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{currentUser.username}</Text>
            <Text>Welcome to the Business Partner Screen!</Text>
            {/* Add more components or information specific to business partners here */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});

export default BizPartnerScreen;
