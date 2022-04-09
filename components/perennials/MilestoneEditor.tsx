import * as React from 'react';
import { Text, View } from "react-native";
import uuid from "react-native-uuid";
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { checkBoxHeight, deleteItemHeight, useStyles } from '../../Styles';
import { Milestone as Milestone } from '../../types'
import { Ionicons } from '@expo/vector-icons';

type MilestoneEditorProps = {
    milestones: Milestone[];
    onChange: (milestones: Milestone[]) => void;
}

export const MilestoneEditor: React.FC<MilestoneEditorProps> = (props) => {
    const styles = useStyles();

    const updateMilestones = (milestone: Milestone, action?: 'save' | 'delete') => {
        let milestones = props.milestones;
        let i = 0;
        const found = props.milestones?.find((elem: Milestone, iter: number) => {
            i = iter;
            return milestone.id == elem.id;
        });
        if (!!found) {
            if (action == 'delete') {
                milestones.splice(i, 1);
            }
            else {
                milestones[i] = milestone;
            }
        }
        else {
            milestones.push(milestone);
        }
        props.onChange(milestones);
    }

    const addMilestone = () => {
        let milstones = props.milestones;
        milstones.push({
            id: uuid.v4().toString(),
            name: ""
        });
        props.onChange(milstones);
    }

    const milstones = props.milestones.map(m => {
        return <MilestoneEntry key={m.id} {...{ ...m, onChange: updateMilestones }} />
    })
    //TODO Add buttons
    return (<>
        <View style={styles.milestoneEditContainer}>
            {milstones}
        </View>
        <TouchableOpacity style={styles.centerItems} onPress={addMilestone}>
            <Ionicons size={24} name="add" />
        </TouchableOpacity>
    </>);
}

interface MilestoneEntryProps extends Milestone {
    onChange: (milestone: Milestone, action?: 'delete' | 'save') => void;
}

const MilestoneEntry: React.FC<MilestoneEntryProps> = (props) => {
    const styles = useStyles();


    return (<View style={styles.milestoneItemContainer}>
        <View style={styles.textContainer}>
            <TextInput
                style={styles.milstoneItem} //TODO Fix these styles
                key={props.id}
                value={props.name}
                placeholder="Milestone"
                onChangeText={(val: string) => props.onChange({ ...props, name: val })}
            />
        </View>
        <View style={styles.modalDelete}>
            <TouchableOpacity onPress={() => props.onChange(props, 'delete')}>
                <Ionicons size={deleteItemHeight} name="close" />
            </TouchableOpacity>
        </View>
    </View>);
}