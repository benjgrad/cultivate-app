import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, View } from '../Themed';
import { Milestone } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import { checkBoxHeight, useStyles } from '../../Styles';
import { Calendar } from 'expo-calendar';


interface CalendarItemProps extends Calendar {
    toggleComplete: (id: string) => void;
};
export const CalendarItem: React.FC<CalendarItemProps> = (props) => {

    const styles = useStyles();
    return (
        <View style={styles.box}>
            <View style={styles.textContainer}>
                <Text style={styles.name}>{props.title}</Text>
            </View>
            <TouchableOpacity onPress={() => {
                props.toggleComplete(props.id);
            }}>
                <View style={styles.checkBox}>
                    {props.isVisible && <Ionicons size={checkBoxHeight - 6} name="checkmark-outline" />}
                </View>
            </TouchableOpacity>
        </View>
    );
};

