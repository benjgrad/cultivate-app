import * as React from "react";
import { KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Milestone, Annual, Frequency, AnnualEvent, Dictionary } from "../../types";

import { FullscreenModal } from "../common/FullscreenModal";
import { saveSelectedCalendars, getCalendars } from "./AnnualStorage";
import { useStyles } from "../../Styles";
import { FlatList } from "react-native-gesture-handler";
import { Calendar } from "expo-calendar";
import { CalendarItem } from "./CalendarItem";


type ModalProps = {
  modalVisible: boolean,
  setModalVisible: (visible: boolean) => void;
}

const ChooseCalendarModal: React.FC<ModalProps> = (props) => {
  const styles = useStyles();
  const { modalVisible, setModalVisible } = props;
  const [calendars, setCalendars] = React.useState<Calendar[]>([]);

  React.useEffect(() => {
    getCalendars().then((allCalendars) => { if (allCalendars) { setCalendars(allCalendars) } })
  }, [modalVisible]);

  const handleToggleShowCalendar = (id: string) => {
    let dict: Dictionary<Calendar> = {};
    calendars.forEach(cal => {
      dict[cal.id] = cal;
      if (cal.id == id) {
        dict[cal.id].isVisible = !cal.isVisible;
      }
    });
    saveSelectedCalendars(dict);
    setCalendars(Object.values(dict));
    getCalendars().then((allCalendars) => { if (allCalendars) { setCalendars(allCalendars) } })
  }

  return (
    <FullscreenModal
      backMsg=''
      modalVisible={modalVisible}
      doneBtn={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <Text></Text>
      <FlatList
        data={calendars}
        keyExtractor={(cal) => cal.id}
        renderItem={({ item }) => {
          return <CalendarItem {...item} toggleComplete={handleToggleShowCalendar} />
        }}
      />
    </FullscreenModal>
  );
};

export default ChooseCalendarModal;
