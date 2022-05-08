import * as React from 'react';
import MainLayout from '../components/MainLayout';

import RNCalendarEvents, { CalendarEventReadable, Calendar } from "react-native-calendar-events";
import moment from 'moment';
import uuid from "react-native-uuid";
import { FlatList } from 'react-native-gesture-handler';
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

  RNCalendarEvents.requestPermissions();
  let approved = false;
  RNCalendarEvents.checkPermissions()
    .then((resp) => {
      approved = resp == "authorized";
    });

  React.useEffect(() => {
    //TODO Maybe don't run this code on every render...
    RNCalendarEvents.findCalendars()
      .then((calendars) => {
        if (approved) {
          //TODO Move this into a config popup for selecting calendars
          const cals: string[] = calendars.map(cal => cal.id);
          RNCalendarEvents.fetchAllEvents(
            moment().subtract(100, 'd').format("YYYY-MM-DDTHH:mm:ss.sssZ"),
            moment().add(100, 'd').format("YYYY-MM-DDTHH:mm:ss.sssZ"),
            cals).then((events) => {
              let annuals: AnnualEvent[] = events.map(event => {
                return {
                  name: event.title,
                  id: event.id,
                  startTime: moment(event.occurrenceDate),
                  endTime: moment(event.endDate),
                  prepTime: 0,
                  subtasks: [],
                  parent: ""
                };
              });

              setCalendarEvents(annuals);
            });
        }
      });
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
          keyExtractor={(cal: CalendarEventReadable) => cal.id}
          renderItem={({ item }) => {
            return <AnnualItem
              {...item}
              onPress={() => { }}
              propogateChange={saveChild}
              setParentAsCurrent={() => { setModalVisible(false); }}
            />
          }} />
        <AddAnnualModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
      </AnnualContext.Provider>
    </MainLayout >
  );
}


