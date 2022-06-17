import { Ionicons } from '@expo/vector-icons'
import * as React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { checkBoxHeight, useStyles } from '../../Styles'
import { Annual, AnnualEvent, AnnualSaveFn, newAnnual } from '../../types'
import { AnnualContext } from './AnnualContext'
import { AnnualItem } from './AnnualItem'
import { removeItem, storeItem } from './AnnualStorage'
import { Icon, Text } from '../Themed'

interface AnnualEventItemProps extends AnnualEvent {
    setParentAsCurrent: () => void,
    propogateChange: AnnualSaveFn<AnnualEvent>,
    updateId: string
}

export const AnnualEventItem: React.FC<AnnualEventItemProps> = (props) => {
    const styles = useStyles();
    const thisItem = props as AnnualEvent;
    const annualContext = React.useContext(AnnualContext);

    const saveThisAnnual = (item: AnnualEvent, action: 'save' | 'delete' = 'save') => {
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

    const saveChild = (item: Annual, action: 'save' | 'delete' = 'save') => {
        if (action == 'save') {
            thisItem.subtasks[item.id] = item;
        }
        else {
            delete thisItem.subtasks[item.id];
        }
        //propogate changes to parent
        storeItem(thisItem);
        props.propogateChange(thisItem, 'save');
    }

    const addSubtask = (item: Annual) => {
        storeItem(item);
        let subtasks = thisItem.subtasks || [];
        subtasks[item.id] = item;
        saveThisAnnual({ ...thisItem, subtasks }, 'save');
    }
    const subtasks = thisItem.subtasks && Object.values(thisItem.subtasks).map((subtask) => {
        return <AnnualItem
            {...subtask}
            dueDate={props.dueDate}
            key={subtask.id}
            parent={thisItem.id}
            setParentAsCurrent={() => setThisToCurrent()}
            propogateChange={saveChild}
            updateId={props.updateId}
        />
    });
    const setThisToCurrent = () => {
        annualContext.setCurrentItem(thisItem, saveThisAnnual, props.setParentAsCurrent);
    }
    try {
        props.startTime.format('YYYY MMMM DD h:mma')
    }
    catch (e) {
        console.log({ startTime: props.startTime, endTime: props.endTime, name: props.name })
        console.log(e);
    }
    let dateString = props.startTime.format('YYYY MMMM D h:mma') + ' - ' + props.endTime.format('h:mma');
    if (props.endTime.isAfter(props.startTime, 'date')) {
        dateString = props.startTime.format('YYYY MMMM D') + ' - ' + props.endTime.format('MMMM D');
    }
    return <>
        <TouchableOpacity onPress={setThisToCurrent}>
            <View style={styles.box}>
                <View style={styles.textContainer}>
                    <Text style={styles.name}>{props.name}</Text>
                    {!!props.startTime && !!props.endTime &&
                        <Text style={styles.time}>{dateString}</Text>}
                </View>
                <TouchableOpacity
                    onPress={() => {
                        const newItem = newAnnual();
                        newItem.dueDate = thisItem.startTime;
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