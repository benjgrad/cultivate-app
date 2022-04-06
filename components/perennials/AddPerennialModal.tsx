import * as React from "react";
import { Text, TextInput, TouchableOpacity } from "react-native";
import { BaseTask, MileStone, Perennial, Frequency } from "../../types";
import { FrequencyPicker } from "./FrequencyPicker";
import { FullscreenModal } from "../common/FullscreenModal";
import { PerennialContext } from "../PerennialContext";
import { getStoredItem } from "../../screens/PerennnialStorage";
import { useStyles } from "../../Styles";

type ModalProps = {
  modalVisible: boolean,
  setModalVisible: (visible: boolean) => void;
}

const AddPerennialModal: React.FC<ModalProps> = (props) => {
  const styles = useStyles();
  const { modalVisible, setModalVisible } = props;

  const perennialContext = React.useContext(PerennialContext);

  const [currentItem, setCurrentItem] = React.useState<Perennial>(perennialContext.currentItem);
  React.useEffect(
    () => setCurrentItem(perennialContext.currentItem),
    [perennialContext.currentItem.id, perennialContext.currentItem.parent])

  const [parentName, setParentName] = React.useState<string>("");

  React.useEffect(() => {
    if (currentItem.parent) {
      getStoredItem(currentItem.parent, (parent: Perennial) => setParentName(parent.name));
    } else {
      setParentName("");
    }
    if (!currentItem.frequency) {
      setCurrentItem({
        ...currentItem, frequency: {
          recurrences: 1,
          numIntervals: 1,
          interval: "day",
        } as Frequency
      });
    }
  }, [perennialContext.currentItem.id, currentItem.id])

  return (
    <FullscreenModal
      modalVisible={modalVisible}
      backMsg={parentName}
      backBtn={perennialContext.setParentAsCurrent}
      doneBtn={() => {
        perennialContext.saveCurrentItem(currentItem, 'save');
        setModalVisible(!modalVisible);
      }}
    >
      <TextInput
        style={[styles.inputRow, styles.nameTextField]}
        placeholder={"Name"}
        onChangeText={(name: string) => {
          setCurrentItem({ ...currentItem, name });
        }}
        value={currentItem.name}
      />
      {(!currentItem.subtasks || currentItem.subtasks.length == 0) && (
        <FrequencyPicker
          backMsg={currentItem.name}
          frequency={currentItem.frequency ? currentItem.frequency : { recurrences: 1, interval: "week" }}
          setFrequency={(f: Frequency) => {
            setCurrentItem({ ...currentItem, frequency: f });
          }}
        />
      )}
      <Text style={styles.textInputLabel}>Category</Text>
      <TextInput //TODO Replace with a category picker
        style={[styles.inputRow, styles.nameTextField]}
        placeholder={"-"}
        value={parentName}
      />
      <Text style={styles.textInputLabel}>Milestones</Text>
      <TextInput //TODO Replace with Milestone editor
        style={[styles.inputRow, styles.nameTextField]}
        placeholder={"Name"}
      />
      <TextInput style={[styles.inputRow, styles.nameTextField]} placeholder={"Name"} />

      <TouchableOpacity
        onPress={() => {
          perennialContext.saveCurrentItem(currentItem, 'delete');
          setModalVisible(!modalVisible);
        }}
      >
        <Text style={styles.deleteBtn}>{"Delete " + currentItem.name}</Text>
      </TouchableOpacity>
    </FullscreenModal>
  );
};

export default AddPerennialModal;
