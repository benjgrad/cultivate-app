import * as React from 'react';
import { Modal, View, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { ScrollView } from 'react-native';
import { useStyles } from '../../Styles';
import { Icon, Text } from "../Themed"


type FullscreenModalProps = {
    modalVisible: boolean;
    backMsg: string;
    backBtn?: () => void;
    doneBtn: () => void;
    scroll?: boolean
};
export const FullscreenModal: React.FC<FullscreenModalProps> = (props) => {
    const styles = useStyles();
    const { modalVisible, backMsg, doneBtn } = props;
    let backBtn = props.backBtn ?? function () { };

    let content = props.children;
    if (props.scroll) {
        content = <ScrollView style={styles.modalScrollview}>{props.children}</ScrollView>
    }

    return <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}>
        <View style={styles.modalView}>
            <View style={styles.topNav}>
                <TouchableOpacity onPress={backBtn}
                    style={styles.modalBack}>
                    <Icon style={styles.modalBackIcon} name="chevron-back-outline" />
                    <Text style={styles.modalDoneText}>{props.backBtn && backMsg}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.modalDone}
                    onPress={doneBtn}>
                    <Text style={styles.modalDoneText}>Done</Text>
                </TouchableOpacity>
            </View>
            <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }} behavior="padding" enabled keyboardVerticalOffset={100}>
                {content}
            </KeyboardAvoidingView>
        </View>
    </Modal>;
};
