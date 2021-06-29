import { Ionicons } from '@expo/vector-icons';
import { purple } from '@material-ui/core/colors';
import { DoneTwoTone } from '@material-ui/icons';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import Colors from '../constants/Colors';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';

type MainLayoutProps = {
    title: string;
    addAction?: any; //TODO make this manditory
}
const MainLayout: React.FC<MainLayoutProps> = (props) => {
    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.container}>
                <Text style={styles.title}>
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


const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#ffffff00',
    },
    container: {
        marginHorizontal: 24,
        flexDirection: "row",
        justifyContent: 'center', //Centered vertically
        alignItems: 'center', // Centered horizontally
        backgroundColor: '#ffffff00',
    },
    title: {
        marginHorizontal: 10,
        fontSize: 40,
        fontWeight: 'bold',
        lineHeight: 80,
        flex: 85
    },
    content: {
        paddingHorizontal: 16,
        flex: 1,
        backgroundColor: '#ffffff00',
    },
    addAction: {
        flex: 15,
        alignItems: 'center'
    },
    scrollView: {}
});
