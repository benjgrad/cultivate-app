import * as React from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker'
import { useStyles } from '../../Styles';
import { Frequency } from '../../types';
import { FullscreenModal } from '../common/FullscreenModal';
import { Text } from "../Themed"

type FrequencyPickerProps = {
    frequency: Frequency;
    backMsg: string;
    setFrequency: (f: Frequency) => void;
};
export const FrequencyPicker: React.FC<FrequencyPickerProps> = (props) => {
    const styles = useStyles();
    const { recurrences: occurrences, interval } = props.frequency;
    const [modalVisible, setModalVisible] = React.useState(false);


    const [occur, setOccurrences] = React.useState(occurrences);

    const [inter, setInterval] = React.useState(interval);


    const plO = occur != 1;
    const frequencyMsg = (plO ? occurrences + ' times every ' : 'Once every ') + interval;

    return <View style={styles.frequencyPicker}>
        <TouchableOpacity
            onPress={() => { setModalVisible(true); }}>
            <Text style={[styles.frequencyPickerTxt]}>
                {frequencyMsg}
            </Text>
        </TouchableOpacity>
        <FullscreenModal
            modalVisible={modalVisible}
            backMsg={props.backMsg}
            backBtn={() => {
                setModalVisible(false);
            }}
            doneBtn={() => {
                props.setFrequency({ recurrences: occur, interval: inter });
                setModalVisible(false);
            }} >
            <TextInput
                style={[styles.inputRow, styles.nameTextField]}
                onChangeText={(itemValue) => setOccurrences(+itemValue)}
                keyboardType="numeric"
                value={occur + ''} />
            <Text style={styles.freqPickerTxt}>{'occurrence' + (plO ? 's' : '') + ' every'}</Text>
            <Picker //TODO replace with something that's not deprecated
                //https://github.com/mxck/react-native-material-menu
                //https://github.com/peacechen/react-native-modal-selector
                selectedValue={inter}
                itemStyle={styles.pickerItems}
                style={styles.picker}
                onValueChange={(itemValue) => setInterval(itemValue)}
            >
                <Picker.Item color={styles.pickerItems.color} label="day" value="day" />
                <Picker.Item label="weeks" value="week" />
                <Picker.Item label="month" value="month" />
                <Picker.Item label="year" value="year" />
            </Picker>
        </FullscreenModal>
    </View>;
};
