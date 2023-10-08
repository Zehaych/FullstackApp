import { StyleSheet, View, Text } from "react-native";

const UserScreen = () => {
  return (
    <View style={styles.container}>
      <Text>This is UserScreen!</Text>
    </View>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
