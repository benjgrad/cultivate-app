import React, { useEffect } from "react";
import { FlatList } from "react-native";
import { TouchableOpacity, View } from "react-native";
import * as PerennialStorage from "../perennials/PerennialStorage";
import * as AnnualStorage from "../annuals/AnnualStorage";
import { TodayTask, Perennial, newTodayTask } from "../../types";
import { FullscreenModal } from "../common/FullscreenModal";
import { useStyles } from "../../Styles";
import moment from 'moment';
import { TimePickerModal } from "./TimePickerModal";
import { Text } from "../Themed"

type TodayListModalProps = {
    modalVisible: boolean,
    toggleModalVisible: () => void,
    addTask: (item: TodayTask, action?: 'save' | 'delete') => void,
}

export const TodayListModal: React.FC<TodayListModalProps> = (props) => {
    const [tasks, setTasks] = React.useState<TodayTask[]>([]);
    const [timeModalVisible, setTimeModalVisible] = React.useState(false);
    const [currentTask, setCurrentTask] = React.useState<TodayTask>(newTodayTask());
    const styles = useStyles();
    const onClose = (item: TodayTask) => {
        setTimeModalVisible(!timeModalVisible);
        props.addTask(item);
    }
    useEffect(() => {
        let newTasks: TodayTask[] = [];
        PerennialStorage.getAllItems((storedTasks) => newTasks = storedTasks, newTasks, true);
        AnnualStorage.getAllItems(setTasks, newTasks, true);
    }, [props.modalVisible]);
    tasks.sort((a, b) => {
        return a.priority > b.priority ? -1 : 1
    });

    return (
        <FullscreenModal
            modalVisible={props.modalVisible}
            doneBtn={props.toggleModalVisible}
            backMsg=''
        >
            <Text></Text>
            <FlatList
                data={tasks}
                style={styles.modalScrollview}
                renderItem={({ item }) => {
                    return (<TodayItem item={item} onClick={(item) => {
                        setCurrentTask(item);
                        setTimeModalVisible(!timeModalVisible);
                    }} />);
                }}
            />
            <TimePickerModal
                {...currentTask}
                modalVisible={timeModalVisible}
                onDelete={() => {
                    setTimeModalVisible(false);
                }}
                onClose={onClose} />
        </FullscreenModal>);
}

type TodayItemProps = {
    item: TodayTask, // || AnnualTaskStats
    onClick: (item: TodayTask) => void
}

const TodayItem: React.FC<TodayItemProps> = (props) => {
    const { item, onClick } = props;
    const styles = useStyles();

    let subtext = 'Never cultivated';
    if (item.lastCompleted) {
        subtext = 'Last cultivated ' + moment().diff(item.lastCompleted, 'days') + ' days ago';
    }
    return <TouchableOpacity onPress={() => onClick(item)}>
        <View style={styles.box}>
            <View style={styles.textContainer}>
                <Text style={styles.name}>{item.name}</Text>
                {<Text style={styles.time}>{subtext}</Text>}
            </View>
        </View>
    </TouchableOpacity>;
}