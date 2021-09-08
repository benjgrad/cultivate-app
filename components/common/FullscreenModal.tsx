import * as React from 'react';
import { Modal, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';
const { height } = Dimensions.get('window');

const modalTop = 20;
const styles = StyleSheet.create({
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
});
type FullscreenModalProps = {
    modalVisible: boolean;
    backMsg: string;
    backBtn: () => void;
    doneBtn: () => void;
};
export const FullscreenModal: React.FC<FullscreenModalProps> = (props) => {
    const { modalVisible, backMsg, backBtn, doneBtn } = props;
    return <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}>
        <View style={styles.modalView}>
            <View style={styles.topNav}>
                <TouchableOpacity onPress={backBtn}
                    style={styles.modalBack}>
                    <Text style={styles.modalDoneText}>{"<" + backMsg}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.modalDone}
                    onPress={doneBtn}>
                    <Text style={styles.modalDoneText}>Done</Text>
                </TouchableOpacity>
            </View>
            {props.children}
        </View>
    </Modal>;
};
