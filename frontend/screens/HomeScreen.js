import { StyleSheet, Text, View } from "react-native";
const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Boundary name is based from file name, so this is HomeScreen</Text>
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
