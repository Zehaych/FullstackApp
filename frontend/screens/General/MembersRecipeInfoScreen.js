import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableRipple,
  Button,
  Modal,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../store/context";

export default function MembersRecipeInfoScreen({ route }) {
  const { recipeData } = route.params;
  const [username, setUsername] = useState("");

  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const reportReasons = ["Inappropriate Content", "False Information", "Offensive Language", "Health Misinformation", "Plagiarism"];
  const [additionalDetails, setAdditionalDetails] = useState('');

  const [currentUser, setCurrentUser] = useContext(Context);

  const [activeReason, setActiveReason] = useState(null);

  const handleReasonPress = (reason) => {
      setReportReason(reason);
      setActiveReason(reason);
  };

  const fetchUsername = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_IP}/user/getUserById/${recipeData.submitted_by}`
      );
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const user = await response.json();
      setUsername(user.username);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUsername();
  }, []);

  const reportRecipe = async () => {
    try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_IP}/recipe/reportRecipe/${recipeData._id}`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Include any necessary headers, like authorization tokens
            },
            body: JSON.stringify({
                userId: currentUser._id, // Assuming you have the current user's ID
                feedback: reportReason,
                additionalComment: additionalDetails
            }),
        });
        console.log(recipeData._id)
        console.log(currentUser._id)
        if (response.ok) {
            Alert.alert('Report Submitted', 'Your report has been submitted for review.');
        } else {
            Alert.alert('Report Failed', 'Failed to submit the report.');
        }
    } catch (error) {
        console.error('Error reporting recipe:', error);
        Alert.alert('Error', 'An error occurred while submitting the report.');
    }
  };


  return (
    <ScrollView style={styles.container}>
    <TouchableOpacity
        style={styles.menuItem}
        onPress={() => setReportModalVisible(true)}
    >
     <View>
     <Icon
        name="report"
        color="#FF6347"
        size={25}
        style={styles.icon}
        />
     </View>
        
    </TouchableOpacity>
      <View>
        <View style={styles.imageContainer}>
          <Image source={{ uri: recipeData.image }} style={styles.image} />
        </View>
        <Text style={styles.title}>{recipeData.name}</Text>

        <View style={styles.mainBox}>
          <View style={styles.section}>
            <Text style={styles.subTitle}>Created by: </Text>
            <Text>{username}</Text>
          </View>

          {currentUser.foodRestrictions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.subTitle}>Disclaimer: </Text>
              <Text>
                Based on your medical history, it is recommended to minimize or
                abstain from using{" "}
                <Text style={{ color: "red", fontWeight: "bold" }}>
                  {currentUser.foodRestrictions.join(", ")}
                </Text>{" "}
                when preparing the recipe. {"\n"}
              </Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.subTitle}>Ingredients: </Text>
            {recipeData.ingredients.map((ingredient, index) => (
              <Text key={index}>• {ingredient} </Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.subTitle}>Instructions: </Text>
            {recipeData.instructions.map((instruction, index) => (
              <Text key={index}>
                <Text style={styles.boldText}>Step {index + 1}:</Text>{" "}
                {instruction} {"\n"}
              </Text>
            ))}
          </View>

          <Text style={styles.subTitle}>Calories: </Text>
          <Text>{recipeData.calories}</Text>
        </View>

        <StatusBar style="auto" />
      </View>

      <Modal
          animationType="slide"
          transparent={true}
          visible={reportModalVisible}
          onRequestClose={() => setReportModalVisible(false)}
      >
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <View style={styles.reasonsContainer}>
            {reportReasons.map((reason, index) => (
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.reasonButton,
                        activeReason === reason ? styles.activeReasonButton : null
                    ]}
                    onPress={() => handleReasonPress(reason)}
                >
                    <Text 
                        style={[
                            styles.reasonButtonText, 
                            activeReason === reason ? styles.activeReasonButtonText : null
                        ]}
                    >
                        {reason}
                    </Text>
                </TouchableOpacity>
            ))}
            </View>
                <TextInput
                    style={styles.input}
                    placeholder="Additional details (optional)"
                    value={additionalDetails}
                    onChangeText={setAdditionalDetails}
                    multiline
                />
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => {
                        setReportModalVisible(false);
                        reportRecipe(); 
                    }}
                >
                    <Text style={styles.submitButtonText}>Submit Report</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondButton}
                    onPress={() => {
                        setReportModalVisible(false);
                    }}
                >
                    <Text style={styles.submitButtonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  reasonsContainer:{
    justifyContent: 'flex-start',
  },
  reasonButton: {
    padding: 10,
    marginBottom: 10, // Space between buttons
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    },
    activeReasonButton: {
        backgroundColor: '#e0e0e0', // Example background color for active button
    },
    reasonButtonText: {
        color: 'black',
        fontSize: 16,
        // Other text styling as needed
    },
    activeReasonButtonText: {
        fontWeight: 'bold', // Bold text for active button
    },
  icon: {
    marginRight: 16,
  },
  menuItem: {
    marginTop: 15,
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
  },
  menuItemText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
    width: 0,
    height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  submitButton: {
    backgroundColor: 'red', 
    padding: 8, 
    borderRadius: 5, 
    alignItems: 'center',
    justifyContent: 'center', 
    width: '80%', 
    marginBottom: 10, 
  },
  secondButton:{
    backgroundColor: 'blue', 
    padding: 8, 
    borderRadius: 5, 
    alignItems: 'center',
    justifyContent: 'center', 
    width: '80%', 
    marginBottom: 10, 
  },
  submitButtonText: {
    color: 'white', 
    fontSize: 16,     
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    marginBottom: 10,
  },
  reportButton: {
      backgroundColor: 'red',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      width: '80%',
      marginBottom: 20,
  },
  reportButtonText: {
      color: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: "#FCFCD3",
    padding: 20,

    //alignItems: "center",
  },
  //style for the image
  imageContainer: {
    flex: 1,
    justifyContent: "center", // Center the image vertically
    alignItems: "center", // Center the image horizontally
    padding: 10,
  },
  image: {
    flex: 1,
    width: 310,
    height: 310,
    resizeMode: "contain",
    borderRadius: 20,
  },
  title: {
    color: "#333333",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  subTitle: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  mainBox: {
    borderWidth: 2,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    padding: 10,
    marginBottom: 30,
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
  boldText: {
    fontWeight: "bold",
  },
});
