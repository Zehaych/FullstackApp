import { StyleSheet, Text, View } from "react-native";
const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>This is homescreen</Text>
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
});
