import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Dropdown } from 'react-native-element-dropdown';

const data = [
    { label: 'Breakfast', value: 'bf' },
    { label: 'Lunch', value: 'lunch' },
    { label: 'Dinner', value: 'din' },
    // { label: 'Snacks', value: '4' },
    // { label: 'Others', value: '5' },
];

const DropdownMenu = (props) => {
    const {meal, setMeal} = props
    
    return (
        <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            data={data}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select a meal"
            value={meal}
            onChange={item => {
                setMeal(item.value);
            }}
        />
    );
}

const ProgressScreenv2 = () => {
    const [itemName, setItemName] = useState("")
    const [progressDate, setProgressDate] = useState(new Date())
    const [progressMeal, setProgressMeal] = useState("")

    const handleAddItemButton = () => {
        console.log(itemName);
        console.log(progressDate);
        console.log(progressMeal)
    }

    const handleProgressDate = (event , selectedDate) => {
        const currentDate = selectedDate;
        if (event.type === "set") {
            setProgressDate(currentDate)
        }
    }

    return (
        <ScrollView style={styles.scrollContainer}>
            <SafeAreaView style={styles.container}>
                <View style={styles.progressContainer}>

                    <View style={styles.addProgressContainer}>
                        {/* <Text style={[styles.boldText, styles.titleTextColor]}>Breakfast</Text> */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.boldText}>Choose meal to add</Text>
                            <DropdownMenu meal={progressMeal} setMeal={setProgressMeal}/>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.boldText}>Item Name</Text>
                            <TextInput
                            style={styles.textInput}
                            value={itemName}
                            onChangeText={(text) => setItemName(text)}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.boldText}>Date</Text>
                            <DateTimePicker style={styles.dateTimePicker} mode="date" value={progressDate} onChange={handleProgressDate} />
                        </View>
                        <View style={styles.inputContainer}>
                            <TouchableOpacity style={styles.addItemButton} onPress={handleAddItemButton}>
                                <Text style={styles.buttonText}>Add Item</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    //containers
    scrollContainer: {
        flex: 1,
        backgroundColor: "#F2F2F2",
    },
    container: {
        flex: 1,
        backgroundColor: "#F2F2F2",
        alignItems: "center",
        padding: 16,
    },
    progressContainer: {
        padding: 16,
        width: "100%",
    },
    addProgressContainer: {
        display: "flex",
        width: "100%",
        padding: 16,
        backgroundColor: "#FFF",
        flexDirection: "column",
        alignItems: "start",
        borderRadius: 16,
        gap: 16,
    },
    inputContainer: {
        display: "flex",
        alignItems: "start",
        flexDirection: "column",
        gap: 8,
        width: '100%',
    },
    textInput: {
        borderColor: "#C6C6CD",
        borderWidth: 1,
        borderRadius: 4,
        padding: 8,
        width: "100%"
    },
    // dateTimePicker: {
    //     alignItems: "start",
    //     borderColor: "#C6C6CD",
    //     borderWidth: 1,
    //     borderRadius: 4,
    //     padding: 8,
    //     width: "100%",
    //     opacity: "100%"
    // },
    addItemButton: {
        // display: 'flex',
        // flex: 1,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 8,
        paddingBottom: 8,
        backgroundColor: '#ED6F21',
        width: '100%',
        height: 36
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    boldText: {
        fontWeight: 'bold'
    },
    titleTextColor: {
        color: "#ED6F21",
    },
    dropdown: {
        borderColor: "#C6C6CD",
        borderWidth: 1,
        paddingLeft: 8,
        borderRadius: 4,
        width: "100%"
    }
});

export default ProgressScreenv2;