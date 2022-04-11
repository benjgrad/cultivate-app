import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import Colors from './constants/Colors';
import useColorScheme from './hooks/useColorScheme';

export const checkBoxHeight = 30;
export const deleteItemHeight = 20;

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
        centerItems: {
            alignItems: 'center',
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
        milestoneItemContainer: {
            height: itemHeight,
            margin: 5,
            alignSelf: "stretch",
            borderRadius: 15,
            flexDirection: "row",
        },
        name: {
            fontSize: 20,
        },
        milestone: {
            fontSize: 20,
            width: '90%'
        },
        time: {},
        modalDelete: {
            width: checkBoxHeight,
            height: checkBoxHeight,
            position: "absolute",
            right: 5,
            top: (itemHeight - deleteItemHeight) / 2,
        },
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
            paddingTop: 15,
            paddingBottom: 80,
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
        todayCheckBox: {
            padding: 0,
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
            alignItems: 'center',
            marginTop: '90%',
        },
        deleteBtnText: {
            color: "red",
        },
        separator: {
            marginVertical: 30,
            height: 1,
            width: '80%',
        },
        modalScrollview: {
            paddingHorizontal: 30,
            marginHorizontal: -30
        },
        milstoneItem: {
            fontSize: 20,
            width: '70%'
        },
        milestoneEditContainer: {
            marginTop: 24,
            flex: 1,
        },
        addMilestoneBtn: {
            flex: 10,
            fontSize: 18,
        },
    });

    return styles;
}

