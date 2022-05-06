import { Ionicons } from '@expo/vector-icons'
import * as React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { checkBoxHeight, useStyles } from '../Styles'
import { AnnualSubtask } from '../types'

interface AnnualItemProps extends AnnualSubtask {
    onPress: () => void
}

export const AnnualItem: React.FC<AnnualItemProps> = (props) => {
    const styles = useStyles();
    return <TouchableOpacity onPress={props.onPress}>
        <View style={styles.box}>
            <View style={styles.textContainer}>
                <Text style={styles.name}>{props.name}</Text>
                {!!props.startTime && !!props.endTime &&
                    <Text style={styles.time}>{props.startTime?.format('MMMM DD h:mma') + ' - ' + props.endTime?.format('h:mma')}</Text>}
            </View>
            <TouchableOpacity
                onPress={() => {
                    //TODO Add subtask
                }}
            >
                <Ionicons style={styles.addSubtask} size={checkBoxHeight} name="add" />
            </TouchableOpacity>
        </View>
    </TouchableOpacity>

}