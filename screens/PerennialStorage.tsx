import { Alert, AsyncStorage } from "react-native";
import { Perennial, PerennialTaskStats } from "../types";

import uuid from "react-native-uuid";

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

export const getStoredData = async (setPerennialData: (items: Perennial[]) => void, existingData?: Perennial[]) => {
    try {
        const jsonData = await AsyncStorage.getItem('perennialData');
        if (jsonData !== null) {
            // We have data!!
            if (!existingData) {
                existingData = [];
            }
            const newData = [...JSON.parse(jsonData), ...existingData]
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

export const getAllItems = async (setPerennialData: (items: PerennialTaskStats[]) => void) => {
    let tree: Perennial[] = [];
    let taskList: PerennialTaskStats[] = [];
    await getStoredData((items) => tree = items);
    const stack = Object.assign([] as Perennial[], tree);

    while (stack.length > 0) {
        const item = stack.pop();
        if (item) {
            stack.concat(item.subtasks);
            //TODO get actual recurrence data
            taskList.push({
                taskId: uuid.v4().toString(),
                isComplete: false,
                numComplete: 0,
                ...item
            });
        }
    }

    setPerennialData(taskList);
}
