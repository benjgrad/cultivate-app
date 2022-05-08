import { Ionicons } from '@expo/vector-icons'
import * as React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { checkBoxHeight, useStyles } from '../Styles'
import { Annual, AnnualEvent, AnnualSaveFn, newAnnual } from '../types'
import { AnnualContext } from './AnnualContext'

interface AnnualItemProps extends Annual {
    onPress: () => void,
    startTime?: moment.Moment,
    endTime?: moment.Moment,
    setParentAsCurrent: () => void,
    propogateChange: AnnualSaveFn,
    updateId: string
}

export const AnnualItem: React.FC<AnnualItemProps> = (props) => {
    const styles = useStyles();
    const thisItem = props as Annual;
    const annualContext = React.useContext(AnnualContext);

    const saveThisAnnual = (item: Annual | AnnualEvent, action: 'save' | 'delete' = 'save') => {
        //Update the current annual
        if (item.id == thisItem.id) {
            if (action == 'delete') {
                //removeItem(item);
            }
            else {
                //storeItem(item);
            }
            props.propogateChange(item, action);
        } else {
            //Add to subtasks if none are found
            if (!thisItem.subtasks) {
                thisItem.subtasks = [item];
            } else {
                let i = 0;
                const found = thisItem.subtasks?.find((elem: Annual, iter: number) => {
                    i = iter;
                    return item.id == elem.id;
                });

                //Add to subtaks if none are found
                if (!found) {
                    thisItem.subtasks.push(item);
                }
                //Update subtask if found
                else {
                    if (action == 'delete') {
                        thisItem.subtasks.splice(i, 1)
                    }
                    else {
                        thisItem.subtasks[i] = item;
                    }
                }
            }
            //propogate changes to parent
            //storeItem(thisItem);
            props.propogateChange(thisItem, 'save');
        }
    };

    const addSubtask = (item: Annual) => {
        //storeItem(item);
        let subtasks = thisItem.subtasks || [];
        subtasks.push(item);
        saveThisAnnual({ ...thisItem, subtasks }, 'save');
    }
    const subtasks = thisItem.subtasks && thisItem.subtasks.map((subtask) => {
        return <AnnualItem
            {...subtask}
            key={subtask.id}
            parent={thisItem.id}
            onPress={() => { }}
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
                        //TODO Add subtask
                        const newItem = newAnnual();
                        newItem.parent = thisItem.id;
                        annualContext.setCurrentItem(newItem, addSubtask, props.setParentAsCurrent)
                    }}
                >
                    <Ionicons style={styles.addSubtask} size={checkBoxHeight} name="add" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
        <View style={styles.subtasks}>
            {subtasks}
        </View>
    </>

}