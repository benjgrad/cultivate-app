import * as React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import uuid from "react-native-uuid";
import { Text, View } from "../Themed";
import { BaseTask, Frequency, MileStone, Perennial, PerennialVoidFn } from "../../types";
import { Ionicons } from "@expo/vector-icons";
import { useRecoilState } from "recoil";
import { MileStoneItem } from "./MilestoneProps";
import { perennialModalOpen } from "../../recoil/perennialModalOpen";
import { PerennialContext } from "../PerennialContext";

interface PerennialItemProps extends Perennial {
  addOrUpdatePerennial: (item: Perennial) => void;
  openParentModal: () => void;
}

const itemHeight = 50;
const checkBoxHeight = 30;
export const PerennialItem: React.FC<PerennialItemProps> = (props) => {
  const perennialContext = React.useContext(PerennialContext);

  const currentItem = perennialContext.currentItem;
  const savePerennial = perennialContext.savePerennial;
  const setCurrentItem = perennialContext.setCurrentItem;

  const [modalVisible, setModalOpen] = useRecoilState(perennialModalOpen);
  //const [currentItem, setCurrentItem] = useRecoilState(currentPerennial);
  //const [savePerennial, setSavePerennial] = useRecoilState(savePerennialFunc);

  const toggleComplete = (id: string) => {
    let i = 0;
    const found = currentItem.milestones?.find((elem: MileStone, iter: number) => {
      i = iter;
      return id == elem.id;
    });
    if (!!found && !!currentItem.milestones) {
      found.isComplete = !found.isComplete;
      currentItem.milestones[i] = found;
      savePerennial(currentItem);
    }
  };
  const saveThisPerennial: PerennialVoidFn = (item: Perennial) => {
    //Update the current perennial
    if (item.id == currentItem.id) {
      props.addOrUpdatePerennial(item);
      setCurrentItem(item); //TODO Pass the correct functions to propogate changes
    } else {
      //Add to subtasks if none are found
      if (!currentItem.subtasks) {
        currentItem.subtasks = [item];
      } else {
        let i = 0;
        const found = currentItem.subtasks?.find((elem: Perennial, iter: number) => {
          i = iter;
          return item.id == elem.id;
        });

        //Add to subtaks if none are found
        if (!found) {
          currentItem.subtasks.push(item);
        }
        //Update subtask if found
        else {
          currentItem.subtasks[i] = item;
        }
      }
      //propogate changes to parent
      props.addOrUpdatePerennial(currentItem);
    }
    setModalOpen(false);
  };
  const deletePerennial = () => { }; //todo
  const modalBackAction = () => {
    if (currentItem.id == props.id) {
      //call parent function to set new currentPerrennial in recoil
    }
  };

  const setCurrentItemPayload = {
    newItem: currentItem,
    parentModalOpener: props.openParentModal,
    perennialSaver: savePerennial,
    perennialDeleter: deletePerennial,
  };
  return (
    <>
      <View style={styles.box}>
        <View style={styles.textContainer}>
          <TouchableOpacity
            onPress={() => {
              // setCurrentItem: (
              //   newItem: Perennial,
              //   parentModalOpener: () => void,
              //   perennialSaver: PerennialVoidFn,
              //   perennialDeleter: PerennialVoidFn
              // )
              //TODO Populate parentModalOpener and perennialDeleter
              setCurrentItem(props, props.openParentModal, savePerennial, deletePerennial);
              setModalOpen(!modalVisible);
            }}
          >
            <Text style={styles.name}>{props.name}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            const newItem: Perennial = {
              id: uuid.v4().toString(),
              name: "",
              milestones: [],
              frequency: { recurrences: 1, interval: "week" } as Frequency,
              subtasks: [],
            };
            setCurrentItem();
            setModalOpen(!modalVisible);
          }}
        >
          <Ionicons style={styles.addSubtask} size={checkBoxHeight} name="add" />
        </TouchableOpacity>
      </View>
      <View style={styles.subtasks}>
        {props.subtasks &&
          props.subtasks.map((item) => (
            <PerennialItem
              openParentModal={() => {
                setModalOpen(!modalVisible);
              }}
              addOrUpdatePerennial={savePerennial}
              key={item.id}
              {...{ ...item, parent: currentItem as BaseTask }}
            />
          ))}
        {props.milestones &&
          props.milestones.map((item) => <MileStoneItem key={item.id} toggleComplete={toggleComplete} {...item} />)}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  subtasks: {
    backgroundColor: "#ffff0000",
    marginLeft: 20,
  },
  textContainer: {
    backgroundColor: "#ffff0000",
    marginHorizontal: 24,
    justifyContent: "center",
    flex: 1,
  },
  box: {
    backgroundColor: "#acb5ac",
    height: itemHeight,
    margin: 5,
    alignSelf: "stretch",
    borderRadius: 15,
    flexDirection: "row",
  },
  name: {
    fontSize: 20,
  },
  time: {},
  addSubtask: {
    width: checkBoxHeight,
    height: checkBoxHeight,
    position: "absolute",
    right: 15,
    top: (itemHeight - checkBoxHeight) / 2,
  },
});
