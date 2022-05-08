import * as React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, View } from '../Themed';
import { Milestone } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import { checkBoxHeight, useStyles } from '../../Styles';


interface MilestoneProps extends Milestone {
    toggleComplete: (id: string) => void;
};
export const MileStoneItem: React.FC<MilestoneProps> = (props) => {

    const styles = useStyles();
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
                    {isComplete && <Ionicons size={checkBoxHeight - 6} name="checkmark-outline" />}
                </View>
            </TouchableOpacity>
        </View>
    );
};

