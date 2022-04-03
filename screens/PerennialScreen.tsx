import * as React from "react";
import { Alert, AsyncStorage, FlatList, Pressable } from "react-native";
import MainLayout from "../components/MainLayout";
import uuid from "react-native-uuid";
import { Frequency, Perennial, PerennialSaveFn } from "../types";
import { PerennialItem } from "../components/perennials/PerennialItems";
import AddPerennialModal from "../components/perennials/AddPerennialModal";
import { PerennialContext } from "../components/PerennialContext";
import { storeData, getStoredData, storeItem, removeItem } from "./PerennnialStorage";

const testVals = [
  {
    id: uuid.v4(),
    name: "App development",
    subtasks: [
      {
        id: uuid.v4(),
        name: "Today Screen",
        milestones: [
          {
            id: uuid.v4(),
            name: "Prioritize tasks",
            isComplete: false,
          },
          {
            id: uuid.v4(),
            name: "Add task modal",
            isComplete: false,
          },
          {
            id: uuid.v4(),
            name: "Schedule time modal",
            isComplete: false,
          },
          {
            id: uuid.v4(),
            name: "Swipe threshold handler",
            isComplete: false,
          },
        ],
      },
      {
        id: uuid.v4(),
        name: "Perennials Screen",
        milestones: [
          {
            id: uuid.v4(),
            name: "Prioritize perennials",
            isComplete: false,
          },
          {
            id: uuid.v4(),
            name: "Milestones editor",
            isComplete: false,
          },
          {
            id: uuid.v4(),
            name: "Delete item",
            isComplete: false,
          },
          {
            id: uuid.v4(),
            name: "Hide completed tasks",
            isComplete: false,
          },
          {
            id: uuid.v4(),
            name: "Category picker",
            isComplete: false,
          },
          {
            id: uuid.v4(),
            name: "Category picker",
            isComplete: false,
          },
        ],
      },
      {
        id: uuid.v4(),
        name: "Annuals Screen",
        milestones: [
          {
            id: uuid.v4(),
            name: "Read device calendar",
            isComplete: false,
          },
          {
            id: uuid.v4(),
            name: "Display upcoming events",
            isComplete: false,
          },
          {
            id: uuid.v4(),
            name: "Display subtasks",
            isComplete: false,
          },
          {
            id: uuid.v4(),
            name: "Create time to complete editor",
            isComplete: false,
          },
          {
            id: uuid.v4(),
            name: "Display subtasks in modal",
            isComplete: false,
          },
          {
            id: uuid.v4(),
            name: "Create add subtask modal",
            isComplete: false,
          },
          {
            id: uuid.v4(),
            name: "Create add event modal",
            isComplete: false,
          },
        ],
      },
    ],
  },
  {
    id: uuid.v4(),
    name: "Fitness",
    subtasks: [
      {
        id: uuid.v4(),
        name: "Pullups",
        subtasks: [],
        milestones: [
          {
            id: uuid.v4(),
            name: "5x3",
            isComplete: true,
          },
          {
            id: uuid.v4(),
            name: "4x4",
            isComplete: true,
          },
          {
            id: uuid.v4(),
            name: "6x3",
            isComplete: false,
          },
        ],
      },
      {
        id: uuid.v4(),
        name: "Dips",
        subtasks: [],
        milestones: [
          {
            id: uuid.v4(),
            name: "8x3",
            isComplete: false,
          },
        ],
      },
      {
        id: uuid.v4(),
        name: "Leg Raises",
        subtasks: [],
        milestones: [
          {
            id: uuid.v4(),
            name: "5x5",
            isComplete: true,
          },
          {
            id: uuid.v4(),
            name: "8x3",
            isComplete: false,
          },
        ],
      },
    ],
  },
] as Perennial[];

export default function PerennialScreen() {
  const defaultFn = (item: Perennial) => { };

  React.useEffect(() => { getStoredData(setPerennialData); }, []);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [currentItem, setCurrentItem] = React.useState<Perennial>({ id: "", name: "" } as Perennial);
  const [saveCurrentItem, setSaveCurrentItem] = React.useState<PerennialSaveFn>(defaultFn);
  const [openParentAction, setOpenParentAction] = React.useState<() => void>(() => { });
  const [perennialData, setPerennialData] = React.useState<Perennial[]>([]);

  const setCurrentPerennial = (
    newItem: Perennial,
    saveCurrentItem: PerennialSaveFn,
    setParentAsCurrent: () => void
  ) => {
    setModalVisible(true);
    setCurrentItem(newItem);
    setSaveCurrentItem(() => saveCurrentItem);
    setOpenParentAction(() => setParentAsCurrent)
  };

  const saveChild = (item: Perennial, action: 'save' | 'delete') => {
    let i = 0;
    const found = perennialData.find((elem: Perennial, iter: number) => {
      i = iter;
      return item.id == elem.id;
    });
    let newData = perennialData;
    if (!!found) {
      if (action == 'delete') {
        removeItem(item);
        newData.splice(i, 1);
      } else {
        newData.splice(i, 1, item)
        storeItem(item);
      }
    } else {
      newData = [...perennialData, item];
      storeItem(item);
    }
    storeData(newData);
    setPerennialData(newData);
    setModalVisible(false);
  };

  return (
    <MainLayout
      title={"Perennials"}
      addAction={() => {
        const newItem: Perennial = {
          id: uuid.v4().toString(),
          name: "",
          milestones: [],
          frequency: { recurrences: 1, interval: "week" } as Frequency,
          subtasks: [],
        };
        setCurrentPerennial(newItem, saveChild, () => setModalVisible(false));
      }}
    >
      <PerennialContext.Provider
        value={{
          currentItem,
          saveCurrentItem,
          setCurrentItem: setCurrentPerennial,
          setParentAsCurrent: openParentAction
        }}
      >
        <FlatList
          data={perennialData}
          renderItem={({ item }: { item: Perennial }) => (
            <PerennialItem
              setParentAsCurrent={() => setModalVisible(false)}
              propogateChange={saveChild}
              {...item} />
          )}
          keyExtractor={(item: Perennial) => item.id}
        />
        <AddPerennialModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
      </PerennialContext.Provider>
    </MainLayout>
  );
}
