import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useState } from "react";
import AddBizRecipeScreen from "./screens/BizPartner/AddBizRecipeScreen";
import CompletedOrdersScreen from "./screens/BizPartner/CompletedOrdersScreen";
import EditBizRecipeScreen from "./screens/BizPartner/EditBizRecipeScreen";
import ViewBizRecipeInfoScreen from "./screens/BizPartner/ViewBizRecipeInfoScreen";
import ViewBizRecipeScreen from "./screens/BizPartner/ViewBizRecipeScreen";
import ViewOrdersScreen from "./screens/BizPartner/ViewOrdersScreen";
import BusinessRecipeInfoScreen from "./screens/General/BusinessRecipeInfoScreen";
import BusinessRecipeScreen from "./screens/General/BusinessRecipeScreen";
import FoodRecognitionScreen from './screens/General/FoodRecognitionScreen';
import LogInScreen from "./screens/General/LogInScreen";
import MembersRecipeInfoScreen from "./screens/General/MembersRecipeInfoScreen";
import MembersRecipeScreen from "./screens/General/MembersRecipeScreen";
import OnlineRecipeInfoScreen from "./screens/General/OnlineRecipeInfoScreen";
import OnlineRecipeScreen from "./screens/General/OnlineRecipeScreen";
import SignUpScreen from "./screens/General/SignUpScreen";
import TabScreen from "./screens/General/TabScreen";
import AdminScreen from "./screens/SystemAdmin/AdminScreen";
import BizPartnerInfo from "./screens/SystemAdmin/BizPartnerInfo";
import BizPartnerSignUp from "./screens/SystemAdmin/BizPartnerSignUp";
import FoodAndDrinksInfo from "./screens/SystemAdmin/FoodAndDrinksInfo";
import FoodRequested from "./screens/SystemAdmin/FoodRequested";
import ReportedBizRecipe from "./screens/SystemAdmin/ReportedBizRecipe";
import ReportedBizRecipeDetails from "./screens/SystemAdmin/ReportedBizRecipeDetail";
import ReportedRecipe from "./screens/SystemAdmin/ReportedRecipe";
import ReportedRecipeDetails from "./screens/SystemAdmin/ReportedRecipeDetails";
import RetrieveBizPartners from "./screens/SystemAdmin/RetrieveBizPartners";
import RetrieveUserAccount from "./screens/SystemAdmin/RetrieveUserAccount";
import UserInfo from "./screens/SystemAdmin/UserInfo";
import AddRecipeScreen from "./screens/User/AddRecipeScreen";
import ChangeEmailScreen from "./screens/User/ChangeEmailScreen";
import ChangePasswordScreen from "./screens/User/ChangePasswordScreen";
import ChangeUsernameScreen from "./screens/User/ChangeUsernameScreen";
import DeleteAcountScreen from "./screens/User/DeleteAcountScreen";
import EditRecipeScreen from "./screens/User/EditRecipeScreen";
import SubmitFoodRequest from "./screens/User/FoodRequestScreen";
import MedicalHistoryScreen from "./screens/User/MedicalHistoryScreen";
import OrderStatusScreen from "./screens/User/OrderStatusScreen";
import PaymentScreen from "./screens/User/PaymentScreen";
import ProgressScreen from "./screens/User/ProgressScreen";
import SettingsScreen from "./screens/User/SettingsScreen";
import TDEEScreen from "./screens/User/TDEEScreen";
import TabDWMScreen from "./screens/User/TabDWMScreen";
import UserScreen from "./screens/User/UserScreen";
import ViewBizFavouriteRecipeInfo from "./screens/User/ViewBizFavouriteRecipeInfo";
import ViewBizFavouritesScreen from "./screens/User/ViewBizFavouritesScreen";
import ViewFavouriteRecipeInfo from "./screens/User/ViewFavouriteRecipeInfo";
import ViewFavouritesScreen from "./screens/User/ViewFavouritesScreen";
import ViewPastOrdersScreen from "./screens/User/ViewPastOrdersScreen";
import ViewRecipeInfoScreen from "./screens/User/ViewRecipeInfoScreen";
import ViewRecipeScreen from "./screens/User/ViewRecipeScreen";
import ViewRequest from "./screens/User/ViewRequest";
import UserInfoScreen from "./screens/User/UserInfoScreen";
import { Context } from "./store/context";

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
            name="FoodRecognitionScreen"
            component={FoodRecognitionScreen}
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
          <Stack.Screen name="View User Profile" component={UserInfoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Context.Provider>
  );
}

export default App;
