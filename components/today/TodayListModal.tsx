import React, { useEffect } from "react";
import { FlatList } from "react-native-gesture-handler";
import { Text, TouchableOpacity, View } from "react-native";
import * as PerennialStorage from "../perennials/PerennialStorage";
import { TodayTask, Perennial, PerennialTaskStats } from "../../types";
import { FullscreenModal } from "../common/FullscreenModal";
import { useStyles } from "../../Styles";
import { TimePickerModal } from "./TimePickerModal";

type TodayListModalProps = {
    modalVisible: boolean,
    toggleModalVisible: () => void,
    addTask: (item: TodayTask, action?: 'save' | 'delete') => void,
}

export const TodayListModal: React.FC<TodayListModalProps> = (props) => {
    const [perennialTasks, setPerennialTasks] = React.useState<PerennialTaskStats[]>([]);
    const [timeModalVisible, setTimeModalVisible] = React.useState(false);
    const [currentTask, setCurrentTask] = React.useState<TodayTask>({ id: '', name: '', isComplete: false });
    const styles = useStyles();
    const onClose = () => {
        setTimeModalVisible(!timeModalVisible);
        props.addTask(currentTask);
    }
    useEffect(() => { PerennialStorage.getAllItems(setPerennialTasks, true) }, [props.modalVisible]);

    return (
        <FullscreenModal
            modalVisible={props.modalVisible}
            doneBtn={props.toggleModalVisible}
            backMsg=''
        >
            <Text></Text>
            <FlatList
                data={perennialTasks}
                style={styles.modalScrollview}
                renderItem={({ item }) => {
                    return (<TodayItem item={item} onClick={(item) => {
                        setCurrentTask(item);
                        setTimeModalVisible(!timeModalVisible);
                    }} />);
                }}
            />
            <TimePickerModal modalVisible={timeModalVisible} onClose={onClose} />
        </FullscreenModal>);
}

type TodayItemProps = {
    item: PerennialTaskStats, // || AnnualTaskStats
    onClick: (item: PerennialTaskStats) => void
}

const TodayItem: React.FC<TodayItemProps> = (props) => {
    const { item, onClick } = props;
    const styles = useStyles();

    let subtext = 'Never cultivated';
    if (item.lastCompleted) {
        subtext = 'Last cultivation: ' + item.lastCompleted;
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