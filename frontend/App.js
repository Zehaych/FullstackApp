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
import ChangeEmailScreen from "./screens/User/ChangeEmailScreen";
import ChangeUsernameScreen from "./screens/User/ChangeUsernameScreen";
import ChangePasswordScreen from "./screens/User/ChangePasswordScreen";
import BizPartnerSignUp from "./screens/SystemAdmin/BizPartnerSignUp";
import AdminScreen from "./screens/SystemAdmin/AdminScreen";
import DeleteAcountScreen from "./screens/User/DeleteAcountScreen";
import ViewRecipeScreen from "./screens/User/ViewRecipeScreen";
import RetrieveUserAccount from "./screens/SystemAdmin/RetrieveUserAccount";
import RetrieveBizPartners from "./screens/SystemAdmin/RetrieveBizPartners";
import TabDWMScreen from "./screens/User/TabDWMScreen";
import BizPartnerInfo from "./screens/SystemAdmin/BizPartnerInfo";
import UserInfo from "./screens/SystemAdmin/UserInfo";
import PaymentScreen from "./screens/User/PaymentScreen";
import ViewRecipeInfoScreen from "./screens/User/ViewRecipeInfoScreen";
import EditRecipeScreen from "./screens/User/EditRecipeScreen";
import ViewBizRecipeScreen from "./screens/BizPartner/ViewBizRecipeScreen";
import EditBizRecipeScreen from "./screens/BizPartner/EditBizRecipeScreen";
import ViewBizRecipeInfoScreen from "./screens/BizPartner/ViewBizRecipeInfoScreen";
import ReportedRecipe from "./screens/SystemAdmin/ReportedRecipe";
import ReportedRecipeDetails from "./screens/SystemAdmin/ReportedRecipeDetails";
import ReportedBizRecipe from "./screens/SystemAdmin/ReportedBizRecipe";
import ReportedBizRecipeDetails from "./screens/SystemAdmin/ReportedBizRecipeDetail";
import SubmitFoodRequest from "./screens/User/FoodRequestScreen";
import FoodRequested from "./screens/SystemAdmin/FoodRequested";
import FoodAndDrinksInfo from "./screens/SystemAdmin/FoodAndDrinksInfo";
import ViewRequest from "./screens/User/ViewRequest";
import ViewOrdersScreen from "./screens/BizPartner/ViewOrdersScreen";
import CompletedOrdersScreen from "./screens/BizPartner/CompletedOrdersScreen";
import ViewPastOrdersScreen from "./screens/User/ViewPastOrdersScreen";
import OrderStatusScreen from "./screens/User/OrderStatusScreen";
import ViewFavouritesScreen from "./screens/User/ViewFavouritesScreen";
import ViewFavouriteRecipeInfo from "./screens/User/ViewFavouriteRecipeInfo";
import ViewBizFavouritesScreen from "./screens/User/ViewBizFavouritesScreen";
import ViewBizFavouriteRecipeInfo from "./screens/User/ViewBizFavouriteRecipeInfo";

const Stack = createStackNavigator();

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Context.Provider value={[currentUser, setCurrentUser]}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LogInScreen">
          <Stack.Screen
            name="View Request"
            component={ViewRequest}
            options={{ headerTitle: "Request Status" }}
          />
          <Stack.Screen
            name="FoodAndDrinksInfo"
            component={FoodAndDrinksInfo}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="FoodRequested"
            component={FoodRequested}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SubmitFoodRequest"
            component={SubmitFoodRequest}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ReportedBizRecipeDetails"
            component={ReportedBizRecipeDetails}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ReportedBizRecipe"
            component={ReportedBizRecipe}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ReportedRecipeDetails"
            component={ReportedRecipeDetails}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ReportedRecipe"
            component={ReportedRecipe}
            options={{ headerShown: false }}
          />
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
            name="View Favourites"
            component={ViewFavouritesScreen}
          />

          <Stack.Screen
            name="ViewFavouriteRecipeInfo"
            component={ViewFavouriteRecipeInfo}
            options={{ headerTransparent: true, headerTitle: "" }}
          />

          <Stack.Screen
            name="View Business Favourites"
            component={ViewBizFavouritesScreen}
          />

          <Stack.Screen
            name="ViewBizFavouriteRecipeInfo"
            component={ViewBizFavouriteRecipeInfo}
            options={{ headerTransparent: true, headerTitle: "" }}
          />

          <Stack.Screen
            name="View Recipe Info"
            component={ViewRecipeInfoScreen}
            options={{ headerTransparent: true, headerTitle: "" }}
          />

          <Stack.Screen
            name="View Business Recipe"
            component={ViewBizRecipeScreen}
          />
          <Stack.Screen
            name="Business Recipe Info"
            component={ViewBizRecipeInfoScreen}
            options={{ headerTransparent: true, headerTitle: "" }}
          />

          <Stack.Screen name="View Orders" component={ViewOrdersScreen} />
          <Stack.Screen
            name="Completed Orders"
            component={CompletedOrdersScreen}
          />
          <Stack.Screen
            name="Edit Business Recipe"
            component={EditBizRecipeScreen}
          />

          <Stack.Screen name="Edit Recipe" component={EditRecipeScreen} />

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
            name="TabDWMScreen"
            component={TabDWMScreen}
            options={{ headerTitle: "" }}
          />

          <Stack.Screen name="Past Orders" component={ViewPastOrdersScreen} />
          {/* <Stack.Screen
            name="Payment"
            component={PaymentScreen}
            options={{ headerTransparent: true, headerTitle: "" }}
          /> */}
          <Stack.Screen name="Order Status" component={OrderStatusScreen} />

          <Stack.Screen name="Payment" component={PaymentScreen} />
          <Stack.Screen name="User Profile" component={UserScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Context.Provider>
  );
}

export default App;
