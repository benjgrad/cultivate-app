import * as React from 'react';
import MainLayout from '../components/MainLayout';

import * as Calendar from 'expo-calendar';
import moment from 'moment';
import uuid from "react-native-uuid";
import { FlatList } from 'react-native';
import { useStyles } from '../Styles';
import { AnnualItem } from '../components/AnnualItem';
import { Annual, AnnualEvent, AnnualSaveFn, newAnnual } from '../types';
import { AnnualContext } from '../components/AnnualContext';
import AddAnnualModal from '../components/annuals/AddAnnualModal';

export const AnnualScreen = () => {
  const styles = useStyles();
  const [calendarEvents, setCalendarEvents] = React.useState<(AnnualEvent | Annual)[]>([]);
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [currentItem, setCurrentItem] = React.useState<Annual>(newAnnual());
  const [saveCurrentItem, setSaveCurrentItem] = React.useState<AnnualSaveFn>((item: Annual) => { });
  const [openParentAction, setOpenParentAction] = React.useState<() => void>(() => { });
  const [updateId, setUpdateId] = React.useState<string>(uuid.v4().toString());

  const setCurrentAnnual = (
    newItem: Annual,
    saveCurrentItem: AnnualSaveFn,
    setParentAsCurrent: () => void
  ) => {
    setModalVisible(true);
    setCurrentItem(newItem);
    setSaveCurrentItem(() => saveCurrentItem);
    setOpenParentAction(() => setParentAsCurrent)
  };


  React.useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const cals: string[] = calendars.map(cal => cal.id);
        const events = await Calendar.getEventsAsync(cals,
          moment().subtract(10, 'd').toDate(),
          moment().add(60, 'd').toDate());
        let annuals: AnnualEvent[] = events.map(event => {
          return {
            name: event.title,
            id: event.instanceId ?? event.id,
            startTime: moment(event.startDate),
            endTime: moment(event.endDate),
            prepTime: 0,
            subtasks: [],
            parent: ""
          };
        });

        setCalendarEvents(annuals);
      }
    })();
  }, []);

  const saveChild = (item: Annual | AnnualEvent, action: 'save' | 'delete') => {
    let i = 0;
    setUpdateId(uuid.v4().toString());
    const found = calendarEvents.find((elem: Annual, iter: number) => {
      i = iter;
      return item.id == elem.id;
    });
    let newData = Object.assign([] as (AnnualEvent | Annual)[], calendarEvents);
    if (!!found) {
      if (action == 'delete') {
        //removeItem(item);
        newData.splice(i, 1);
      } else {
        newData.splice(i, 1, { ...item })
        //storeItem(item);
      }
    } else {
      newData = [...calendarEvents, item];
      //storeItem(item);
    }
    //storeData(newData);
    setCalendarEvents(newData);
    setModalVisible(false);
  };

  return (
    <MainLayout title="Annuals" >
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
          data={calendarEvents}
          keyExtractor={(cal: Annual | AnnualEvent) => cal.id}
          renderItem={({ item }) => {
            return <AnnualItem
              {...item}
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


