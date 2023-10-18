import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LogInScreen from "./screens/LogInScreen";
import TabScreen from "./screens/TabScreen";
import SignUpScreen from "./screens/SignUpScreen";
import MembersRecipeScreen from "./screens/MembersRecipeScreen";
import MembersRecipeInfoScreen from "./screens/MembersRecipeInfoScreen";
import OnlineRecipeScreen from "./screens/OnlineRecipeScreen";
import OnlineRecipeInfoScreen from "./screens/OnlineRecipeInfoScreen";
import TDEEScreen from "./screens/TDEEScreen";
import CalorieGoalScreen from "./screens/CalorieGoalScreen";
import MedicalHistoryScreen from "./screens/MedicalHistoryScreen";

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LogInScreen">
        <Stack.Screen
          name="LogInScreen"
          component={LogInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Get started"
          component={TDEEScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Medical History"
          component={MedicalHistoryScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TabScreen"
          component={TabScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MembersRecipeScreen"
          component={MembersRecipeScreen}
        />
        <Stack.Screen
          name="MembersRecipeInfoScreen"
          component={MembersRecipeInfoScreen}
        />
        <Stack.Screen
          name="OnlineRecipeScreen"
          component={OnlineRecipeScreen}
        />
        <Stack.Screen
          name="OnlineRecipeInfoScreen"
          component={OnlineRecipeInfoScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
