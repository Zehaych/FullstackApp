// import { StyleSheet, Text, View, ScrollView } from "react-native";
// import React from "react";
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { StatusBar } from "expo-status-bar";

// const HomeScreen = () => {
//   return (
//     <View style={styles.container}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{paddingBottom: 50}}
//         style={styles.scroller}>
//           {/* bellicon */}
//         <View style={styles.header}>
//           <Icon name="bell" size={30} color="#900" />
//         </View>
//         <View style={styles.text}>
//           <Text>Boundary name is based from file name, so this is HomeScreen</Text>
//         </View>

//       </ScrollView>

//     </View>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   scroller: {
//     // Add spacing between child elements
//     marginVertical: 6,
//     paddingTop: 14,
//   },
//   header: {
//     height: 60,
//     paddingTop: 20,

//   },
//   text: {
//     flex: 1,
//     justifyContent: "flex-end",
//     paddingBottom: 50,
//   },
// });

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";

const HomeScreen = ({ navigation }) => {
  const navigateToCommunityRecipes = () => {
    navigation.navigate("MembersRecipeScreen");
  };

  const navigateToUser = () => {
    navigation.navigate("UserScreen");
  };

  const navigateToOnlineRecipes = () => {
    navigation.navigate("OnlineRecipeScreen");
  };
  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerText}>NutriRizz Recipe App</Text>
      </View>
      <Image
        source={require("../assets/recipe_image.png")}
        style={styles.bannerImage}
      />

      <View style={styles.introSection}>
        <Text style={styles.introHeader}>Welcome to NutriRizz</Text>
        <View style={styles.introImages}>
          <View style={styles.introImage}>
            <Image
              source={require("../assets/image1.png")}
              style={styles.introImageImage}
            />
            <Text style={styles.introImageText}>Discover Recipes</Text>
          </View>
          <View style={styles.introImage}>
            <Image
              source={require("../assets/image2.png")}
              style={styles.introImageImage}
            />
            <Text style={styles.introImageText}>Share Your Recipes</Text>
          </View>
          <View style={styles.introImage}>
            <Image
              source={require("../assets/image3.png")}
              style={styles.introImageImage}
            />
            <Text style={styles.introImageText}>Track your Progress</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.startButton} onPress={navigateToUser}>
          <Text style={styles.startButtonText}>Start Now</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.featuredSection}>
        <Text style={styles.sectionHeader}>Online Recipes</Text>
        {/* Display featured recipe cards */}
        <TouchableOpacity style={styles.featuredCard}>
          <Image
            source={require("../assets/recipe1.jpg")}
            style={styles.featuredCardImage}
          />
          <Text style={styles.featuredCardTitle}>Spaghetti Bolognese</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.featuredCard}>
          <Image
            source={require("../assets/recipe2.jpg")}
            style={styles.featuredCardImage}
          />
          <Text style={styles.featuredCardTitle}>Chicken Alfredo</Text>
        </TouchableOpacity>
        {/* Add more featured recipe cards here */}
      </View>

      <TouchableOpacity style={styles.button} onPress={navigateToOnlineRecipes}>
        <Text style={styles.buttonText}>Explore More Online Recipes</Text>
      </TouchableOpacity>

      <View style={styles.communitySection}>
        <Text style={styles.sectionHeader}>Top Community Recipes</Text>
        {/* Display top community recipes */}
        <TouchableOpacity style={styles.communityRecipe}>
          <Image
            source={require("../assets/recipe3.jpg")}
            style={styles.communityRecipeImage}
          />
          <Text style={styles.communityRecipeTitle}>Veggie Stir-Fry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.communityRecipe}>
          <Image
            source={require("../assets/recipe4.jpg")}
            style={styles.communityRecipeImage}
          />
          <Text style={styles.communityRecipeTitle}>Homemade Pizza</Text>
        </TouchableOpacity>
        {/* Add more top community recipes here */}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={navigateToCommunityRecipes}
      >
        <Text style={styles.buttonText}>Explore More Community Recipes</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© FYP-23-S4-35</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  bannerImage: {
    width: "100%",
    height: 200,
  },
  introSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  introHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  introImages: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  introImage: {
    flex: 1,
    alignItems: "center",
  },
  introImageImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  introImageText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  startButton: {
    backgroundColor: "#0066cc",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 20,
  },
  featuredSection: {
    marginBottom: 20,
  },
  featuredCard: {
    flexDirection: "column",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  featuredCardImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  featuredCardTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  communitySection: {
    marginBottom: 20,
  },
  communityRecipe: {
    flexDirection: "column",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  communityRecipeImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  communityRecipeTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#0066cc",
    padding: 10,
    borderRadius: 10,
    margin: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    padding: 10,
    backgroundColor: "#333",
    alignItems: "center",
  },
  footerText: {
    color: "#fff",
  },
});

export default HomeScreen;

// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";

// const HomeScreen = ({ navigation }) => {
//   const navigateToCommunityRecipes = () => {
//     // Navigate to the Community Recipes screen
//     navigation.navigate("CommunityRecipes");
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>My Recipe App</Text>
//       </View>
//       {/* <Image source={require('./assets/recipe_image.jpg')} style={styles.bannerImage} /> */}

//       <View style={styles.featuredSection}>
//         <Text style={styles.sectionHeader}>Featured Recipes</Text>
//         {/* Display featured recipe cards */}
//         <TouchableOpacity style={styles.featuredCard}>
//           {/* <Image source={require('./assets/recipe1.jpg')} style={styles.featuredCardImage} /> */}
//           <Text style={styles.featuredCardTitle}>Spaghetti Bolognese</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.featuredCard}>
//           {/* <Image source={require('./assets/recipe2.jpg')} style={styles.featuredCardImage} /> */}
//           <Text style={styles.featuredCardTitle}>Chicken Alfredo</Text>
//         </TouchableOpacity>
//         {/* Add more featured recipe cards here */}
//       </View>

//       <View style={styles.communitySection}>
//         <Text style={styles.sectionHeader}>Top Community Recipes</Text>
//         {/* Display top community recipes */}
//         <TouchableOpacity style={styles.communityRecipe}>
//           {/* <Image source={require('./assets/recipe3.jpg')} style={styles.communityRecipeImage} /> */}
//           <Text style={styles.communityRecipeTitle}>Veggie Stir-Fry</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.communityRecipe}>
//           {/* <Image source={require('./assets/recipe4.jpg')} style={styles.communityRecipeImage} /> */}
//           <Text style={styles.communityRecipeTitle}>Homemade Pizza</Text>
//         </TouchableOpacity>
//         {/* Add more top community recipes here */}
//       </View>

//       {/* Button to navigate to Community Recipes */}
//       <TouchableOpacity
//         style={styles.button}
//         onPress={navigateToCommunityRecipes}
//       >
//         <Text style={styles.buttonText}>Explore More Community Recipes</Text>
//       </TouchableOpacity>

//       <View style={styles.footer}>
//         <Text style={styles.footerText}>© 2023 My Recipe App</Text>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   header: {
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: "bold",
//   },
//   bannerImage: {
//     width: "100%",
//     height: 200,
//   },
//   sectionHeader: {
//     fontSize: 20,
//     fontWeight: "bold",
//     margin: 20,
//   },
//   featuredSection: {
//     marginBottom: 20,
//   },
//   featuredCard: {
//     flexDirection: "column",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     margin: 10,
//     padding: 10,
//   },
//   featuredCardImage: {
//     width: 150,
//     height: 150,
//     borderRadius: 10,
//   },
//   featuredCardTitle: {
//     marginTop: 10,
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   communitySection: {
//     marginBottom: 20,
//   },
//   communityRecipe: {
//     flexDirection: "column",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     margin: 10,
//     padding: 10,
//   },
//   communityRecipeImage: {
//     width: 150,
//     height: 150,
//     borderRadius: 10,
//   },
//   communityRecipeTitle: {
//     marginTop: 10,
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   button: {
//     backgroundColor: "#0066cc",
//     padding: 10,
//     borderRadius: 10,
//     margin: 20,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   footer: {
//     padding: 10,
//     backgroundColor: "#333",
//     alignItems: "center",
//   },
//   footerText: {
//     color: "#fff",
//   },
// });

// export default HomeScreen;
