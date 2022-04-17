import * as React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useStyles } from '../../Styles';


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
                    <Text style={styles.modalDoneText}>{props.backBtn && "<" + backMsg}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.modalDone}
                    onPress={doneBtn}>
                    <Text style={styles.modalDoneText}>Done</Text>
                </TouchableOpacity>
            </View>
            {content}
        </View>
    </Modal>;
};
