import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Annual, TaskStats } from "../../types";

import uuid from "react-native-uuid";

export const storeData = async (data: Annual[]) => {
    try {
        await AsyncStorage.setItem(
            'annualData',
            JSON.stringify(data)
        );
        console.log('saved data');
    } catch (error) {
        // Error saving data
        console.log(error);
        Alert.alert(
            "Error",
            "We had trouble saving your Annuals. Please try again.",
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        );
    }
};


export const storeItem = async (data: Annual) => {
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
            "We had trouble saving your Annuals. Please try again.",
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        );
    }
};

export const removeItem = async (data: Annual) => {
    try {
        await AsyncStorage.removeItem(
            data.id
        );
    } catch (error) {
        // Error saving data
        console.log(error);
        Alert.alert(
            "Error",
            "We had trouble deleting your Annual. Please try again.",
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        );
    }
}

export const getStoredItem = async (id: string, setAnnualData: ((item: Annual) => void)) => {
    try {
        const jsonData = await AsyncStorage.getItem(id);
        if (jsonData !== null) {
            // We have data!!
            setAnnualData(JSON.parse(jsonData));
        }
    } catch (error) {
        Alert.alert(
            "No data found",
            "We can't find any any Annuals saved to this device.",
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        )
    }
}

export const getStoredData = async (setAnnualData: (items: Annual[]) => void, existingData?: Annual[]) => {
    try {
        const jsonData = await AsyncStorage.getItem('annualData');
        if (jsonData !== null) {
            // We have data!!
            if (!existingData) {
                existingData = [];
            }
            const newData = [...JSON.parse(jsonData), ...existingData]
            setAnnualData(newData);
            console.log("got data: ", newData.length);
        }
    } catch (error) {
        Alert.alert(
            "No data found",
            "We can't find any any Annuals saved to this device.",
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        )
    }
}

export const getAllItems = async (setAnnualData: (items: TaskStats[]) => void, onlySubtasks?: boolean) => {
    let tree: Annual[] = [];
    let taskList: TaskStats[] = [];
    await getStoredData((items) => tree = items);
    let stack = Object.assign([] as Annual[], tree);

    while (stack.length > 0) {
        const item = stack.pop();
        if (item) {
            stack = stack.concat(item.subtasks);
            //TODO get actual historical data
            if (!onlySubtasks || item.subtasks.length == 0) {
                taskList.push({
                    taskId: uuid.v4().toString(),
                    isComplete: false,
                    numComplete: 0,
                    ...item
                });
            }
        }
    }

    setAnnualData(taskList);
}
