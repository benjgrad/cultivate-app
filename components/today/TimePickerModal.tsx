import * as React from 'react'
import { Button, Modal, TextInput, TouchableOpacity, View } from "react-native"
import { useStyles } from '../../Styles'
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TodayTask } from '../../types';
import { Text } from "../Themed"

interface TimePickerModalProps extends TodayTask {
    modalVisible: boolean,
    onClose: (item: TodayTask) => void,
    onDelete: (item: TodayTask) => void,
    currentDate: moment.Moment;
}


export const TimePickerModal: React.FC<TimePickerModalProps> = (props) => {
    const styles = useStyles();

    const [startTime, setStartTime] = React.useState<moment.Moment>(props.currentDate);
    const [endTime, setEndTime] = React.useState<moment.Moment>(props.currentDate);
    const [name, setName] = React.useState(props.name);

    React.useEffect(() => {
        setName(props.name);
        let diff = props.endTime.diff(props.startTime, 'minute');
        if (diff < 30) {
            diff = 60;
            const newEndTime = props.startTime.clone().add(diff, 'minute');
            setEndTime(newEndTime)
        }
        else {
            setEndTime(props.endTime);
        }
        setStartTime(props.startTime);
    }, [props.id]);

    const updateStartTime = (newTime: moment.Moment) => {
        let diff = endTime.diff(startTime, 'minute');
        if (diff < 30) {
            diff = 60;
        }
        const newEndTime = newTime.clone().add(diff, 'minute');
        setEndTime(newEndTime)
        setStartTime(newTime);
    }


    const updateEndTime = (newEndTime: moment.Moment) => {
        let diff = newEndTime.diff(startTime, 'minute');
        if (diff < 30) {
            diff = 60;
            setStartTime(newEndTime.clone().subtract(diff, 'minute'))
        }
        setEndTime(newEndTime);
    }

    const mode: any = 'time'

    const onChange = (setter: ((item: moment.Moment) => void)) => (_: any, selectedDate: Date | undefined) => {
        if (selectedDate) {
            setter(moment(selectedDate));
        }
    };


    return <Modal
        animationType="slide"
        transparent={true}
        visible={props.modalVisible}>
        <View style={styles.timeModal}>
            <View style={styles.topNav}>
                <TouchableOpacity
                    style={styles.modalBack}>
                    <Text style={styles.modalDoneText}></Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.modalDone}
                    onPress={() => {
                        startTime.set("D", props.currentDate.dayOfYear());
                        startTime.set("M", props.currentDate.month());
                        startTime.set("y", props.currentDate.year());
                        endTime.set("D", props.currentDate.dayOfYear());
                        endTime.set("M", props.currentDate.month());
                        endTime.set("y", props.currentDate.year());
                        props.onClose({
                            ...props,
                            name: name ? name : props.name,
                            startTime,
                            endTime
                        });
                    }}>
                    <Text style={styles.modalDoneText}>Done</Text>
                </TouchableOpacity>
            </View>
            <TextInput
                style={[styles.inputRow, styles.nameTextField]}
                onChangeText={(name: string) => {
                    setName(name);
                }}
                value={name}
                placeholder={props.name}
            />
            <View style={styles.inline}>
                <View style={styles.timePickerContainer}>
                    <DateTimePicker
                        style={styles.timePicker}
                        minuteInterval={30}
                        display="compact"
                        testID="dateTimePicker"
                        value={startTime.toDate()}
                        mode={mode}
                        onChange={onChange(updateStartTime)}
                    />
                </View>
                <Text style={styles.dash}>-</Text>
                <View style={styles.timePickerContainer}>
                    <DateTimePicker
                        style={styles.timePicker}
                        minuteInterval={30}
                        display="compact"
                        testID="dateTimePicker"
                        value={endTime.toDate()}
                        mode={mode}
                        onChange={onChange(updateEndTime)}
                    />
                </View>
            </View>

            <View style={styles.deleteBtn}>
                <TouchableOpacity
                    onPress={() => {
                        props.onDelete(props);
                    }}>
                    <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
}