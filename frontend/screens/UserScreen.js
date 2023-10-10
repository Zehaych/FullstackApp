import { StyleSheet, View, Text } from "react-native";

const UserScreen = () => {
  return (
    <View style={styles.container}>
      <Text>This is UserScreen</Text>
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
// import { useNavigation } from "@react-navigation/native";
// import React from "react";
// import { View, SafeAreaView, StyleSheet, Alert } from "react-native";
// import {
//   Avatar,
//   Title,
//   Caption,
//   Text,
//   TouchableRipple,
// } from "react-native-paper";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// const UserScreen = () => {
//   const navigation = useNavigation();
//   const onLogOutPressed = () => {
//     Alert.alert("Log Out", "Are you sure you want to log out?", [
//       { text: "No", onPress: () => {} },
//       { text: "Yes", onPress: () => navigation.navigate("LogInScreen") },
//     ]);
//   };

//   const onSettingsPressed = () => {
//     navigation.navigate("Settings");
//   };

//   const onEditProfilePressed = () => {
//     navigation.navigate("EditProfile");
//   };

//   const onAddFoodPressed = () => {
//     navigation.navigate("AddFood");
//   };

//   // const onEditProfilePressed = () => {
//   //   navigation.navigate("EditProfile");
//   // };
//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.userInfoSection}>
//         <View style={{ flexDirection: "row", marginTop: 15 }}>
//           <Avatar.Image
//             source={{
//               uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
//             }}
//             size={80}
//           />
//           <View style={{ marginLeft: 20 }}>
//             <Title style={[styles.title, { marginTop: 15, marginBottom: 5 }]}>
//               JohnDoe
//             </Title>
//             <Caption style={styles.caption}>@JohnDoe</Caption>
//           </View>
//         </View>
//       </View>

//       <View style={styles.userInfoSection}>
//         <View style={styles.row}>
//           <Icon name="map-marker-radius" color="#777777" size={20}></Icon>
//           <Text style={{ color: "#777777", marginLeft: 20 }}>Singapore</Text>
//         </View>
//         {/* <View style={styles.row}>
//           <Icon name="phone" color="#777777" size={20} />
//           <Text style={{ color: "#777777", marginLeft: 20 }}>
//             +91-900000009
//           </Text>
//         </View> */}
//         <View style={styles.row}>
//           <Icon name="email" color="#777777" size={20} />
//           <Text style={{ color: "#777777", marginLeft: 20 }}>
//             john_doe@email.com
//           </Text>
//         </View>
//       </View>
//       {/* <View style={styles.infoBoxWrapper}>
//         <View
//           style={[
//             styles.infoBox,
//             {
//               borderRightColor: "#dddddd",
//               borderRightWidth: 1,
//             },
//           ]}
//         >
//           <Title>$140.50</Title>
//           <Caption>Wallet</Caption>
//         </View>
//         <View style={styles.infoBox}>
//           <Title>12</Title>
//           <Caption>Orders</Caption>
//         </View>
//       </View> */}
//       <View style={styles.menuWrapper}>
//         <TouchableRipple onPress={onEditProfilePressed}>
//           <View style={styles.menuItem}>
//             <Icon name="account-check-outline" color="#FF6347" size={25} />
//             <Text style={styles.menuItemText}>Edit Profile</Text>
//           </View>
//         </TouchableRipple>
//         <TouchableRipple onPress={onAddFoodPressed}>
//           <View style={styles.menuItem}>
//             <Icon name="database-plus" color="#FF6347" size={25} />
//             <Text style={styles.menuItemText}>Add food</Text>
//           </View>
//         </TouchableRipple>

//         <TouchableRipple onPress={onSettingsPressed}>
//           <View style={styles.menuItem}>
//             <Icon name="cog" color="#FF6347" size={25} />
//             <Text style={styles.menuItemText}>Settings</Text>
//           </View>
//         </TouchableRipple>
//         <TouchableRipple onPress={onLogOutPressed}>
//           <View style={styles.menuItem}>
//             <Icon name="exit-to-app" color="#FF6347" size={25} />
//             <Text style={styles.menuItemText}>Log Out</Text>
//           </View>
//         </TouchableRipple>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default UserScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // alignItems: "center",
//     // justifyContent: "center",
//   },
//   userInfoSection: {
//     paddingHorizontal: 30,
//     marginBottom: 25,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//   },
//   caption: {
//     fontSize: 14,
//     lineHeight: 14,
//     fontWeight: "500",
//   },
//   row: {
//     flexDirection: "row",
//     marginBottom: 10,
//   },
//   infoBoxWrapper: {
//     borderBottomColor: "#dddddd",
//     borderBottomWidth: 1,
//     borderTopColor: "#dddddd",
//     borderTopWidth: 1,
//     flexDirection: "row",
//     height: 100,
//   },
//   infoBox: {
//     width: "50%",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   menuWrapper: {
//     marginTop: 10,
//   },
//   menuItem: {
//     flexDirection: "row",
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//   },
//   menuItemText: {
//     color: "#777777",
//     marginLeft: 20,
//     fontWeight: "600",
//     fontSize: 16,
//     lineHeight: 26,
//   },
// });
