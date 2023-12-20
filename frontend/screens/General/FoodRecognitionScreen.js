import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import {
    TouchableRipple
} from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";

const FoodRecognitionScreen = ({ navigation }) => {

    const [image, setImage] = useState(null);

    const pickImage = async () => {
        // Ask for permission to access the camera roll
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert('Permission to access camera roll is required!');
            return;
        }

        // Launch the image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            // Set the selected image
            setImage({ uri: result.uri });
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
                    {image && <Image source={image} style={{ width: 300, height: 300, marginTop: 24 }} />}
                    <View style={styles.buttonGroup}>
                        <TouchableRipple style={styles.selectImageButton} onPress={pickImage}>
                            <View style={styles.selectImageButtonView}>
                                <Text>Select Image</Text>
                            </View>
                        </TouchableRipple>

                        <TouchableRipple style={styles.selectImageButton} onPress={pickImage}>
                            <View style={styles.selectImageButtonView}>
                                <Text>Find Food</Text>
                            </View>
                        </TouchableRipple>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
    },
    body: {
        flex: 1,
        gap: "12px",
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center"
    },
    buttonGroup: {
        flex: 1,
        flexDirection: 'row',
        gap: 16,
        paddingTop: 12,
    },
    selectImageButton: {
        borderColor: 'black'
    },
    selectImageButtonView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        padding: 8,
        borderRadius: 24,
        borderColor: '#FF6347'
        
    }
});

export default FoodRecognitionScreen