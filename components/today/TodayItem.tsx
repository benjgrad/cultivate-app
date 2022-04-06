import * as React from 'react';
import { TodayTask } from '../../types';
import { Text, View } from '../Themed';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useStyles } from '../../Styles';

export const TodayItem: React.FC<TodayItemProps> = (props) => {
    const styles = useStyles();
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


