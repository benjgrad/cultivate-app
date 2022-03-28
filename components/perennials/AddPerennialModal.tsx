import * as React from "react";
import { Text, TextInput, TouchableOpacity } from "react-native";
import { BaseTask, MileStone, Perennial, Frequency } from "../../types";
import { StyleSheet } from "react-native";
import { useRecoilState } from "recoil";
import { FrequencyPicker } from "./FrequencyPicker";
import { FullscreenModal } from "../common/FullscreenModal";
import { perennialModalOpen } from "../../recoil/perennialModalOpen";
import { PerennialContext } from "../PerennialContext";

const AddPerennialModal: React.FC = () => {
  const [modalVisible, setModalVisible] = useRecoilState(perennialModalOpen);
  const perennialContext = React.useContext(PerennialContext);

  const currentItem = perennialContext.currentItem;

  if (!currentItem.frequency) {
    currentItem.frequency = {
      recurrences: 1,
      numIntervals: 1,
      interval: "day",
    } as Frequency;
  }

  const parentName = currentItem.parent?.name ? currentItem.parent.name : "";

  return (
    <FullscreenModal
      modalVisible={modalVisible}
      backMsg={parentName}
      backBtn={perennialContext.openParentModal}
      doneBtn={() => {
        perennialContext.savePerennial(currentItem);
        setModalVisible(!modalVisible);
      }}
    >
      <TextInput
        style={[styles.inputRow, styles.nameTextField]}
        placeholder={"Name"}
        onChangeText={(name: string) => {
          currentItem.name = name;
        }}
        value={currentItem.name}
      />
      {(!currentItem.subtasks || currentItem.subtasks.length == 0) && (
        <FrequencyPicker
          backMsg={currentItem.name}
          frequency={currentItem.frequency ? currentItem.frequency : { recurrences: 1, interval: "week" }}
          setFrequency={(f: Frequency) => {
            currentItem.frequency = f;
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
          perennialContext.deletePerennial(currentItem);
          setModalVisible(!modalVisible);
        }}
      >
        <Text style={styles.deleteBtn}>{"Delete " + currentItem.name}</Text>
      </TouchableOpacity>
    </FullscreenModal>
  );
};

export default AddPerennialModal;

const styles = StyleSheet.create({
  textInputLabel: {
    fontSize: 20,
    top: 20,
    marginBottom: 5,
  },
  inputRow: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  nameTextField: {
    height: 50,
    fontSize: 20,
    top: 10,
  },
  deleteBtn: {
    color: "red",
  },
});
