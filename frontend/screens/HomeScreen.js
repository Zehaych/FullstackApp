import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import Icon from 'react-native-vector-icons/FontAwesome';
import { StatusBar } from "expo-status-bar";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50}}
        style={styles.scroller}>
          {/* bellicon */}
        <View style={styles.header}>
          <Icon name="bell" size={30} color="#900" />
        </View>
        <View style={styles.text}>
          <Text>Boundary name is based from file name, so this is HomeScreen</Text>
        </View>

      </ScrollView>
      
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  scroller: {
    // Add spacing between child elements
    marginVertical: 6,
    paddingTop: 14,
  },
  header: {
    height: 60,
    paddingTop: 20,

  },
  text: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 50,
  },
});
