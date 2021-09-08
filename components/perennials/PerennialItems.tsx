import * as React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import uuid from 'react-native-uuid';
import { Text, View } from '../Themed';
import { BaseTask, MileStone, Perennial } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import AddPerennialModal from './AddPerennialModal';
import { newPerennial } from '../../recoil/newPerennial';
import { useRecoilState } from 'recoil';
import { MileStoneItem } from './MilestoneProps';


interface PerennialItemProps extends Perennial {
    addOrUpdatePerennial: (item: Perennial) => void;
    setParentModalVisible: () => void;
};

const itemHeight = 50;
const checkBoxHeight = 30;
export const PerennialItem: React.FC<PerennialItemProps> = (props) => {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [_, setIsNew] = useRecoilState(newPerennial);

    const [currentItem, setCurrentItem] = React.useState(props as Perennial);

    const toggleComplete = (id: string) => {
        let i = 0;
        const found = currentItem.milestones?.find((elem: MileStone, iter: number) => {
            i = iter;
            return id == elem.id;
        });
        if (!!found && !!currentItem.milestones) {
            found.isComplete = !found.isComplete;
            currentItem.milestones[i] = found;
            addOrUpdatePerennial(currentItem);
        }

    }
    const addOrUpdatePerennial = (item: Perennial) => {
        //Update the current perennial
        if (item.id == currentItem.id) {
            props.addOrUpdatePerennial(item);
            setCurrentItem(item);
        }
        else {
            //Add to subtasks if none are found
            if (!currentItem.subtasks) {
                currentItem.subtasks = [item];
            }
            else {
                let i = 0;
                const found = currentItem.subtasks?.find((elem: Perennial, iter: number) => {
                    i = iter;
                    return item.id == elem.id;
                });

                //Add to subtaks if none are found
                if (!found) {
                    currentItem.subtasks.push(item);
                }
                //Update subtask if found
                else {
                    currentItem.subtasks[i] = item;
                }
            }
            //propogate changes to parent
            props.addOrUpdatePerennial(currentItem);
        }
        setModalVisible(false);
    }
    return (<>
        <View style={styles.box}>

            <View style={styles.textContainer}>
                <TouchableOpacity onPress={() => {
                    setIsNew(false);
                    setModalVisible(!modalVisible);
                }}>
                    <Text style={styles.name}>{currentItem.name}</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => {
                setIsNew(true);
                setModalVisible(!modalVisible);
            }}>
                <Ionicons style={styles.addSubtask} size={checkBoxHeight} name="add" />
            </TouchableOpacity>
        </View>
        <View style={styles.subtasks}>
            {props.subtasks && props.subtasks.map(item => <PerennialItem
                setParentModalVisible={() => {
                    setModalVisible(!modalVisible);
                }}
                addOrUpdatePerennial={addOrUpdatePerennial}
                key={item.id} {...{ ...item, parent: currentItem as BaseTask }} />)}
            {props.milestones && props.milestones.map(item => <MileStoneItem key={item.id} toggleComplete={toggleComplete} {...item} />)}
        </View>
        {modalVisible && <AddPerennialModal
            currentItem={currentItem}
            modalVisible={modalVisible}
            addOrUpdatePerennial={addOrUpdatePerennial}
            setParentModalVisible={() => {
                setModalVisible(!modalVisible);
                props.setParentModalVisible();
            }}
        />}
    </>);
};

const styles = StyleSheet.create({

    subtasks: {
        backgroundColor: '#ffff0000',
        marginLeft: 20,
    },
    textContainer: {
        backgroundColor: '#ffff0000',
        marginHorizontal: 24,
        justifyContent: 'center',
        flex: 1,
    },
    box: {
        backgroundColor: '#acb5ac',
        height: itemHeight,
        margin: 5,
        alignSelf: 'stretch',
        borderRadius: 15,
        flexDirection: "row",
    },
    name: {
        fontSize: 20,
    },
    time: {},
    addSubtask: {
        width: checkBoxHeight,
        height: checkBoxHeight,
        position: 'absolute',
        right: 15,
        top: (itemHeight - checkBoxHeight) / 2,
    },
});