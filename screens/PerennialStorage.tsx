import { Alert, AsyncStorage } from "react-native";
import { Perennial } from "../types";

export const storeData = async (data: Perennial[]) => {
    try {
        await AsyncStorage.setItem(
            'perennialData',
            JSON.stringify(data)
        );
        console.log('saved data');
    } catch (error) {
        // Error saving data
        console.log(error);
        Alert.alert(
            "Error",
            "We had trouble saving your Perennials. Please try again.",
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        );
    }
};


export const storeItem = async (data: Perennial) => {
    try {
        await AsyncStorage.setItem(
            data.id,
            JSON.stringify(data)
        );
    } catch (error) {
        // Error saving data
        console.log(error);
        Alert.alert(
            "Error",
            "We had trouble saving your Perennials. Please try again.",
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        );
    }
};

export const removeItem = async (data: Perennial) => {
    try {
        await AsyncStorage.removeItem(
            data.id
        );
    } catch (error) {
        // Error saving data
        console.log(error);
        Alert.alert(
            "Error",
            "We had trouble deleting your Perennial. Please try again.",
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        );
    }
}

export const getStoredItem = async (id: string, setPerennialData: ((item: Perennial) => void)) => {
    try {
        const jsonData = await AsyncStorage.getItem(id);
        if (jsonData !== null) {
            // We have data!!
            setPerennialData(JSON.parse(jsonData));
        }
    } catch (error) {
        Alert.alert(
            "No data found",
            "We can't find any any Perennials saved to this device.",
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        )
    }
}

export const getStoredData = async (setPerennialData: (item: Perennial[]) => void, existingData?: Perennial[]) => {
    try {
        const jsonData = await AsyncStorage.getItem('perennialData');
        if (jsonData !== null) {
            // We have data!!
            if (!existingData) {
                existingData = [];
            }
            setPerennialData([...JSON.parse(jsonData), ...existingData]);
            console.log("got data");
        }
    } catch (error) {
        Alert.alert(
            "No data found",
            "We can't find any any Perennials saved to this device.",
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        )
    }
}
