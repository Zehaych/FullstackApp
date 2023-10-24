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
import MedicalHistoryScreen from "./screens/MedicalHistoryScreen";
import EditProfileScreen from "./screens/EditProfileScreen";
import AddRecipeScreen from "./screens/AddRecipeScreen";
import UserScreen from "./screens/UserScreen";
import { Context } from "./store/context";
import { useState } from "react";
import ProgressScreen from "./screens/ProgressScreen";
import AddBizRecipeScreen from "./screens/AddBizRecipeScreen";
import BusinessRecipeScreen from "./screens/BusinessRecipeScreen";
import BusinessRecipeInfoScreen from "./screens/BusinessRecipeInfoScreen";
import PaymentScreen from "./screens/PaymentScreen";

const Stack = createStackNavigator();

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Context.Provider value={[currentUser, setCurrentUser]}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LogInScreen">
          <Stack.Screen
            name="LogInScreen"
            component={LogInScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Sign up"
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TabScreen"
            component={TabScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Edit Profile" component={EditProfileScreen} />
          <Stack.Screen name="Calculate Calorie" component={TDEEScreen} />
          <Stack.Screen
            name="Medical History"
            component={MedicalHistoryScreen}
          />
          <Stack.Screen name="Add Recipe" component={AddRecipeScreen} />
          <Stack.Screen
            name="Add Business Recipe"
            component={AddBizRecipeScreen}
          />

          <Stack.Screen name="Track Progress" component={ProgressScreen} />

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
            options={{ headerTransparent: true, headerTitle: "" }}
          />
          <Stack.Screen
            name="BusinessRecipeScreen"
            component={BusinessRecipeScreen}
          />
          <Stack.Screen
            name="BusinessRecipeInfoScreen"
            component={BusinessRecipeInfoScreen}
          />
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="UserScreen" component={UserScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Context.Provider>
  );
}

export default App;
