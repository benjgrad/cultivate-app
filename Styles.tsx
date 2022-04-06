import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import Colors from './constants/Colors';
import useColorScheme from './hooks/useColorScheme';

export const checkBoxHeight = 30;

export function useStyles(): any {

    const { height: screenHeight } = Dimensions.get('window');
    const modalTop = 20;
    const itemHeight = 50;


    const colorScheme = useColorScheme();


    const styles = StyleSheet.create({
        main: {
            flex: 1,
            backgroundColor: Colors[colorScheme].background,
        },
        container: {
            marginHorizontal: 24,
            flexDirection: "row",
            justifyContent: 'center', //Centered vertically
            alignItems: 'center', // Centered horizontally
            backgroundColor: Colors[colorScheme].background,
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
        scrollView: {},
        subtasks: {
            backgroundColor: "#ffff0000",
            marginLeft: 20,
        },
        textContainer: {
            backgroundColor: "#ffff0000",
            marginHorizontal: 24,
            justifyContent: "center",
            flex: 1,
        },
        box: {
            backgroundColor: "#acb5ac",
            height: itemHeight,
            margin: 5,
            alignSelf: "stretch",
            borderRadius: 15,
            flexDirection: "row",
        },
        name: {
            fontSize: 20,
        },
        time: {},
        addSubtask: {
            width: checkBoxHeight,
            height: checkBoxHeight,
            position: "absolute",
            right: 15,
            top: (itemHeight - checkBoxHeight) / 2,
        },
        modalView: {
            marginTop: 60,
            height: screenHeight - modalTop,
            backgroundColor: "white",
            borderRadius: 20,
            paddingHorizontal: 35,
            paddingVertical: 15,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 5
        },
        topNav: {
            flexDirection: "row",
        },
        modalDone: {
            flex: 12,
            marginRight: -15
        },
        modalDoneText: {
            color: "#000000",
            fontSize: 16
        },
        modalBack: {
            flex: 85,
            marginLeft: -15,
        },

        freqPickerTxt: {
            top: 10,
            fontSize: 20,
            textAlign: 'center'
        },
        picker: {
            height: 50,
            flex: 1
        },
        frequencyMsg: {
            height: 50,
            fontSize: 20,
            top: 10,
            flex: 1,
            justifyContent: 'center',
        },
        inputRow: {
            textAlign: 'center',
            height: 50,
            borderWidth: 1,
            borderRadius: 10,
            marginVertical: 10,
            paddingHorizontal: 10
        },
        nameTextField: {
            height: 50,
            fontSize: 20,
            top: 10,
        },
        checkBox: {
            width: checkBoxHeight,
            height: checkBoxHeight,
            borderRadius: 20,
            borderColor: 'black',
            borderWidth: 3,
            position: 'absolute',
            right: 15,
            top: (itemHeight - checkBoxHeight) / 2,
        },
        textInputLabel: {
            fontSize: 20,
            top: 20,
            marginBottom: 5,
        },
        deleteBtn: {
            color: "red",
        },
        separator: {
            marginVertical: 30,
            height: 1,
            width: '80%',
        },
    });

    return styles;
}

