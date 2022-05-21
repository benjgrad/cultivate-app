import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dictionary, Perennial, TaskStats } from "../../types";

import uuid from "react-native-uuid";

export const storeData = async (data: Dictionary<Perennial>) => {
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
        console.log("deleted ", data.name);
        await AsyncStorage.removeItem(
            data.id
        );
        Object.values(data.subtasks).forEach(async val => {
            await removeItem(val);
        });
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

    const data = await AsyncStorage.getAllKeys();
    console.log("allKeys", data);
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

export const getStoredData = async (setPerennialData: (items: Dictionary<Perennial>) => void, existingData?: Dictionary<Perennial>) => {
    try {
        const jsonData = await AsyncStorage.getItem('perennialData');
        if (jsonData !== null) {
            // We have data!!
            if (!existingData) {
                existingData = {};
            }
            const newData = { ...JSON.parse(jsonData), ...existingData };
            setPerennialData(newData);
            console.log("got data: ", newData.length);
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

export const getAllItems = async (setPerennialData: (items: TaskStats[]) => void, existingItems: TaskStats[], onlySubtasks?: boolean) => {
    let tree: Dictionary<Perennial> = {};
    let taskList: TaskStats[] = existingItems;
    await getStoredData((items) => tree = items);
    let stack = Object.assign([] as Perennial[], Object.values(tree));

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

    setPerennialData(taskList);
}
