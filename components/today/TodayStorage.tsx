import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TodayTask } from "../../types";

import uuid from "react-native-uuid";
import moment from "moment";

export const storeData = async (data: TodayTask[]) => {
    try {
        await AsyncStorage.setItem(
            moment().format('YYYYMMMMDD'),
            JSON.stringify(data)
        );
        console.log('saved data');
    } catch (error) {
        // Error saving data
        console.log(error);
        Alert.alert(
            "Error",
            "We had trouble saving your tasks. Please try again.",
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        );
    }
};


export const storeItem = async (data: TodayTask) => {
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
            "We had trouble saving your taks. Please try again.",
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        );
    }
};

export const removeItem = async (data: TodayTask) => {
    try {
        await AsyncStorage.removeItem(
            data.id
        );
    } catch (error) {
        // Error saving data
        console.log(error);
        Alert.alert(
            "Error",
            "We had trouble deleting your task. Please try again.",
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        );
    }
}

export const getStoredItem = async (id: string, setTodayTaskData: ((item: TodayTask) => void)) => {
    try {
        const jsonData = await AsyncStorage.getItem(id);
        if (jsonData !== null) {
            // We have data!!
            setTodayTaskData(JSON.parse(jsonData));
        }
    } catch (error) {
        Alert.alert(
            "No data found",
            "We can't find any any tasks saved to this device.",
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        )
    }
}

export const getStoredData = async (setTodayTaskData: (items: TodayTask[]) => void, existingData?: TodayTask[]) => {
    try {
        const jsonData = await AsyncStorage.getItem(moment().format('YYYYMMMMDD'));
        if (jsonData !== null) {
            // We have data!!
            if (!existingData) {
                existingData = [];
            }
            const newData = [...JSON.parse(jsonData), ...existingData]
            console.log(newData.map(item => {
                item.startTime = moment(item.startTime);
                item.endTime = moment(item.endTime);
                return item;
            }))
            setTodayTaskData(newData);
            console.log("got data: ", newData.length);
        }
    } catch (error) {
        Alert.alert(
            "What will you do today?",
            "Add some items to start cultivating your interests",
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        )
    }
}