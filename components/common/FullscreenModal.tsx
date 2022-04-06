import * as React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { useStyles } from '../../Styles';


type FullscreenModalProps = {
    modalVisible: boolean;
    backMsg: string;
    backBtn: () => void;
    doneBtn: () => void;
};
export const FullscreenModal: React.FC<FullscreenModalProps> = (props) => {
    const styles = useStyles();
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
