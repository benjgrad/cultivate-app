import * as React from "react";
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Milestone, Annual, Frequency } from "../../types";

import { FullscreenModal } from "../common/FullscreenModal";
import { AnnualContext } from "../AnnualContext";
//import { getStoredItem } from "./AnnualStorage";
import { useStyles } from "../../Styles";


type ModalProps = {
  modalVisible: boolean,
  setModalVisible: (visible: boolean) => void;
}

const AddAnnualModal: React.FC<ModalProps> = (props) => {
  const styles = useStyles();
  const { modalVisible, setModalVisible } = props;

  const annualContext = React.useContext(AnnualContext);


  //TODO figure out why this isn't working
  const safeClone = (item: Annual) => {
    return {
      ...annualContext.currentItem
    };
  }

  const [currentItem, setCurrentItem] = React.useState<Annual>({ ...annualContext.currentItem });
  React.useEffect(
    () => setCurrentItem({ ...annualContext.currentItem }),
    [annualContext.currentItem.id, annualContext.currentItem.parent]);

  const [parentName, setParentName] = React.useState<string>("");

  React.useEffect(() => {
    if (annualContext.currentItem.parent) {
      //TODO getStoredItem(AnnualContext.currentItem.parent, (parent: Annual) => 
      setParentName(annualContext.currentItem.parent);
    } else {
      setParentName("");
    }
  }, [annualContext.currentItem.id])

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
        style={[styles.inputRow, styles.nameTextField]}
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
