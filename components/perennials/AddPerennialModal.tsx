import * as React from 'react';
import { Text, TextInput } from 'react-native';
import uuid from 'react-native-uuid';
import { BaseTask, MileStone, Perennial, Frequency } from '../../types';
import { StyleSheet } from 'react-native';
import { useRecoilState } from 'recoil';
import { newPerennial } from '../../recoil/newPerennial';
import { FrequencyPicker } from './FrequencyPicker';
import { FullscreenModal } from '../common/FullscreenModal';


type AddPerennialModalProps = {

    currentItem: Perennial;
    modalVisible: boolean;
    setParentModalVisible: () => void;
    addOrUpdatePerennial: (item: Perennial) => void;
};

const AddPerennialModal: React.FC<AddPerennialModalProps> = (props) => {
    const { modalVisible, addOrUpdatePerennial, currentItem } = props;

    const [isNew, setIsNew] = useRecoilState(newPerennial);

    const [name, setName] = React.useState("");
    const [frequency, setFrequency] = React.useState(!!currentItem.frequency ? currentItem.frequency :
        {
            recurrences: 1,
            numIntervals: 1,
            interval: 'day'
        } as Frequency);
    const [milestones, setMilestones] = React.useState([] as MileStone[] | undefined);
    const [parent, setParent] = React.useState(currentItem as BaseTask | undefined);
    const [subtasks, setSubtaks] = React.useState([] as Perennial[]);

    React.useEffect(() => {
        if (isNew) {
            setName("");
            setFrequency({ recurrences: 1, interval: 'day' } as Frequency);
            setMilestones([]);
            setSubtaks([]);
        }
        else {
            setParent(currentItem.parent);
            setSubtaks(currentItem.subtasks);
            setName(currentItem.name);
            setFrequency(!!currentItem.frequency ? currentItem.frequency : { recurrences: 1, interval: 'day' });
            setMilestones(currentItem.milestones);
        }
    }, [isNew]);

    const parentName = isNew ? currentItem?.name :
        !!currentItem?.parent?.name ? currentItem?.parent?.name : ""

    return <FullscreenModal
        modalVisible={modalVisible}
        backMsg={parentName}
        backBtn={() => {
            if (isNew) {
                setName(currentItem.name);
                setFrequency(!!currentItem.frequency ? currentItem.frequency : { recurrences: 1, interval: 'day' });
                setMilestones(currentItem.milestones);
                setIsNew(!isNew);
            }
            else if (props.setParentModalVisible) {
                props.setParentModalVisible();
            }
        }}
        doneBtn={() => {
            addOrUpdatePerennial({
                id: !isNew ? currentItem.id : uuid.v4(),
                name: name,
                milestones: milestones,
                frequency: frequency,
                parent: parent,
                subtasks: subtasks,
            } as Perennial);
        }} >
        <TextInput
            style={[styles.inputRow, styles.nameTextField]}
            placeholder={"Name"}
            onChangeText={setName}
            value={name} />
        {(!subtasks || subtasks.length == 0) &&
            <FrequencyPicker
                backMsg={name}
                frequency={frequency}
                setFrequency={(f: Frequency) => {
                    setFrequency(f);
                }} />}
        <Text style={styles.textInputLabel}>Category</Text>
        <TextInput //TODO Replace with a category picker
            style={[styles.inputRow, styles.nameTextField]}
            placeholder={"-"}
            value={parentName} />
        <Text style={styles.textInputLabel}>Milestones</Text>
        <TextInput //TODO Replace with Milestone editor
            style={[styles.inputRow, styles.nameTextField]}
            placeholder={"Name"} />
        <TextInput
            style={[styles.inputRow, styles.nameTextField]}
            placeholder={"Name"} />
        {/* TODO Delete item */}
    </FullscreenModal>;

}

export default AddPerennialModal;


const styles = StyleSheet.create({
    textInputLabel: {
        fontSize: 20,
        top: 20,
        marginBottom: 5
    },
    inputRow: {
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 10,
        paddingHorizontal: 10
    },
    nameTextField: {
        height: 50,
        fontSize: 20,
        top: 10
    },
});