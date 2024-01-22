import React, { useState, useContext, useEffect }from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from "react-native";
import { Context } from "../../store/context";
import { useNavigation } from "@react-navigation/native";


const CartScreen = () => {
  const [currentUser, setCurrentUser] = useContext(Context);
  const [userCart, setUserCart] = useState([]);


  const clearCart = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/user/clearBizCart/${currentUser._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: currentUser._id }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setCurrentUser({
          ...currentUser,
          cart: result.cart,
        });
        setUserCart(result.cart);
        Alert.alert("Success", "Cart cleared successfully");
      } else {
        Alert.alert("Error", "Failed to clear cart");
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      Alert.alert("Error", "An error occurred while clearing the cart.");
    }
  };


    // const navigation = useNavigation();


    // const navigateToPayment = () => {
    //     navigation.navigate("Payment", {
    //         recipeData: recipeData,
    //     });
    // };

    const removeItem = async (item) => {      
        try {
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_IP}/user/updateBizCart/${currentUser._id}`,
                {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    recipeId: item._id,
                    recipeName: item.recipeName,
                    recipePrice: item.recipePrice,
                    action: "remove",
                    quantity: item.quantity,
                    preferences: item.preferences,
                }),
            }
        );
      
        if (response.ok) {
            // Handle success as needed
            const updatedCart = (await response.json()).cart
            setCurrentUser({
              ...currentUser,
              cart: updatedCart,
            });
      

            Alert.alert(
                "Removed from Cart",
                "This recipe has been removed from your cart."
            );

        } else {
            Alert.alert("Error", "Failed to update the cart.")
        }
        } catch (error) {
          console.error("Error updating the cart:", error);
          Alert.alert("Error", "An error occurred while updating the cart.")
        }
    };

    const formatPrice = (price) => {
      return `$${price.toFixed(2)}`;
    };

    const getTotalPrice = () => {
      let total = 0;
  
      if (userCart.length > 0) {
        for (let i = 0; i < userCart.length; i++) {
          const quantityTemp = userCart[i].quantity;
          const priceTemp = userCart[i].recipePrice; // Assuming recipePrice is the correct property
          total += quantityTemp * priceTemp;
        }
      }
      return formatPrice(total);
    };

    useEffect(() => {
      const fetchUserCart = async () => {
        try {
          // Assuming currentUser._id contains the user ID
          const response = await fetch(
          `${process.env.EXPO_PUBLIC_IP}/user/getUserCart/${currentUser._id}`
          );
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
          }
          
          const cart = await response.json();
          
          setUserCart(cart);
        } catch (error) {
          console.error('Error fetching user cart:', error.message);
        }
      };
  
      // Fetch user cart when the component mounts or when currentUser changes
      fetchUserCart();
    }, [currentUser]); // Dependency array ensures useEffect runs when currentUser changes
  

    // useEffect(() => {
    //   const fetchUserCart = async () => {
    //     try {
    //       // Assuming currentUser._id contains the user ID
    //       const cart = await getUserCart(currentUser._id);
    //       setUserCart(cart);
    //     } catch (error) {
    //       console.error('Error fetching user cart:', error.message);
    //     }
    //   };
    
    //   // Fetch user cart when the component mounts or when currentUser changes
    //   fetchUserCart();
    // }, [currentUser]);



    const renderCartItem = ({ item }) => (
      <View style={styles.itemContainer}>
        <View style={styles.orderContainer}>
          {/* title & status */}
          <View style={styles.titleContainer}>
            <View>
              <Text style={styles.title}>{item.recipeName}</Text>
            </View>

            <TouchableOpacity style={styles.removebutton} onPress={() => removeItem(item)}>
              <Text style={styles.removebuttonText}>Remove</Text>
            </TouchableOpacity>
          </View>

          {/* cost & quantity */}
          <View style={styles.amountContainer}>
            <View style={styles.amount}>
              <Text style={styles.amountText}>${item.recipePrice}</Text>
            </View>
      
            <View style={styles.quantity}>
              <Text style={styles.amountText}>x {item.quantity}</Text>
            </View>      
          </View>
        

          {/* preferences */}
          <View style={styles.preferencesContainer}>
            <View>
              <Text style={styles.itemDetailLeftText}>Preferences</Text>
            </View>
  
            <View style={styles.itemDetailRight}>
              <Text style={styles.itemDetailRightText}>{item.preferences}</Text>
            </View>
          </View>
        </View>
      </View>
    );

    return (
        <View style={styles.container}>
    
            <FlatList
                data={userCart}
                renderItem={renderCartItem}
                keyExtractor={(item) => item._id.toString()}
                ListEmptyComponent={
                <Text style={styles.emptyText}>No ongoing orders.</Text>
            }
            />



            <TouchableOpacity onPress={clearCart} style={styles.cleartbutton}>
              <Text style={styles.buttonText}>Clear Cart</Text>
            </TouchableOpacity>



          <View style={styles.priceContainer}>
            <View style={styles.totalPriceContainer}>
              <Text style={styles.totalPriceText}>
                  Total Price
              </Text>


              <Text style={styles.recipePriceText}>{getTotalPrice()}</Text>
            </View>
            
            <TouchableOpacity style={styles.addToCartbutton} >
              <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>

          </View>

        </View>
    );
};

export default CartScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    itemContainer: {
      backgroundColor: "white",
      padding: 16,
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    titleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    removebutton: {
      justifyContent: "center",
    },
    removebuttonText: {
      color: "#A9A9A9"
    },
    orderContainer: {
      gap: 4,
      // paddingBottom: 4,
      // paddingTop: 8,
    },
    amountContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    preferencesContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    itemDetailRight: {
      width: "50%",
    },
    amountText: {
      fontSize: 16,
      color: "black",
    },
    itemDetailLeftText: {
      fontSize: 14,
    },
    itemDetailRightText: {
      fontSize: 14,
      color: "#F97316",
      textAlign: "right",
    },

    emptyText: {
      fontSize: 16,
      textAlign: "center",
      marginTop: 50,
    },
    priceContainer: {
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 8,
      gap: 8,
      backgroundColor: "white",
    },
    totalPriceContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
    },
    addToCartbutton: {
      backgroundColor: "#ED6F21",
      padding: 8,
      borderRadius: 10,
      alignItems: "center",
      width: "100%",

    },

    cleartbutton: {
      backgroundColor: "#ED6F21",
      padding: 8,
      borderRadius: 10,
      alignItems: "center",
      margin: 10,
    },





    totalPriceText: {
      fontSize: 16,
      color: "#000",
      fontWeight: "bold",
      justifyContent: "center",

    },
    recipePriceText: {
      fontSize: 20,
      color: "#000",
      fontWeight: "bold",
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
});