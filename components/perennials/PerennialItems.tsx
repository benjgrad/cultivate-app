import * as React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import uuid from 'react-native-uuid';
import { Text, View } from '../Themed';
import { MileStone, Perennial } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import AddPerennialModal from './AddPerennialModal';


interface PerennialItemProps extends Perennial {
    addOrUpdatePerennial: (item: Perennial) => void;
    setParentModalVisible: () => void;
}
;
export const itemHeight = 50;
export const checkBoxHeight = 30;
export const PerennialItem: React.FC<PerennialItemProps> = (props) => {
    const [modalVisible, setModalVisible] = React.useState(false);
    let currentItem = props as Perennial;
    const addOrUpdatePerennial = (item: Perennial) => {
        if (!currentItem.subtasks) {
            currentItem.subtasks = [item];
        }
        else {
            let i = 0;
            const found = currentItem.subtasks?.find((elem: Perennial, iter: number) => {
                i = iter;
                return item.id == elem.id;
            });
            if (!!found) {
                currentItem.subtasks[i] = item;
            }
            else {
                currentItem.subtasks.push(item);
            }
        }
        props.addOrUpdatePerennial(currentItem);
        setModalVisible(false);
    }
    return (<>
        <View style={styles.box}>
            <View style={styles.textContainer}>
                <Text style={styles.name}>{props.name}</Text>
            </View>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <Ionicons style={styles.addSubtask} size={checkBoxHeight} name="add" />
            </TouchableOpacity>
        </View>
        <View style={styles.subtasks}>
            {props.subtasks && props.subtasks.map(item => <PerennialItem
                setParentModalVisible={() => {
                    setModalVisible(!modalVisible);
                }}
                addOrUpdatePerennial={addOrUpdatePerennial}
                key={item.id} {...item} />)}
            {props.milestones && props.milestones.map(item => <MileStoneItem key={item.id} {...item} />)}
        </View>
        <AddPerennialModal
            modalVisible={modalVisible}
            addOrUpdatePerennial={addOrUpdatePerennial}
            setParentModalVisible={() => {
                setModalVisible(!modalVisible);
                props.setParentModalVisible();
            }}
        />
    </>);
};
const MileStoneItem: React.FC<MileStone> = (props) => {
    return (
        <View style={styles.box}>
            <View style={styles.textContainer}>
                <Text style={styles.name}>{props.name}</Text>
            </View>
            <View style={styles.checkBox}>
                {props.isComplete && <Ionicons size={24} name="checkmark-outline" />}
            </View>
        </View>
    );
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
    checkBox: {
        width: checkBoxHeight,
        height: checkBoxHeight,
        borderRadius: 20,
        borderColor: 'black', //TODO theme
        borderWidth: 3,
        position: 'absolute',
        right: 15,
        top: (itemHeight - checkBoxHeight) / 2,
    },
});