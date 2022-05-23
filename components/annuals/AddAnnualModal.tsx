import * as React from "react";
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Milestone, Annual, Frequency, AnnualEvent } from "../../types";

import { FullscreenModal } from "../common/FullscreenModal";
import { AnnualContext } from "./AnnualContext";
import { getStoredItem } from "./AnnualStorage";
import { useStyles } from "../../Styles";


type ModalProps = {
  modalVisible: boolean,
  setModalVisible: (visible: boolean) => void;
}

const AddAnnualModal: React.FC<ModalProps> = (props) => {
  const styles = useStyles();
  const { modalVisible, setModalVisible } = props;

  const annualContext = React.useContext(AnnualContext);

  const [currentItem, setCurrentItem] = React.useState<Annual | AnnualEvent>({ ...annualContext.currentItem });
  const [prepRender, setPrepRender] = React.useState<string>(currentItem.prepTime.toString());


  const [parentName, setParentName] = React.useState<string>("");

  React.useEffect(() => {
    setCurrentItem(annualContext.currentItem);
    setPrepRender(annualContext.currentItem.prepTime.toString());
  }, [annualContext.currentItem.id, annualContext.currentItem.parent])

  React.useEffect(() => {
    if (annualContext.currentItem.parent) {
      getStoredItem(annualContext.currentItem.parent, (parent: Annual) => setParentName(parent.name));
    } else {
      setParentName("");
    }

  }, [annualContext.currentItem.id]);

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
