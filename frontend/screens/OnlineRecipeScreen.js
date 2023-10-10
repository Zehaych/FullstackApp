import { StyleSheet, Text, View } from "react-native";
const OnlineRecipeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>
        This is OnlineRecipeScreen, maybe retrieved from spoonacular API?
      </Text>
    </View>
  );
};

export default OnlineRecipeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
