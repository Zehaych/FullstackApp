import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LogInScreen from "./screens/General/LogInScreen";
import TabScreen from "./screens/General/TabScreen";
import SignUpScreen from "./screens/General/SignUpScreen";
import MembersRecipeScreen from "./screens/General/MembersRecipeScreen";
import MembersRecipeInfoScreen from "./screens/General/MembersRecipeInfoScreen";
import OnlineRecipeScreen from "./screens/General/OnlineRecipeScreen";
import OnlineRecipeInfoScreen from "./screens/General/OnlineRecipeInfoScreen";
import TDEEScreen from "./screens/User/TDEEScreen";
import MedicalHistoryScreen from "./screens/User/MedicalHistoryScreen";
import SettingsScreen from "./screens/User/SettingsScreen";
import AddRecipeScreen from "./screens/User/AddRecipeScreen";
import UserScreen from "./screens/User/UserScreen";
import { Context } from "./store/context";
import { useState } from "react";
import ProgressScreen from "./screens/User/ProgressScreen";
import AddBizRecipeScreen from "./screens/BizPartner/AddBizRecipeScreen";
import BusinessRecipeScreen from "./screens/General/BusinessRecipeScreen";
import BusinessRecipeInfoScreen from "./screens/General/BusinessRecipeInfoScreen";
import PaymentScreen from "./screens/User/PaymentScreen";
import ChangeEmailScreen from "./screens/User/ChangeEmailScreen";
import ChangeUsernameScreen from "./screens/User/ChangeUsernameScreen";
import ChangePasswordScreen from "./screens/User/ChangePasswordScreen";
import BizPartnerSignUp from "./screens/SystemAdmin/BizPartnerSignUp";
import AdminScreen from "./screens/SystemAdmin/AdminScreen";
import DeleteAcountScreen from "./screens/User/DeleteAcountScreen";
import ViewRecipeScreen from "./screens/User/ViewRecipeScreen";
import RetrieveUserAccount from "./screens/SystemAdmin/RetrieveUserAccount";
import RetrieveBizPartners from "./screens/SystemAdmin/RetrieveBizPartners";
import SummaryScreen from "./screens/User/SummaryScreen";
import BizPartnerInfo from "./screens/SystemAdmin/BizPartnerInfo";
import UserInfo from "./screens/SystemAdmin/UserInfo";
import PreferencesScreen from "./screens/User/PreferencesScreen";
import ViewRecipeInfoScreen from "./screens/User/ViewRecipeInfoScreen";

const Stack = createStackNavigator();

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Context.Provider value={[currentUser, setCurrentUser]}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LogInScreen">
          <Stack.Screen
            name="UserInfo"
            component={UserInfo}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BizPartnerInfo"
            component={BizPartnerInfo}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RetrieveBizPartners"
            component={RetrieveBizPartners}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RetrieveUserAccount"
            component={RetrieveUserAccount}
            options={{ headerShown: false }}
          />
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
          <Stack.Screen name="View Recipe" component={ViewRecipeScreen} />
          <Stack.Screen
            name="View Recipe Info"
            component={ViewRecipeInfoScreen}
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
          <Stack.Screen
            name="Summary"
            component={SummaryScreen}
            options={{ headerTitle: "" }}
          />
          <Stack.Screen
            name="Preferences"
            component={PreferencesScreen}
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
