import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Annual, Dictionary, Perennial, Stats, TodayTask } from "../../types";

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

const savePerennialStats = (task: TodayTask, item: Perennial) => {
    AsyncStorage.getItem("stats_" + task.taskRef)
        .then((json) => {
            let stats: Stats;
            if (json) {
                stats = JSON.parse(json);
                if (stats.occurrences && stats.occurrences.length > 0) {
                    if (task.isComplete) {
                        stats.occurrences[stats.occurrences.length - 1] = task;
                        stats.lastCompleted = stats.occurrences[stats.occurrences.length - 1].startTime;
                    }
                    else {
                        stats.occurrences.pop();
                        stats.lastCompleted = undefined;
                    }
                } else {
                    stats = {
                        occurrences: task.isComplete ? [task] : [],
                        lastCompleted: task.isComplete ? task.startTime : undefined,
                        refId: task.taskRef
                    }
                }
                AsyncStorage.setItem("stats_" + task.taskRef, JSON.stringify(stats));
            }
            else {
                stats = {
                    occurrences: task.isComplete ? [task] : [],
                    lastCompleted: task.isComplete ? task.startTime : undefined,
                    refId: task.id
                }
                AsyncStorage.setItem("stats_" + task.taskRef, JSON.stringify(stats));
            }
        })
        .catch((err) => console.log("Could not find perennial stats", err));
}



const saveAnnualStats = (task: TodayTask, item: Annual) => {
    AsyncStorage.getItem("stats_" + task.taskRef)
        .then((json) => {
            let stats: Stats;
            if (json) {
                stats = JSON.parse(json);
                if (stats.occurrences && stats.occurrences.length > 0) {
                    if (task.isComplete) {
                        stats.occurrences[stats.occurrences.length - 1] = task;
                        stats.lastCompleted = stats.occurrences[stats.occurrences.length - 1].startTime;
                    }
                    else {
                        stats.occurrences.pop();
                        stats.lastCompleted = undefined;
                    }
                } else {
                    stats = {
                        occurrences: task.isComplete ? [task] : [],
                        lastCompleted: task.isComplete ? task.startTime : undefined,
                        refId: task.taskRef
                    }
                }
                AsyncStorage.setItem("stats_" + task.taskRef, JSON.stringify(stats));
            }
            else {
                stats = {
                    occurrences: task.isComplete ? [task] : [],
                    lastCompleted: task.isComplete ? task.startTime : undefined,
                    refId: task.id
                }
                AsyncStorage.setItem("stats_" + task.taskRef, JSON.stringify(stats));
            }
        })
        .catch((err) => console.log("Could not find annual stats", err));
}

export const storeItem = async (data: TodayTask) => {
    try {
        //save the todayTask
        await AsyncStorage.setItem(
            data.id,
            JSON.stringify(data)
        );
        //TODO save the historical data
        const json = await AsyncStorage.getItem(
            data.taskRef
        );
        if (json) {
            const item = JSON.parse(json);
            if (item && item.frequency) {
                savePerennialStats(data, item);
            }
            else {
                saveAnnualStats(data, item);
            }
        }
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
            newData.map(item => {
                item.startTime = moment(item.startTime);
                item.endTime = moment(item.endTime);
                return item;
            })
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