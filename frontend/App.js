import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useState } from "react";
import AddBizRecipeScreen from "./screens/BizPartner/AddBizRecipeScreen";
import CompletedOrdersScreen from "./screens/BizPartner/CompletedOrdersScreen";
import EditBizRecipeScreen from "./screens/BizPartner/EditBizRecipeScreen";
import TabReportScreen from "./screens/BizPartner/TabReportScreen";
import ViewBizRecipeInfoScreen from "./screens/BizPartner/ViewBizRecipeInfoScreen";
import ViewBizRecipeScreen from "./screens/BizPartner/ViewBizRecipeScreen";
import ViewOrdersScreen from "./screens/BizPartner/ViewOrdersScreen";
import BusinessRecipeInfoScreen from "./screens/General/BusinessRecipeInfoScreen";
import BusinessRecipeScreen from "./screens/General/BusinessRecipeScreen";
import FoodRecognitionScreen from "./screens/General/FoodRecognitionScreen";
import LogInScreen from "./screens/General/LogInScreen";
import MembersRecipeInfoScreen from "./screens/General/MembersRecipeInfoScreen";
import MembersRecipeScreen from "./screens/General/MembersRecipeScreen";
import OnlineRecipeInfoScreen from "./screens/General/OnlineRecipeInfoScreen";
import OnlineRecipeScreen from "./screens/General/OnlineRecipeScreen";
import SignUpScreen from "./screens/General/SignUpScreen";
import TabRecipes from "./screens/General/TabRecipes";
import TabScreen from "./screens/General/TabScreen";
import AdminScreen from "./screens/SystemAdmin/AdminScreen";
import BizPartnerInfo from "./screens/SystemAdmin/BizPartnerInfo";
import BizPartnerSignUp from "./screens/SystemAdmin/BizPartnerSignUp";
import FoodAndDrinksInfo from "./screens/SystemAdmin/FoodAndDrinksInfo";
import FoodRequestedTabs from "./screens/SystemAdmin/FoodRequestedTabs";
import ReportedBizRecipe from "./screens/SystemAdmin/ReportedBizRecipe";
import ReportedBizRecipeDetails from "./screens/SystemAdmin/ReportedBizRecipeDetail";
import ReportedRecipe from "./screens/SystemAdmin/ReportedRecipe";
import ReportedRecipeDetails from "./screens/SystemAdmin/ReportedRecipeDetails";
import RetrieveBizPartners from "./screens/SystemAdmin/RetrieveBizPartners";
import RetrieveBizReports from "./screens/SystemAdmin/RetrieveBizReports";
import RetrieveUserAccount from "./screens/SystemAdmin/RetrieveUserAccount";
import TabFullReportScreen from "./screens/SystemAdmin/TabFullReportScreen";
import UserInfo from "./screens/SystemAdmin/UserInfo";
import AddRecipeScreen from "./screens/User/AddRecipeScreen";
import CartScreen from "./screens/User/CartScreen";
import ChangeEmailScreen from "./screens/User/ChangeEmailScreen";
import ChangePasswordScreen from "./screens/User/ChangePasswordScreen";
import ChangeUsernameScreen from "./screens/User/ChangeUsernameScreen";
import DeleteAcountScreen from "./screens/User/DeleteAcountScreen";
import EditRecipeScreen from "./screens/User/EditRecipeScreen";
import SubmitFoodRequest from "./screens/User/FoodRequestScreen";
import MedicalHistoryScreen from "./screens/User/MedicalHistoryScreen";
import OrderStatusScreen from "./screens/User/OrderStatusScreen";
import PaymentScreen from "./screens/User/PaymentScreen";
import SettingsScreen from "./screens/User/SettingsScreen";
import TDEEScreen from "./screens/User/TDEEScreen";
import TabDWMScreen from "./screens/User/TabDWMScreen";
import UserScreen from "./screens/User/UserScreen";
import ViewBizFavouriteRecipeInfo from "./screens/User/ViewBizFavouriteRecipeInfo";
import ViewBizFavouritesScreen from "./screens/User/ViewBizFavouritesScreen";
import ViewFavouriteRecipeInfo from "./screens/User/ViewFavouriteRecipeInfo";
import ViewFavouritesScreen from "./screens/User/ViewFavouritesScreen";
import ViewFoodRecognitionLog from "./screens/User/ViewFoodRecognitionLog";
import ViewPastOrdersScreen from "./screens/User/ViewPastOrdersScreen";
import ViewRecipeInfoScreen from "./screens/User/ViewRecipeInfoScreen";
import ViewRecipeScreen from "./screens/User/ViewRecipeScreen";
import ViewRequest from "./screens/User/ViewRequest";
// import FullReportMonthly from "./screens/SystemAdmin/FullReportMonthly";
import ProgressScreen from "./screens/User/ProgressScreen";
import UserInfoScreen from "./screens/User/UserInfoScreen";
import TabFavourites from "./screens/User/TabFavourites";
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
            options={{ headerTitle: "Food & Drinks Database"}}
          />
          <Stack.Screen
            name="FoodRequestedTabs"
            component={FoodRequestedTabs}
            options={{ headerTitle: "Food Requested" }}
          />
          <Stack.Screen
            name="SubmitFoodRequest"
            component={SubmitFoodRequest}
            options={{ headerTitle: "Add Food & Drinks Request" }}
          />
          <Stack.Screen
            name="ReportedBizRecipeDetails"
            component={ReportedBizRecipeDetails}
            options={{ headerTitle: "Reported Business Recipe" }}
          />
          <Stack.Screen
            name="ReportedBizRecipe"
            component={ReportedBizRecipe}
            options={{ headerTitle: "Reported Business Partner Recipes" }}
          />
          <Stack.Screen
            name="ReportedRecipeDetails"
            component={ReportedRecipeDetails}
            options={{ headerTitle: "Reported Community Recipe" }}
          />
          <Stack.Screen
            name="ReportedRecipe"
            component={ReportedRecipe}
            options={{ headerTitle: "Reported Community Recipes" }}
          />
          <Stack.Screen
            name="UserInfo"
            component={UserInfo}
            options={{ headerTitle: "User Account Information" }}
          />
          <Stack.Screen
            name="BizPartnerInfo"
            component={BizPartnerInfo}
            options={{ headerTitle: "Business Account Information" }}
          />
          <Stack.Screen
            name="RetrieveBizPartners"
            component={RetrieveBizPartners}
            options={{ headerTitle: "Retrieve Business User Accounts" }}
          />

          <Stack.Screen
            name="RetrieveBizReports"
            component={RetrieveBizReports}
            options={{ headerTitle: "Retrieve Business Reports" }}
          />
          <Stack.Screen
            name="RetrieveUserAccount"
            component={RetrieveUserAccount}
            options={{ headerTitle: "Retrieve User Accounts" }}
          />

          {/* <Stack.Screen
            name="FullReportMonthly"
            component={FullReportMonthly}
            options={{ headerShown: false }}
          /> */}
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
            options={{ headerTitle: "Food Recognition" }}
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
            options={{ headerTitle: "Create Business Partner Account" }}
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
          <Stack.Screen name="View Added Recipe" component={ViewRecipeScreen} />

          <Stack.Screen name="View Food Recognition Log" component={ViewFoodRecognitionLog} />

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
            options={{ headerTitle: "" }}
          />

          <Stack.Screen
            name="View Business Recipe"
            component={ViewBizRecipeScreen}
          />
          <Stack.Screen
            name="Business Recipe Info"
            component={ViewBizRecipeInfoScreen}
            options={{ headerTitle: "" }}
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
            //options={{ headerTransparent: true, headerTitle: "" }}
            options={{ headerTitle: "" }}
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

          <Stack.Screen
            name="TabReportScreen"
            component={TabReportScreen}
            options={{ headerTitle: "" }}
          />

          <Stack.Screen
            name="TabFullReportScreen"
            component={TabFullReportScreen}
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

          <Stack.Screen 
            name="Cart" 
            component={CartScreen}
            options={{ headerTitle: "Your Cart" }}
          />

          <Stack.Screen
            name="Recipes"
            component={TabRecipes}
            options={{ headerTitle: "" }}
          />
          <Stack.Screen
            name="Favourites"
            component={TabFavourites}
            options={{ headerTitle: "Favourite Recipes" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Context.Provider>
  );
}

export default App;
