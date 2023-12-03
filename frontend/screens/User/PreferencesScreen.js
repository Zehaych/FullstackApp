// import { StatusBar } from "expo-status-bar";
// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   Button,
// } from "react-native";
// import React, { useState, useEffect, useContext } from "react";
// import Icon from "react-native-vector-icons/FontAwesome";
// import { Context } from "../../store/context";

// export default function PreferencesScreen({ route, navigation }) {
//   const { recipeData } = route.params;
//   const [username, setUsername] = useState("");

//   const [currentUser, setCurrentUser] = useContext(Context);

//   const [quantity, setQuantity] = useState(1);
//   const [totalPrice, setTotalPrice] = useState(recipeData.price);

//   const incrementQuantity = () => {
//     const newQuantity = quantity + 1;
//     setQuantity(newQuantity);
//     setTotalPrice(newQuantity * recipeData.price);
//   };

//   const decrementQuantity = () => {
//     if (quantity > 1) {
//       const newQuantity = quantity - 1;
//       setQuantity(newQuantity);
//       setTotalPrice(newQuantity * recipeData.price);
//     }
//   };

//   const navigateToPayment = () => {
//     navigation.navigate("Payment");
//   };

//   const navigateToPreferences = () => {
//     navigation.navigate("Preferences");
//   };

//   const formatPrice = (price) => {
//     return `$${price.toFixed(2)}`;
//   };

//   const getTotalPrice = () => {
//     return formatPrice(totalPrice);
//   };

//   //   const url = `${process.env.EXPO_PUBLIC_IP}/user/getUserById/${recipeData.submitted_by}`;

//   const fetchUsername = async () => {
//     try {
//       const response = await fetch(
//         `${process.env.EXPO_PUBLIC_IP}/user/getUserById/${recipeData.submitted_by}`
//       );
//       if (!response.ok) {
//         throw new Error(`Network response was not ok: ${response.status}`);
//       }
//       const user = await response.json();
//       setUsername(user.username);
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchUsername();
//   }, []);

//   const [orderPreferences, setOrderPreferences] = useState([]);
//   const [currentOrder, setCurrentOrder] = useState({
//     quantity: 1,
//     preferences: "",
//   });

//   const addOrderToCart = () => {
//     const order = { ...currentOrder, recipeData };
//     setOrderPreferences([...orderPreferences, order]);
//     setCurrentOrder({ quantity: 1, preferences: "" });
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View>
//         <View style={styles.imageContainer}>
//           <Image source={{ uri: recipeData.image }} style={styles.image} />
//         </View>
//         <Text style={styles.title}>{recipeData.name}</Text>

//         {currentUser.foodRestrictions.length > 0 && (
//           <View>
//             <Text style={styles.subTitle}>Disclaimer: </Text>
//             <Text>
//               Based on your medical history, it is recommended to minimize or
//               abstain from using{" "}
//               <Text style={{ color: "red", fontWeight: "bold" }}>
//                 {currentUser.foodRestrictions.join(", ")}
//               </Text>{" "}
//               when ordering the recipe. {"\n"}
//             </Text>
//           </View>
//         )}

//         {/* <Text style={styles.subTitle}>Price: </Text>
//         <Text>{formatPrice(recipeData.price)}</Text> */}

//         <View style={styles.preferencesContainer}>
//           <Text style={styles.subTitle}>Preferences:</Text>
//           <TextInput
//             style={styles.preferencesInput}
//             placeholder="Specify preferences for this order..."
//             value={currentOrder.preferences}
//             onChangeText={(text) =>
//               setCurrentOrder({ ...currentOrder, preferences: text })
//             }
//           />
//         </View>

//         {/* <TouchableOpacity style={styles.button} onPress={addOrderToCart}>
//           <Text style={styles.buttonText}>Add to Cart</Text>
//         </TouchableOpacity> */}
//         <View style={styles.quantityContainer}>
//           <Text style={styles.quantityLabel}>Quantity:</Text>
//           <TouchableOpacity
//             style={styles.quantityButton}
//             onPress={decrementQuantity}
//           >
//             <Icon name="minus" size={20} color="#0066cc" />
//           </TouchableOpacity>
//           <Text style={styles.quantity}>{quantity}</Text>
//           <TouchableOpacity
//             style={styles.quantityButton}
//             onPress={incrementQuantity}
//           >
//             <Icon name="plus" size={20} color="#0066cc" />
//           </TouchableOpacity>
//         </View>
//         <Text style={styles.totalPrice}>Total Price: {getTotalPrice()}</Text>

//         <StatusBar style="auto" />
//       </View>

//       <TouchableOpacity style={styles.button} onPress={addOrderToCart}>
//         <Text style={styles.buttonText}>Add to Cart</Text>
//       </TouchableOpacity>

//       {/* <TouchableOpacity style={styles.button} onPress={navigateToPayment}>
//         <Text style={styles.buttonText}>Order now</Text>
//       </TouchableOpacity> */}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FCFCD3",
//     padding: 20,
//   },
//   imageContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 10,
//   },
//   image: {
//     flex: 1,
//     width: 400,
//     height: 400,
//     resizeMode: "contain",
//   },
//   title: {
//     color: "gold",
//     fontSize: 30,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   subTitle: {
//     color: "black",
//     fontSize: 20,
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
//   quantityContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   quantityLabel: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginRight: 10,
//   },
//   quantityButton: {
//     backgroundColor: "#ddd",
//     borderRadius: 5,
//     padding: 5,
//   },
//   quantity: {
//     fontSize: 20,
//     marginHorizontal: 10,
//   },
//   totalPrice: {
//     fontSize: 18,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginTop: 10,
//   },
// });
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { Context } from "../../store/context";

export default function PreferencesScreen({ route, navigation }) {
  const { recipeData } = route.params;
  const [username, setUsername] = useState("");

  const [currentUser, setCurrentUser] = useContext(Context);

  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(recipeData.price);

  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    setTotalPrice(newQuantity * recipeData.price);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      setTotalPrice(newQuantity * recipeData.price);
    }
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const getTotalPrice = () => {
    return formatPrice(totalPrice);
  };

  const [orderPreferences, setOrderPreferences] = useState([]);
  const [currentOrder, setCurrentOrder] = useState({
    quantity: 1,
    preferences: "",
  });

  const addOrderToCart = () => {
    const order = { ...currentOrder, recipeData };
    setOrderPreferences([...orderPreferences, order]);
    setCurrentOrder({ quantity: 1, preferences: "" });
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipeData.image }} style={styles.image} />
        </View>
        <Text style={styles.title}>{recipeData.name}</Text>

        <View style={styles.mainBox}>
          {currentUser.foodRestrictions.length > 0 && (
            <View>
              <View style={styles.section}>
                <Text style={styles.subTitle}>Disclaimer: </Text>
                <Text>
                  Based on your medical history, it is recommended to minimize
                  or abstain from using{" "}
                  <Text style={{ color: "red", fontWeight: "bold" }}>
                    {currentUser.foodRestrictions.join(", ")}
                  </Text>{" "}
                  when ordering the recipe. {"\n"}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.preferencesContainer}>
            <Text style={styles.subTitle}>Preferences:</Text>
            <TextInput
              style={styles.preferencesInput}
              placeholder="Specify preferences for your orders..."
              value={currentOrder.preferences}
              onChangeText={(text) =>
                setCurrentOrder({ ...currentOrder, preferences: text })
              }
              multiline={true}
              numberOfLines={4}
            />
          </View>
        </View>

        <View style={styles.mainBox}>
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={decrementQuantity}
            >
              <Icon name="minus" size={20} color="#0066cc" />
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={incrementQuantity}
            >
              <Icon name="plus" size={20} color="#0066cc" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.totalPrice}>Total Price: {getTotalPrice()}</Text>
        {/* </View> */}

        <StatusBar style="auto" />
      </View>

      <TouchableOpacity style={styles.button} onPress={addOrderToCart}>
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCD3",
    padding: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  image: {
    flex: 1,
    width: 310, // Reduced width
    height: 310, // Reduced height
    resizeMode: "contain",
    borderRadius: 20,
  },
  title: {
    color: "#333333",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subTitle: {
    color: "black",
    fontSize: 20,
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
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  quantityButton: {
    backgroundColor: "#ddd",
    borderRadius: 5,
    padding: 5,
  },
  quantity: {
    fontSize: 20,
    marginHorizontal: 10,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  preferencesContainer: {
    marginBottom: 20,
  },
  preferencesInput: {
    height: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  mainBox: {
    borderWidth: 2,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    paddingBottom: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    paddingBottom: 10,
  },
});

// import { StatusBar } from "expo-status-bar";
// import {
//   StyleSheet,
//   Text,
//   View,
//   Image,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
// } from "react-native";
// import React, { useState, useContext } from "react";
// import Icon from "react-native-vector-icons/FontAwesome";
// import { Context } from "../../store/context";

// export default function PreferencesScreen({ route, navigation }) {
//   const { recipeData } = route.params;
//   const [currentUser] = useContext(Context);

//   const [quantity, setQuantity] = useState(1);
//   const [totalPrice, setTotalPrice] = useState(recipeData.price);

//   const incrementQuantity = () => {
//     const newQuantity = quantity + 1;
//     setQuantity(newQuantity);
//     setTotalPrice(newQuantity * recipeData.price);
//   };

//   const decrementQuantity = () => {
//     if (quantity > 1) {
//       const newQuantity = quantity - 1;
//       setQuantity(newQuantity);
//       setTotalPrice(newQuantity * recipeData.price);
//     }
//   };

//   const formatPrice = (price) => {
//     return `$${price.toFixed(2)}`;
//   };

//   const getTotalPrice = () => {
//     return formatPrice(totalPrice);
//   };

//   const [orderPreferences, setOrderPreferences] = useState([]);
//   const [currentOrder, setCurrentOrder] = useState({
//     quantity: 1,
//     preferences: "",
//   });

//   const addOrderToCart = () => {
//     const order = { ...currentOrder, recipeData };
//     setOrderPreferences([...orderPreferences, order]);
//     setCurrentOrder({ quantity: 1, preferences: "" });
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View>
//         <View style={styles.imageContainer}>
//           <Image source={{ uri: recipeData.image }} style={styles.image} />
//         </View>
//         <Text style={styles.title}>{recipeData.name}</Text>

//         {currentUser.foodRestrictions.length > 0 && (
//           <View style={styles.disclaimer}>
//             <Text style={styles.subTitle}>Disclaimer:</Text>
//             <Text style={styles.disclaimerText}>
//               Based on your medical history, it is recommended to minimize or
//               abstain from using{" "}
//               <Text style={styles.restrictions}>
//                 {currentUser.foodRestrictions.join(", ")}
//               </Text>{" "}
//               when ordering the recipe.
//             </Text>
//           </View>
//         )}

//         <View style={styles.preferencesContainer}>
//           <Text style={styles.subTitle}>Preferences:</Text>
//           <TextInput
//             style={styles.preferencesInput}
//             placeholder="Specify preferences for this order..."
//             value={currentOrder.preferences}
//             onChangeText={(text) =>
//               setCurrentOrder({ ...currentOrder, preferences: text })
//             }
//             multiline={true}
//             numberOfLines={4}
//           />
//         </View>

//         <View style={styles.quantityContainer}>
//           <Text style={styles.quantityLabel}>Quantity:</Text>
//           <TouchableOpacity
//             style={styles.quantityButton}
//             onPress={decrementQuantity}
//           >
//             <Icon name="minus" size={20} color="#0066cc" />
//           </TouchableOpacity>
//           <Text style={styles.quantity}>{quantity}</Text>
//           <TouchableOpacity
//             style={styles.quantityButton}
//             onPress={incrementQuantity}
//           >
//             <Icon name="plus" size={20} color="#0066cc" />
//           </TouchableOpacity>
//         </View>
//         <Text style={styles.totalPrice}>Total Price: {getTotalPrice()}</Text>

//         <TouchableOpacity style={styles.button} onPress={addOrderToCart}>
//           <Text style={styles.buttonText}>Add to Cart</Text>
//         </TouchableOpacity>

//         <StatusBar style="auto" />
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FCFCD3",
//     padding: 20,
//   },
//   imageContainer: {
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   image: {
//     width: 300,
//     height: 300,
//     resizeMode: "contain",
//     borderRadius: 10,
//   },
//   title: {
//     color: "gold",
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   subTitle: {
//     color: "black",
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   disclaimer: {
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 10,
//     borderRadius: 8,
//   },
//   disclaimerText: {
//     color: "#333",
//   },
//   restrictions: {
//     color: "red",
//     fontWeight: "bold",
//   },
//   preferencesContainer: {
//     marginBottom: 20,
//   },
//   preferencesInput: {
//     height: 100,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     padding: 10,
//   },
//   quantityContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 10,
//   },
//   quantityLabel: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginRight: 10,
//   },
//   quantityButton: {
//     backgroundColor: "#ddd",
//     borderRadius: 5,
//     padding: 5,
//   },
//   quantity: {
//     fontSize: 20,
//     marginHorizontal: 10,
//   },
//   totalPrice: {
//     fontSize: 18,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginTop: 10,
//   },
//   button: {
//     backgroundColor: "#0066cc",
//     padding: 12,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 20,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });
