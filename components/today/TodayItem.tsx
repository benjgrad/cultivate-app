import * as React from 'react';
import { TodayTask } from '../../types';
import { Text, View } from '../Themed';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { checkBoxHeight, useStyles } from '../../Styles';


type TodayItemProps = TodayTask & {
    toggleComplete: () => void;
};
export const TodayItem: React.FC<TodayItemProps> = (props) => {
    const styles = useStyles();
    return (
        <TouchableOpacity onPress={props.toggleComplete}>
            <View style={styles.box}>
                <View style={styles.textContainer}>
                    <Text style={styles.name}>{props.name}</Text>
                    {!!props.startTime && !!props.endTime &&
                        <Text style={styles.time}>{props.startTime?.format('h:mma') + ' - ' + props.endTime?.format('h:mma')}</Text>}
                </View>
                <View style={styles.todayCheckBox}>
                    {props.isComplete && <Ionicons size={checkBoxHeight - 6} name="checkmark-outline" />}
                </View>
            </View>
        </TouchableOpacity>
    );
};

