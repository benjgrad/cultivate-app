import * as React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text, View } from '../Themed';
import { MileStone } from '../../types';
import { Ionicons } from '@expo/vector-icons';

const itemHeight = 50;
const checkBoxHeight = 30;

interface MilestoneProps extends MileStone {
    toggleComplete: (id: string) => void;
};
export const MileStoneItem: React.FC<MilestoneProps> = (props) => {
    const [isComplete, setIsComplete] = React.useState(props.isComplete);
    return (
        <View style={styles.box}>
            <View style={styles.textContainer}>
                <Text style={styles.name}>{props.name}</Text>
            </View>
            <TouchableOpacity onPress={() => {
                setIsComplete(!isComplete);
                props.toggleComplete(props.id);
            }}>
                <View style={styles.checkBox}>
                    {isComplete && <Ionicons size={24} name="checkmark-outline" />}
                </View>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({

    name: {
        fontSize: 20,
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