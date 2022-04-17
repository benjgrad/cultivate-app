import * as React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Milestone, Perennial, Frequency } from "../../types";
import { FrequencyPicker } from "./FrequencyPicker";
import { FullscreenModal } from "../common/FullscreenModal";
import { PerennialContext } from "../PerennialContext";
import { getStoredItem } from "../../screens/PerennialStorage";
import { useStyles } from "../../Styles";
import { MilestoneEditor } from "./MilestoneEditor";

type ModalProps = {
  modalVisible: boolean,
  setModalVisible: (visible: boolean) => void;
}

const AddPerennialModal: React.FC<ModalProps> = (props) => {
  const styles = useStyles();
  const { modalVisible, setModalVisible } = props;

  const perennialContext = React.useContext(PerennialContext);


  //TODO figure out why this isn't working
  const safeClone = (item: Perennial) => {
    return {
      ...perennialContext.currentItem, milestones: Object.assign([], perennialContext.currentItem.milestones)
    };
  }

  const [currentItem, setCurrentItem] = React.useState<Perennial>({ ...perennialContext.currentItem, milestones: Object.assign([], perennialContext.currentItem.milestones) });
  React.useEffect(
    () => setCurrentItem({ ...perennialContext.currentItem, milestones: Object.assign([], perennialContext.currentItem.milestones) }),
    [perennialContext.currentItem.id, perennialContext.currentItem.parent]);

  const [parentName, setParentName] = React.useState<string>("");

  React.useEffect(() => {
    if (perennialContext.currentItem.parent) {
      getStoredItem(perennialContext.currentItem.parent, (parent: Perennial) => setParentName(parent.name));
    } else {
      setParentName("");
    }
    if (!perennialContext.currentItem.frequency) {
      setCurrentItem({
        ...currentItem, frequency: {
          recurrences: 1,
          numIntervals: 1,
          interval: "day",
        } as Frequency
      });
    }
  }, [perennialContext.currentItem.id])

  return (
    <FullscreenModal
      modalVisible={modalVisible}
      backMsg={parentName}
      backBtn={perennialContext.setParentAsCurrent}
      doneBtn={() => {
        perennialContext.saveCurrentItem(currentItem, 'save');
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
      <MilestoneEditor
        onChange={(milestones: Milestone[]) => setCurrentItem({ ...currentItem, milestones })}
        milestones={currentItem.milestones || []}
      />
      <View style={styles.deleteBtn}>
        <TouchableOpacity
          onPress={() => {
            perennialContext.saveCurrentItem(currentItem, 'delete');
            setModalVisible(!modalVisible);
          }}
        >
          <Text style={styles.deleteBtnText}>{"Delete " + currentItem.name}</Text>
        </TouchableOpacity>
      </View>
    </FullscreenModal>
  );
};

export default AddPerennialModal;
