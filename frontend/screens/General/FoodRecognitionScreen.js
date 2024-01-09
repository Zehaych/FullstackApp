import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TouchableRipple } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const PAT = "51ce8aa8d91b476b8c771030d6d0a12a";
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = "clarifai";
const APP_ID = "main";
// Change these to whatever model and image URL you want to use
const MODEL_ID = "food-item-recognition";
const MODEL_VERSION_ID = "1d5fd481e0cf4826aa72ec3ff049e044";

const FoodRecognitionScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [classifiedResults, setClassifiedResults] = useState([]);
  const [base64, setBase64] = useState("");

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
    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              // url: image.uri
              base64: base64,
            },
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key " + PAT,
      },
      body: raw,
    };
    try {
      fetch(
        "https://api.clarifai.com/v2/models/" +
          MODEL_ID +
          "/versions/" +
          MODEL_VERSION_ID +
          "/outputs",
        requestOptions
      )
        .then((response) => response.text())
        .then((result) =>
          setClassifiedResults(JSON.parse(result)?.outputs?.[0]?.data?.concepts)
        )
        .catch((error) => console.log("error", error));
    } catch (err) {
      console.log(err);
    }
  };

  const handlePickImage = async () => {
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <View style={styles.header}>
          <Text style={styles.headerText}>Food Recognition</Text>
        </View>
        <View style={styles.body}>
          {image && (
            <Image
              source={image}
              style={{ width: 300, height: 300, marginTop: 24 }}
            />
          )}
          <View style={styles.buttonGroup}>
            <TouchableRipple
              style={styles.selectImageButton}
              onPress={handlePickImage}
            >
              <View style={styles.selectImageButtonView}>
                <Text>Select Image</Text>
              </View>
            </TouchableRipple>

            <TouchableRipple
              style={styles.selectImageButton}
              onPress={handleClassifyFood}
            >
              <View style={styles.selectImageButtonView}>
                <Text>Find Food</Text>
              </View>
            </TouchableRipple>
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          {classifiedResults?.map((result, index) => {
            return (
              <View style={styles.classifiedResultsView} key={index}>
                <View style={{ minWidth: "400px" }}>
                  <Text>{result.name}</Text>
                </View>
                <View>
                  <Text>{`${(Number(result.value) * 100).toFixed(2)}%`}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
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
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  body: {
    flex: 1,
    marginLeft: "12px",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonGroup: {
    flex: 1,
    flexDirection: "row",
    marginLeft: 16,
    paddingTop: 12,
  },
  selectImageButton: {
    borderColor: "black",
  },
  selectImageButtonView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
    borderWidth: 1,
    padding: 8,
    borderRadius: 24,
    borderColor: "#FF6347",
  },
  classifiedResultsView: {
    marginTop: 12,
    marginLeft: 48,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default FoodRecognitionScreen;
