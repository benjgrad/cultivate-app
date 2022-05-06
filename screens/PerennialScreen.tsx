import * as React from "react";
import { FlatList } from "react-native";
import MainLayout from "../components/MainLayout";
import uuid from "react-native-uuid";
import { Frequency, Perennial, PerennialSaveFn } from "../types";
import { PerennialItem } from "../components/perennials/PerennialItems";
import AddPerennialModal from "../components/perennials/AddPerennialModal";
import { PerennialContext } from "../components/PerennialContext";
import { storeData, getStoredData, storeItem, removeItem } from "../components/perennials/PerennialStorage";
import { useStyles } from "../Styles";


export default function PerennialScreen() {
  const styles = useStyles();

  React.useEffect(() => { getStoredData(setPerennialData); }, []);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [currentItem, setCurrentItem] = React.useState<Perennial>({ id: "", name: "" } as Perennial);
  const [saveCurrentItem, setSaveCurrentItem] = React.useState<PerennialSaveFn>((item: Perennial) => { });
  const [openParentAction, setOpenParentAction] = React.useState<() => void>(() => { });
  const [perennialData, setPerennialData] = React.useState<Perennial[]>([]);
  const [updateId, setUpdateId] = React.useState<string>(uuid.v4().toString());

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
    setUpdateId(uuid.v4().toString());
    const found = perennialData.find((elem: Perennial, iter: number) => {
      i = iter;
      return item.id == elem.id;
    });
    let newData = Object.assign([] as Perennial[], perennialData);
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
          style={styles.modalScrollview}
          renderItem={({ item }: { item: Perennial }) =>
            <PerennialItem
              setParentAsCurrent={() => setModalVisible(false)}
              propogateChange={saveChild}
              {...item}
              updateId={updateId} />
          }
          keyExtractor={(item: Perennial) => item.id}
        />
        <AddPerennialModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
      </PerennialContext.Provider>
    </MainLayout>
  );
}
