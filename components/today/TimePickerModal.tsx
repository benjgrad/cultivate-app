import * as React from 'react'
import { Modal, Text, TouchableOpacity, View } from "react-native"
import { useStyles } from '../../Styles'
import moment from 'moment';
import { ScrollWheel } from '../common/ScrollWheel';

type TimePickerModalProps = {
    modalVisible: boolean,
    onClose: () => void
}

export const TimePickerModal: React.FC<TimePickerModalProps> = (props) => {
    const styles = useStyles();

    // TODO Create 2 TimePickers
    // 2 text components
    // OnClick, Highlight field and scrollwheel
    // Scrollwheel is infinite horizontal flatlist with 
    // output as scroll distance
    const [startTime, setStartTime] = React.useState<moment.Moment | null>(null);
    const [endTime, setEndTime] = React.useState<moment.Moment | null>(null);

    const handleChange = (value: number, setter: React.Dispatch<React.SetStateAction<moment.Moment | null>>) => {
        setter(moment(value));
    }



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
                    onPress={() => props.onClose()}>
                    <Text style={styles.modalDoneText}>Done</Text>
                </TouchableOpacity>
            </View>
            <ScrollWheel onScroll={(value: number) => { handleChange(value, setStartTime); }} />
        </View>
    </Modal>
}