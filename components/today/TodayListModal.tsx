import React, { useEffect } from "react";
import { FlatList } from "react-native-gesture-handler";
import { Text } from "react-native";
import { getAllItems, getStoredData } from "../../screens/PerennialStorage";
import { TodayTask, Perennial, PerennialTaskStats } from "../../types";
import { FullscreenModal } from "../common/FullscreenModal";
import { useStyles } from "../../Styles";

type TodayListModalProps = {
    modalVisible: boolean,
    toggleModalVisible: () => void,
}

export const TodayListModal: React.FC<TodayListModalProps> = (props) => {
    const [perennialTasks, setPerennialTasks] = React.useState<TodayTask[]>([]);

    const styles = useStyles();

    useEffect(() => { getAllItems(setPerennialTasks) }, [props.modalVisible]);

    return (
        <FullscreenModal
            modalVisible={props.modalVisible}
            doneBtn={props.toggleModalVisible}
            backMsg=''
        >
            <Text>Hello!</Text>
            <FlatList
                data={perennialTasks}
                style={styles.modalScrollview}
                renderItem={({ item }) => {
                    return (<><Text>{item.name}</Text></>);
                }}
            />
        </FullscreenModal>);
}