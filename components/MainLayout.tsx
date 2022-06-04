import { Ionicons } from '@expo/vector-icons';
import { useStyles } from '../Styles'
import React from 'react';
import { GestureResponderEvent, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { Text, View } from './Themed';

type MainLayoutProps = {
    title: string;
    titleComponent?: JSX.Element;
    titlePressAction?: (event: GestureResponderEvent) => void;
    addAction?: any; //TODO make this manditory
}
const MainLayout: React.FC<MainLayoutProps> = (props) => {
    const styles = useStyles();
    const colorScheme = useColorScheme();
    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.container}>
                {!props.titleComponent &&
                    <Text style={styles.title} onPress={props.titlePressAction}>
                        {props.title}
                    </Text>
                }
                {!!props.titleComponent && props.titleComponent}
                <TouchableOpacity style={styles.addAction} onPress={props.addAction}>
                    <Ionicons color={Colors[colorScheme].text} styles={styles.addIcon} size={50} name="add" />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                {props.children}
            </View>
        </SafeAreaView>);
};

export default MainLayout;
