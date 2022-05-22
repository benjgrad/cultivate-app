import * as React from 'react';
import { TodayTask } from '../../types';
import { Text, View } from '../Themed';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { checkBoxHeight, useStyles } from '../../Styles';


type TodayItemProps = TodayTask & {
    toggleComplete: () => void;
    onOpen: (item: TodayTask) => void;
};
export const TodayItem: React.FC<TodayItemProps> = (props) => {
    const styles = useStyles();
    return (
        <View style={styles.box}>
            <TouchableOpacity onPress={() => props.onOpen(props)} style={styles.textContainer}>
                <Text style={styles.name}>{props.name}</Text>
                {!!props.startTime && !!props.endTime &&
                    <Text style={styles.time}>{props.startTime?.format('h:mma') + ' - ' + props.endTime?.format('h:mma')}</Text>}

            </TouchableOpacity>
            <TouchableOpacity onPress={props.toggleComplete}>
                <View style={styles.todayCheckBox}>
                    {props.isComplete && <Ionicons size={checkBoxHeight - 6} name="checkmark-outline" />}
                </View>
            </TouchableOpacity>
        </View>
    );
};

