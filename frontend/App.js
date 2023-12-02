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
import SettingsScreen from "./screens/SettingsScreen";
import AddRecipeScreen from "./screens/AddRecipeScreen";
import UserScreen from "./screens/UserScreen";
import { Context } from "./store/context";
import { useState } from "react";
import ProgressScreen from "./screens/ProgressScreen";
import AddBizRecipeScreen from "./screens/AddBizRecipeScreen";
import BusinessRecipeScreen from "./screens/BusinessRecipeScreen";
import BusinessRecipeInfoScreen from "./screens/BusinessRecipeInfoScreen";
import PaymentScreen from "./screens/PaymentScreen";
import ChangeEmailScreen from "./screens/ChangeEmailScreen";
import ChangeUsernameScreen from "./screens/ChangeUsernameScreen";
import ChangePasswordScreen from "./screens/ChangePasswordScreen";
import BizPartnerSignUp from "./screens/BizPartnerSignUp";
import AdminScreen from "./screens/AdminScreen";
import DeleteAcountScreen from "./screens/DeleteAcountScreen";

const Stack = createStackNavigator();

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Context.Provider value={[currentUser, setCurrentUser]}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LogInScreen">
          <Stack.Screen
            name="AdminScreen"
            component={AdminScreen}
            options={{ headerShown: false }}
          />
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
          <Stack.Screen
            name="BizPartnerSignUp"
            component={BizPartnerSignUp}
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen name="Edit Profile" component={EditProfileScreen} /> */}
          <Stack.Screen name="Settings" component={SettingsScreen} />

          <Stack.Screen name="Change Email" component={ChangeEmailScreen} />

          <Stack.Screen
            name="Change Username"
            component={ChangeUsernameScreen}
          />

          <Stack.Screen
            name="Change Password"
            component={ChangePasswordScreen}
          />

          <Stack.Screen name="Delete Account" component={DeleteAcountScreen} />

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
            name="Community Recipes"
            component={MembersRecipeScreen}
          />
          <Stack.Screen
            name="Recipe Information"
            component={MembersRecipeInfoScreen}
            options={{ headerTransparent: true, headerTitle: "" }}
          />
          <Stack.Screen name="Online Recipes" component={OnlineRecipeScreen} />
          <Stack.Screen
            name="Online Recipe Information"
            component={OnlineRecipeInfoScreen}
            options={{ headerTransparent: true, headerTitle: "" }}
          />
          <Stack.Screen
            name="Business Recipes"
            component={BusinessRecipeScreen}
          />
          <Stack.Screen
            name="Business Recipe Information"
            component={BusinessRecipeInfoScreen}
            options={{ headerTransparent: true, headerTitle: "" }}
          />
          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="User Profile" component={UserScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Context.Provider>
  );
}

export default App;
