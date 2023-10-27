// import { useNavigation } from '@react-navigation/native';
// import {
//     Avatar,
//     Title,
//     Caption,
//     TouchableRipple,
//     Divider,
//   } from "react-native-paper";
// import React from 'react';
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import { View, Text, StyleSheet } from 'react-native';
// import { useContext } from "react";
// import { Context } from "../store/context";

// const AdminScreen = () => {
//     const navigation = useNavigation();
//     const [currentUser, setCurrentUser] = useContext(Context);

//     const onLogOutPressed = () => {
//         Alert.alert("Log Out", "Are you sure you want to log out?", [
//           { text: "No", onPress: () => {} },
//           {
//             text: "Yes",
//             onPress: () => {
//               AsyncStorage.removeItem("userId");
//               setCurrentUser(null);
//               navigation.navigate("LogInScreen");
//             },
//           },
//         ]);
//       };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>{currentUser.username}</Text>
//             <Text>Welcome to the Admin Screen</Text>
//             {/* Add more components or information specific to business partners here */}


//             <TouchableRipple onPress={onLogOutPressed}>
//             <View style={styles.menuItem}>
//             <Icon name="exit-to-app" color="#FF6347" size={25} />
//             <Text style={styles.menuItemText}>Log Out</Text>
//             </View>
//             </TouchableRipple>
//         </View>

        
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#F5FCFF',
//     },
//     title: {
//         fontSize: 20,
//         textAlign: 'center',
//         margin: 10,
//     },
// });

// export default AdminScreen;

import { useNavigation } from '@react-navigation/native';
import {
    Avatar,
    Title,
    Caption,
    TouchableRipple,
    Divider,
    TextInput,
    Button,
} from "react-native-paper";
import React, { useState, useContext } from 'react';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, Text, StyleSheet, Alert, AsyncStorage } from 'react-native';
import { Context } from "../store/context";

const AdminScreen = () => {
    const navigation = useNavigation();
    const [currentUser, setCurrentUser] = useContext(Context);
    const [totalCalories, setTotalCalories] = useState('');

    const onLogOutPressed = () => {
        Alert.alert("Log Out", "Are you sure you want to log out?", [
          { text: "No", onPress: () => {} },
          {
            text: "Yes",
            onPress: async () => {
              // await AsyncStorage.removeItem("userId");
              // setCurrentUser(null);
              navigation.navigate("LogInScreen");
            },
          },
        ]);
    };

    const handleSubmit = async () => {
      try {
          console.log(currentUser._id);
          const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/user/postCalories/${currentUser._id}`, {
              method: 'PUT',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  total_calories: totalCalories
              })
          });
  
          const responseData = await response.text();
          console.log(currentUser);
          console.log(responseData);
          if (responseData === 'Updated successfully') {
              Alert.alert('Calories updated!');
          } else {
              Alert.alert('Failed to update calories.');
          }
      } catch (error) {
          Alert.alert('An error occurred: ' + error.message);
      }
  };
  

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{currentUser.username}</Text>
            <Text>Welcome to the Admin Screen</Text>

            {/* Calorie Input */}
            <TextInput
                label='Total Calories'
                value={totalCalories}
                onChangeText={text => setTotalCalories(text)}
                keyboardType='numeric'
                mode='outlined'
                style={{ width: 200, marginTop: 20 }}
            />
            <Button
                mode='contained'
                onPress={handleSubmit}
                style={{ marginTop: 10 }}
            >
                Update Calories
            </Button>

            <TouchableRipple onPress={onLogOutPressed} style={{ marginTop: 20 }}>
                <View style={styles.menuItem}>
                    <Icon name="exit-to-app" color="#FF6347" size={25} />
                    <Text style={styles.menuItemText}>Log Out</Text>
                </View>
            </TouchableRipple>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    menuItem: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    menuItemText: {
        marginLeft: 10,
        fontWeight: '500',
        fontSize: 16,
    }
});

export default AdminScreen;
