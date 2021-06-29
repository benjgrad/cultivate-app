import * as React from 'react';
import { Modal, StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import uuid from 'react-native-uuid';
import { Perennial } from '../../types';
import { Dimensions } from 'react-native';
const { height } = Dimensions.get('window');


type AddPerennialModalProps = {
    modalVisible: boolean;
    setParentModalVisible: () => void;
    addOrUpdatePerennial: (item: Perennial) => void;
};

const AddPerennialModal: React.FC<AddPerennialModalProps> = (props) => {
    let { modalVisible, addOrUpdatePerennial } = props;
    return <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
    >
        <View style={styles.modalView}>
            <View style={styles.topNav}>
                <TouchableOpacity onPress={() => {
                    if (props.setParentModalVisible) {
                        props.setParentModalVisible();
                    }
                }}
                    style={styles.modalBack}>
                    <Text style={styles.modalDoneText}>{"< Parent Item"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.modalDone}
                    onPress={() => {
                        addOrUpdatePerennial({
                            id: uuid.v4(),
                            name: "Dips",
                            subtasks: [], //TODO populate with real data
                        } as Perennial);
                    }}
                >
                    <Text style={styles.modalDoneText}>Done</Text>
                </TouchableOpacity>
            </View>
            <TextInput
                style={[styles.inputRow, styles.nameTextField]}
                placeholder={"Name"} />
            <TextInput
                style={[styles.inputRow, styles.nameTextField]}
                value={"Once per week"} />
            <Text style={styles.textInputLabel}>Category</Text>
            <TextInput
                style={[styles.inputRow, styles.nameTextField]}
                placeholder={"Name"}
                value={"Social"} />
            <Text style={styles.textInputLabel}>Milestones</Text>
            <TextInput
                style={[styles.inputRow, styles.nameTextField]}
                placeholder={"Name"} />
            <TextInput
                style={[styles.inputRow, styles.nameTextField]}
                placeholder={"Name"} />
        </View>

    </Modal >;
}

export default AddPerennialModal;

const modalTop = 20;
const styles = StyleSheet.create({
    textInputLabel: {
        fontSize: 20,
        top: 20,
        marginBottom: 5
    },
    inputRow: {
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 10,
        paddingHorizontal: 10
    },
    nameTextField: {
        height: 50,
        fontSize: 20,
        top: 10
    },
    modalView: {
        marginTop: 60,
        height: height - modalTop,
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


    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
    },
    modalText: {
        marginBottom: 15,
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});