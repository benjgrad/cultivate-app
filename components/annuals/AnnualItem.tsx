import { Ionicons } from '@expo/vector-icons'
import * as React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { checkBoxHeight, useStyles } from '../../Styles'
import { Annual, AnnualEvent, AnnualSaveFn, newAnnual } from '../../types'
import { AnnualContext } from './AnnualContext'
import { removeItem, storeItem } from './AnnualStorage'
import { Icon, Text } from '../Themed'

interface AnnualItemProps extends Annual {
    startTime?: moment.Moment,
    endTime?: moment.Moment,
    setParentAsCurrent: () => void,
    propogateChange: AnnualSaveFn<Annual>,
    updateId: string
}

export const AnnualItem: React.FC<AnnualItemProps> = (props) => {
    const styles = useStyles();
    let thisItem = props as Annual;
    const annualContext = React.useContext(AnnualContext);

    const saveThisAnnual = (item: Annual, action: 'save' | 'delete' = 'save') => {
        if (item.id == thisItem.id) {
            if (action == 'save') {
                storeItem(item);
            }
            else {
                removeItem(item);
            }
            //propogate changes to parent
            props.propogateChange(item, action);
        }
        else {
            if (action == 'save') {
                thisItem.subtasks[item.id] = item;
            }
            else {
                delete thisItem.subtasks[item.id];
            }
            storeItem(thisItem);
            props.propogateChange(thisItem, 'save');
        }
    };

    const addSubtask = (item: Annual) => {
        storeItem(item);
        let subtasks = thisItem.subtasks || [];
        subtasks[item.id] = item;
        saveThisAnnual({ ...thisItem, subtasks }, 'save');
    }
    const subtasks = thisItem.subtasks && Object.values(thisItem.subtasks).map((subtask) => {
        return <AnnualItem
            {...subtask}
            key={subtask.id}
            parent={thisItem.id}
            setParentAsCurrent={() => setThisToCurrent()}
            propogateChange={saveThisAnnual}
            updateId={props.updateId}
        />
    });
    const setThisToCurrent = () => {
        annualContext.setCurrentItem(thisItem, saveThisAnnual, props.setParentAsCurrent);
    }

    return <>
        <TouchableOpacity onPress={setThisToCurrent}>
            <View style={styles.box}>
                <View style={styles.textContainer}>
                    <Text style={styles.name}>{props.name}</Text>
                    {!!props.startTime && !!props.endTime &&
                        <Text style={styles.time}>{props.startTime?.format('MMMM DD h:mma') + ' - ' + props.endTime?.format('h:mma')}</Text>}
                </View>
                <TouchableOpacity
                    onPress={() => {
                        const newItem = newAnnual();
                        newItem.dueDate = thisItem.dueDate;
                        newItem.parent = thisItem.id;
                        annualContext.setCurrentItem(newItem, addSubtask, props.setParentAsCurrent)
                    }}
                >
                    <Icon style={styles.addSubtaskIcon} name="add" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
        <View style={styles.subtasks}>
            {subtasks}
        </View>
    </>
}