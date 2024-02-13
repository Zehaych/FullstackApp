import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import * as Progress from 'react-native-progress';

import { SafeAreaView } from "react-native-safe-area-context";

const PAT = "51ce8aa8d91b476b8c771030d6d0a12a";
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = "clarifai";
const APP_ID = "main";
// Change these to whatever model and image URL you want to use
const MODEL_ID = "food-item-recognition";
const MODEL_VERSION_ID = "1d5fd481e0cf4826aa72ec3ff049e044";

// Open AI

const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${process.env.EXPO_PUBLIC_OPEN_AI}`
};

const FoodRecognitionScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [isClicked, setIsClicked] = useState(false);

  const [classifiedResults, setClassifiedResults] = useState(null);
  const [base64, setBase64] = useState("");

  const handleImageUploadClick = () => {
    setIsClicked(!isClicked);

  };

  const handleConvertImageToBase64 = async (imageUri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setBase64(base64);
    } catch (error) {
      console.error("Error converting image to base64:", error);
    }
  };

  const handleClassifyFood = async () => {
    setClassifiedResults([])
    const payload = {
      "model": "gpt-4-vision-preview",
      "messages": [
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": "Estimate the type of food in the image and a rough estimate of the calories only. Make it concise and formatted. Do not add filler words. Provide the data in a json, where the key is the food, and the value is a numeric average of the estimate."
            },
            {
              "type": "image_url",
              "image_url": {
                "url": `data:image/jpeg;base64,${base64}`
              }
            }
          ]
        }
      ],
      "max_tokens": 1500,
    };

    setIsLoading(true)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    })

    const responseData = await response.json()

    try {

      const result = responseData?.["choices"]?.[0]?.["message"]?.["content"]
      let startIndex = result?.indexOf('{');
      let endIndex = result?.lastIndexOf('}');
      let formattedResult = result.substring(startIndex, endIndex + 1).trim();
      setIsLoading(false)
      setClassifiedResults(JSON.parse(formattedResult))
      console.log(JSON.parse(formattedResult))
    } catch (error) {
      console.log(error)
    }
  }


  const handlePickImage = async () => {
    handleImageUploadClick()
    // Ask for permission to access the camera roll
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Permission to access camera roll is required!");
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Set the selected image
      setImage({ uri: result.assets[0].uri });
      handleConvertImageToBase64(result.assets[0].uri);
    }
  };

  const imageDimensions = Dimensions.get('window').width * 0.8

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Food Recognition</Text>
      </View> */}
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.body}>
            {(
              <TouchableOpacity onPress={handlePickImage}>
                <Image
                  source={image || require("../../assets/upload_food.png")}
                  style={[{ width: imageDimensions, height: imageDimensions, borderRadius: 24 }, isClicked && styles.clickedImage]}
                />
              </TouchableOpacity>
            )}
            {image && <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.selectImageButton}
                onPress={handleClassifyFood}
              >
                <Text style={styles.selectImageButtonText}>Calculate My Food!</Text>
              </TouchableOpacity>
            </View>}

            {
              isLoading && <Progress.Circle size={50} indeterminate={true} />
            }

            {classifiedResults && <View style={{ flex: 1, justifyContent: "space-between", width: "100%" }}>
              <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                <View>
                  <Text style={styles.resultsHeader}>Food</Text>
                </View>
                <View>
                  <Text style={styles.resultsHeader} >Calories</Text>
                </View>
              </View>
              {Object.keys(classifiedResults).map((resultKey, index) => {
                return (
                  <View style={styles.classifiedResultsView} key={index}>
                    <View>
                      <Text style={styles.resultText}>{resultKey}</Text>
                    </View>
                    <View>
                      <Text style={styles.resultText}>{classifiedResults?.[resultKey]}</Text>
                    </View>
                  </View>
                );
              })}
            </View>}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: "#F2F2F2",
  },
  // header: {
  //   // padding: 20,
  //   maxHeight: 50,
  //   borderBottomWidth: 1,
  //   backgroundColor: "#FFF",
  //   borderBottomColor: "#ccc",
  //   flex: 1,
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   width: "100%",
  // },
  // headerText: {
  //   fontSize: 17,
  //   fontWeight: "bold",
  // },
  body: {
    flex: 1,
    alignItems: "center",
    borderRadius: 20,
    padding: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 12,
  },
  buttonGroup: {
    flex: 1,
    flexDirection: "row",
  },
  classifiedResultsView: {
    marginTop: 12,
    // marginLeft: 48,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  selectImageButton: {
    backgroundColor: "#ED6F21",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    width: Dimensions.get('window').width * 0.8
  },
  selectImageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultText: {
    fontSize: 14
  },
  resultsHeader: {
    fontWeight: "bold", fontSize: 17
  }
});

export default FoodRecognitionScreen;
