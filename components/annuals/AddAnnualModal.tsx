import * as React from "react";
import { KeyboardAvoidingView, TextInput, TouchableOpacity, View } from "react-native";
import { Milestone, Annual, Frequency, AnnualEvent } from "../../types";
import { Text } from "../Themed";

import { FullscreenModal } from "../common/FullscreenModal";
import { AnnualContext } from "./AnnualContext";
import { getStoredItem } from "./AnnualStorage";
import { useStyles } from "../../Styles";


type ModalProps = {
  modalVisible: boolean,
  setModalVisible: (visible: boolean) => void;
  isScheduled?: boolean;
  setScheduled?: (scheduled: boolean) => void;
}

const AddAnnualModal: React.FC<ModalProps> = (props) => {
  const styles = useStyles();
  const { modalVisible, setModalVisible } = props;

  const annualContext = React.useContext(AnnualContext);

  const [currentItem, setCurrentItem] = React.useState<Annual | AnnualEvent>({ ...annualContext.currentItem });
  const [scheduled, setScheduled] = React.useState(props.isScheduled ?? false);
  const [prepRender, setPrepRender] = React.useState<string>(currentItem.prepTime.toString());



  const [parentName, setParentName] = React.useState<string>("");

  React.useEffect(() => {
    setCurrentItem(annualContext.currentItem);
    setPrepRender(annualContext.currentItem.prepTime.toString());
    setScheduled(props.isScheduled === undefined ? false : props.isScheduled);
  }, [annualContext.currentItem.id, annualContext.currentItem.parent])

  React.useEffect(() => {
    if (annualContext.currentItem.parent) {
      getStoredItem(annualContext.currentItem.parent, (parent: Annual) => setParentName(parent.name));
    } else {
      setParentName("");
    }

  }, [annualContext.currentItem.id]);

  const isToplevel = !annualContext.currentItem.parent;

  return (
    <FullscreenModal
      modalVisible={modalVisible}
      backMsg={parentName}
      backBtn={annualContext.setParentAsCurrent}
      doneBtn={() => {
        annualContext.saveCurrentItem(currentItem, 'save');
        setModalVisible(!modalVisible);
      }}
      scroll
    >
      <TextInput
        multiline
        style={[styles.inputRow, styles.nameTextField, styles.multiline]}
        placeholder={"Name"}
        onChangeText={(name: string) => {
          setCurrentItem({ ...currentItem, name });
        }}
        value={currentItem.name}
      />
      <Text style={styles.textInputLabel}>Category</Text>
      <TextInput //TODO Replace with a category picker
        style={[styles.inputRow, styles.nameTextField]}
        placeholder={"-"}
        value={parentName}
      />
      <Text style={styles.textInputLabel}>Prep time</Text>
      <TextInput
        style={[styles.inputRow, styles.nameTextField]}
        keyboardType='numeric'
        placeholder={"-"}
        onChangeText={(prepTime: string) => {
          prepTime = prepTime.replace(/[^0-9]/g, '');
          setCurrentItem({ ...currentItem, prepTime: +prepTime });
          setPrepRender(prepTime);
        }}
        value={prepRender}
      />

      {isToplevel && <View style={styles.centerItems}>
        <TouchableOpacity
          onPress={() => {
            setCurrentItem({ ...currentItem, scheduled: scheduled });
            if (props.setScheduled) {
              props.setScheduled(!scheduled);
              setScheduled(!scheduled);
            }
          }}>
          <View style={[styles.btnContainer, scheduled ? styles.selected : styles.unselected]}>
            <Text style={styles.btn}>Add to schedule</Text>
          </View>
        </TouchableOpacity>
      </View>}
      <View style={styles.deleteBtn}>
        <TouchableOpacity
          onPress={() => {
            annualContext.saveCurrentItem(currentItem, 'delete');
            setModalVisible(!modalVisible);
          }}
        >
          <Text style={styles.deleteBtnText}>{"Delete " + currentItem.name}</Text>
        </TouchableOpacity>
      </View>
    </FullscreenModal>
  );
};

export default AddAnnualModal;
