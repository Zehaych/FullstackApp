import { StyleSheet, Text, View } from "react-native";
const ProgressScreen = () => {
  return (
    <View style={styles.container}>
      <Text>This is ProgressScreen</Text>
    </View>
  );
};

export default ProgressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
