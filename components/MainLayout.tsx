import { Ionicons } from '@expo/vector-icons';
import { useStyles } from '../Styles'
import React from 'react';
import { GestureResponderEvent, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';

import Colors from '../constants/Colors';
import { Text, View } from './Themed';

type MainLayoutProps = {
    title: string;
    titlePressAction?: (event: GestureResponderEvent) => void;
    addAction?: any; //TODO make this manditory
}
const MainLayout: React.FC<MainLayoutProps> = (props) => {
    const styles = useStyles();
    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.container}>
                <Text style={styles.title} onPress={props.titlePressAction}>
                    {props.title}
                </Text>
                <TouchableOpacity style={styles.addAction} onPress={props.addAction}>
                    <Ionicons size={50} name="add" />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                {props.children}
            </View>
        </SafeAreaView>);
};

export default MainLayout;
