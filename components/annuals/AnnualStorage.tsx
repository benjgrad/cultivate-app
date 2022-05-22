import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Annual, AnnualEvent, Dictionary, TaskStats } from "../../types";
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

export const getStoredData = async (setAnnualData: (items: Dictionary<AnnualEvent>) => void, existingData?: Annual[]) => {
    const calendars = await getCalendars();
    let items: Dictionary<AnnualEvent> = {};
    if (!!calendars) {
        const events = await Calendar.getEventsAsync(calendars,
            moment()//.subtract(60, 'd')
                .toDate(),
            moment().add(100, 'd').toDate());
        events.forEach(event => {
            const item = {
                name: event.title,
                id: event.instanceId ?? event.id,
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
                if (!existingData) {
                    existingData = [];
                }
                const savedData = JSON.parse(jsonData) as Dictionary<AnnualEvent>;
                if (!!savedData)
                    Object.values(savedData).forEach(savedItem => {
                        items[savedItem.id] = { ...savedItem, startTime: items[savedItem.id].startTime, endTime: items[savedItem.id].endTime }
                    });
                console.log("got annual data: ", items.length);

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

}

const getCalendars: () => Promise<string[] | undefined> = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'granted') {
        let calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const jsonData = await AsyncStorage.getItem('calendars');

        if (!jsonData) {
            return calendars.map(cal => cal.id);;
        }

        const displayCalendars = JSON.parse(jsonData);
        calendars = calendars.filter((value, index, array) => {
            return displayCalendars[value.id];
        })
        if (!calendars) {
            return [];
        }
        return calendars.map(cal => cal.id);;

    }

}

export const getAllItems = async (setAnnualData: (items: TaskStats[]) => void, existingItems: TaskStats[], onlySubtasks?: boolean) => {
    let tree: Annual[] = [];
    let taskList: TaskStats[] = existingItems;
    await getStoredData((items) => tree = Object.values(items));
    let stack = Object.assign([] as Annual[], tree);

    while (stack.length > 0) {
        const item = stack.pop();
        if (item) {
            stack = stack.concat(Object.values(item.subtasks));
            if (!onlySubtasks || (item.parent && Object.values(item.subtasks).length == 0)) {
                taskList.push({
                    taskId: uuid.v4().toString(),
                    startTime: moment("12:00PM"),
                    endTime: moment("1:00PM"),
                    isComplete: false,
                    numComplete: 0,
                    ...item
                });
            }
        }
    }

    setAnnualData(taskList);
}
