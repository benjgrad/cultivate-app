import * as React from 'react'
import { Button, Modal, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useStyles } from '../../Styles'
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TodayTask } from '../../types';

interface TimePickerModalProps extends TodayTask {
    modalVisible: boolean,
    onClose: (item: TodayTask) => void,
    onDelete: (item: TodayTask) => void
}


export const TimePickerModal: React.FC<TimePickerModalProps> = (props) => {
    const styles = useStyles();

    const [startTime, setStartTime] = React.useState<moment.Moment>(moment());
    const [endTime, setEndTime] = React.useState<moment.Moment>(moment());
    const [name, setName] = React.useState('');

    const mode: any = 'time'

    const onChange = (setter: React.Dispatch<React.SetStateAction<moment.Moment>>) => (_: any, selectedDate: Date | undefined) => {
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
                placeholder={props.name}
            />
            <View style={styles.inline}>
                <View style={styles.timePickerContainer}>
                    <DateTimePicker
                        style={styles.timePicker}
                        minuteInterval={10}
                        display="compact"
                        testID="dateTimePicker"
                        value={startTime.toDate()}
                        mode={mode}
                        onChange={onChange(setStartTime)}
                    />
                </View>
                <Text style={styles.dash}>-</Text>
                <View style={styles.timePickerContainer}>
                    <DateTimePicker
                        style={styles.timePicker}
                        minimumDate={startTime.toDate()}
                        minuteInterval={10}
                        display="compact"
                        testID="dateTimePicker"
                        value={endTime.toDate()}
                        mode={mode}
                        onChange={onChange(setEndTime)}
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