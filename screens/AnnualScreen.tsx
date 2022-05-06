import * as React from 'react';
import MainLayout from '../components/MainLayout';

import { Text, View } from '../components/Themed';
import SwipeItem from '../components/common/SwipeItem';
import RNCalendarEvents, { CalendarEventReadable, Calendar } from "react-native-calendar-events";
import moment from 'moment';
import { FlatList } from 'react-native-gesture-handler';
import { useStyles } from '../Styles';
import { AnnualItem } from '../components/AnnualItem';
import { Annual } from '../types';

export const AnnualScreen = () => {
  const styles = useStyles();
  const [calendarEvents, setCalendarEvents] = React.useState<Annual[]>([]);
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
              let annuals: Annual[] = events.map(event => {
                return {
                  name: event.title,
                  id: event.id,
                  startTime: moment(event.occurrenceDate),
                  endTime: moment(event.endDate)
                };
              });

              setCalendarEvents(annuals);
            });
        }
      });
  }, []);

  // var content = [];
  // for (let i = 0; i < 10; i++) {
  //   content.push(<SwipeItem key={i} />)
  // }
  return (
    <MainLayout title="Annuals" >
      <FlatList
        style={styles.modalScrollview}
        data={calendarEvents}
        keyExtractor={(cal: CalendarEventReadable) => cal.id}
        renderItem={({ item }) => {
          return <AnnualItem onPress={() => { }} {...item} />
        }} />
    </MainLayout >
  );
}


