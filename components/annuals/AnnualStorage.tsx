import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Annual, AnnualEvent, Dictionary, newTodayTask, TodayTask } from "../../types";
import * as Calendar from 'expo-calendar';

import uuid from "react-native-uuid";
import moment from "moment";

export const storeData = async (data: Dictionary<AnnualEvent>) => {
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
            "We had trouble deleting your Annual. Please try again.",
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        );
    }
}

export const getStoredItem = async (id: string, setAnnualData: ((item: Annual | AnnualEvent) => void)) => {
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

const formatDeserializedAnnual = (data: any) => {
    data.dueDate = moment(data.dueDate);
    let subtasks = {} as Dictionary<Annual>;
    Object.keys(data.subtasks).forEach((key) => subtasks[key] = formatDeserializedAnnual(data.subtasks[key]));
    data.subtasks = subtasks;
    return data as Annual;
}

const formatDeserializedEvent = (data: any) => {
    data.startTime = moment(data.startTime);
    data.endTime = moment(data.endTime);
    data.dueDate = moment(data.dueDate);
    let subtasks = {} as Dictionary<Annual>;
    Object.keys(data.subtasks).forEach((key) => subtasks[key] = formatDeserializedAnnual(data.subtasks[key]));
    data.subtasks = subtasks;
    return data as AnnualEvent;
}

export const getScheduledData = async (currentDate: moment.Moment, setAnnualData: (items: TodayTask[]) => void, existingData: TodayTask[]) => {
    const transform = (annuals: Dictionary<AnnualEvent>) => {
        let todayDict = {} as Dictionary<TodayTask>;
        if (existingData) {
            existingData.forEach((task) => {
                todayDict[task.taskRef] = task;
            });
        }
        else {
            existingData = [];
        }
        Object.values(annuals).forEach((annual) => {
            if (annual.scheduled && !todayDict[annual.id]) {
                let newItem = newTodayTask();
                newItem.name = annual.name;
                newItem.taskRef = annual.id;
                newItem.startTime = annual.startTime;
                newItem.endTime = annual.endTime;
                existingData.push(newItem);
            }
        });
        setAnnualData(existingData);
    };
    getStoredData(transform, currentDate, currentDate.clone().add(1, 'd'));
}

export const getStoredData = async (setAnnualData: (items: Dictionary<AnnualEvent>) => void, startDate?: moment.Moment, endDate?: moment.Moment) => {
    const calendars = await getCalendars(true);
    let items: Dictionary<AnnualEvent> = {};
    let intervalBegin = moment();
    if (startDate) {
        intervalBegin = startDate;
    }
    let endInterval = intervalBegin.clone().add(100, 'd');
    if (endDate) {
        endInterval = endDate;
    }
    intervalBegin.set({ h: 0, m: 0, s: 0, ms: 0 });
    endInterval.set({ h: 0, m: 0, s: 0, ms: 0 });
    if (calendars && calendars.length > 0) {
        const events = await Calendar.getEventsAsync(calendars.map(cal => cal.id),
            intervalBegin
                .toDate(),
            endInterval.toDate());
        events.forEach(event => {
            const item = {
                name: event.title,
                id: (event.instanceId ?? event.id) + event.startDate,
                dueDate: moment(event.startDate),
                startTime: moment(event.startDate),
                endTime: moment(event.endDate),
                prepTime: 0,
                subtasks: {},
                parent: ""
            } as AnnualEvent;
            items[item.id] = item;
            return item;
        });
        try {
            const jsonData = await AsyncStorage.getItem('annualData');
            if (jsonData != null) {
                // We have data!!
                const savedData = JSON.parse(jsonData);
                if (!!savedData)
                    Object.values(savedData).forEach(item => {
                        let savedItem = formatDeserializedEvent(item);
                        if (items[savedItem.id]) {
                            savedItem.name = items[savedItem.id].name;
                            savedItem.startTime = items[savedItem.id].startTime;
                            savedItem.endTime = items[savedItem.id].endTime;
                            savedItem.dueDate = savedItem.startTime;
                            items[savedItem.id] = { ...savedItem }
                        }
                    });
                console.log("got annual data: ", Object.values(items).length);

                setAnnualData(items);
            }
            else {
                setAnnualData(items);
            }
        } catch (error) {
            console.log(error);
            Alert.alert(
                "No data found",
                "We can't find any any Annuals saved to this device.",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed", error) }
                ]
            )
        }

    }
    else {
        setAnnualData({});
    }

}

export const getCalendars: (onlyVisible?: boolean) => Promise<Calendar.Calendar[]> = async (onlyVisible: boolean = false) => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'granted') {
        let calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const jsonData = await AsyncStorage.getItem('calendars');

        if (!jsonData) {
            return calendars.map(cal => {
                cal.isVisible = true;
                return cal;
            });
        }

        const displayCalendars = JSON.parse(jsonData);
        calendars = calendars.map((value) => {
            value.isVisible = displayCalendars[value.id]?.isVisible;
            return value;
        })

        if (onlyVisible) {
            return calendars.filter(calendar => calendar.isVisible);
        }
        else {
            return calendars;
        }
    }
    return [];
}


export const saveSelectedCalendars = async (data: Dictionary<Calendar.Calendar>) => {
    try {
        await AsyncStorage.setItem(
            'calendars',
            JSON.stringify(data)
        );
        console.log('saved data');
    } catch (error) {
        // Error saving data
        console.log(error);
        Alert.alert(
            "Error",
            "We had trouble saving your selected calendars. Please try again.",
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        );
    }
}

export const getAllItems = async (setAnnualData: (items: TodayTask[]) => void, existingItems: TodayTask[], onlySubtasks?: boolean) => {
    let tree: Annual[] = [];
    let taskList: TodayTask[] = existingItems;
    await getStoredData((items) => tree = Object.values(items));
    let stack = Object.assign([] as Annual[], tree);

    while (stack.length > 0) {
        const item = stack.pop();
        if (item) {
            stack = stack.concat(Object.values(item.subtasks));
            if (!onlySubtasks || (item.parent && Object.values(item.subtasks).length == 0)) {
                let task = newTodayTask();
                const statsJson = await AsyncStorage.getItem("stats_" + item.id);
                if (statsJson) {
                    const stats = JSON.parse(statsJson);
                    if (stats.lastCompleted) {
                        task.lastCompleted = moment(stats.lastCompleted);
                    }
                }
                task.priority = item.prepTime / (item.dueDate.diff(moment(), 'd'));
                task.taskRef = item.id;
                task.name = item.name;
                if (item.prepTime) {
                    task.endTime = task.startTime.add(item.prepTime, 'h');
                }
                if (item.dueDate.diff(moment(), 'd') >= 0) {
                    taskList.push(task);
                }
            }
        }
    }

    setAnnualData(taskList);
}
