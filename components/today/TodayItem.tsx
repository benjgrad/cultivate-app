import * as React from 'react';
import { TodayTask } from '../../types';
import { StyleSheet } from 'react-native';
import { Text, View } from '../Themed';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

export const TodayItem: React.FC<TodayItemProps> = (props) => {
    return (<TouchableOpacity>
        <View style={styles.box}>
            <View style={styles.textContainer}>
                <Text style={styles.name}>{props.name}</Text>
                {!!props.startTime && !!props.endTime &&
                    <Text style={styles.time}>{props.startTime?.format('h:mma') + ' - ' + props.endTime?.format('h:mma')}</Text>}
            </View>
            <View style={styles.checkBox}>
                {!props.isComplete && <Ionicons size={32} name="checkmark-outline" />}
            </View>
        </View>
    </TouchableOpacity>);
};
type TodayItemProps = TodayTask & {
    completeTask?: () => void;
};


const itemHeight = 60; //TODO theme
const checkBoxHeight = 40;

const styles = StyleSheet.create({
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    textContainer: {
        backgroundColor: '#ffff0000',
        marginHorizontal: 24,
        justifyContent: 'center',
        flex: 1,
    },
    box: {
        backgroundColor: '#acb5ac', //TODO theme
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

