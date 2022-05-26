import * as React from 'react';
import MainLayout from '../components/MainLayout';

import * as Calendar from 'expo-calendar';
import moment from 'moment';
import uuid from "react-native-uuid";
import { FlatList } from 'react-native';
import { useStyles } from '../Styles';
import { AnnualItem } from '../components/annuals/AnnualItem';
import { Annual, AnnualEvent, AnnualSaveFn, Dictionary, newAnnual } from '../types';
import { AnnualContext } from '../components/annuals/AnnualContext';
import AddAnnualModal from '../components/annuals/AddAnnualModal';
import { getStoredData, removeItem, storeData, storeItem } from '../components/annuals/AnnualStorage';
import { AnnualEventItem } from '../components/annuals/AnnualEventItem';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AnnualScreen = () => {
  const styles = useStyles();
  const [calendarEvents, setCalendarEvents] = React.useState<Dictionary<AnnualEvent>>({});
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [currentItem, setCurrentItem] = React.useState<Annual | AnnualEvent>(newAnnual());
  const [saveCurrentItem, setSaveCurrentItem] = React.useState<AnnualSaveFn<Annual | AnnualEvent>>((item: Annual) => { });
  const [openParentAction, setOpenParentAction] = React.useState<() => void>(() => { });
  const [updateId, setUpdateId] = React.useState<string>(uuid.v4().toString());

  const setCurrentAnnual = (
    newItem: Annual | AnnualEvent,
    saveCurrentItem: AnnualSaveFn<Annual> | AnnualSaveFn<AnnualEvent>,
    setParentAsCurrent: () => void
  ) => {
    setModalVisible(true);
    setCurrentItem(newItem);
    setSaveCurrentItem(() => saveCurrentItem);
    setOpenParentAction(() => setParentAsCurrent)
  };


  React.useEffect(() => { getStoredData(setCalendarEvents); }, [updateId]);

  const saveChild = (item: AnnualEvent, action: 'save' | 'delete') => {
    setUpdateId(uuid.v4().toString());
    let newData = Object.assign({} as Dictionary<AnnualEvent>, calendarEvents);
    if (action == 'save') {
      newData[item.id] = item;
      storeItem(item);
    }
    else {
      delete newData[item.id];
      removeItem(item);
    }
    storeData(newData);
    setCalendarEvents(newData);
    setModalVisible(false);
  };

  return (
    <MainLayout title="Annuals" //addAction={async () => await AsyncStorage.clear()}
    >
      <AnnualContext.Provider
        value={{
          currentItem,
          saveCurrentItem,
          setCurrentItem: setCurrentAnnual,
          setParentAsCurrent: openParentAction
        }}
      >

        <FlatList
          style={styles.modalScrollview}
          data={Object.values(calendarEvents).sort((a, b) => {
            if (a.startTime.isSame(b.startTime)) {
              return a.endTime.isAfter(b.endTime) ? 1 : -1;
            }
            return a.startTime.isAfter(b.startTime) ? 1 : -1;
          })}
          keyExtractor={(cal: Annual | AnnualEvent) => cal.id}
          renderItem={({ item }) => {
            return <AnnualEventItem
              {...item}
              dueDate={item.startTime}
              onPress={() => { }}
              propogateChange={saveChild}
              setParentAsCurrent={() => { setModalVisible(false); }}
              updateId={updateId}
            />
          }} />
        <AddAnnualModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
      </AnnualContext.Provider>
    </MainLayout >
  );
}


