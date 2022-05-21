import * as React from 'react';
import MainLayout from '../components/MainLayout';

import { Dictionary, TodayTask } from '../types'

import { FlatList } from 'react-native';
import moment from 'moment';
import uuid from 'react-native-uuid';
import * as TodayStorage from "../components/today/TodayStorage";
import SwipeItem from '../components/common/SwipeItem';
import { TodayItem } from '../components/today/TodayItem';
import { useStyles } from '../Styles';
import { TodayListModal } from '../components/today/TodayListModal';


const TodayScreen: React.FC = () => {
    const [modalVisible, setModalVisible] = React.useState<boolean>(false);
    const [todayItems, setTodayItems] = React.useState<TodayTask[]>([]);
    React.useEffect(() => { TodayStorage.getStoredData(setTodayItems) }, []);

    const styles = useStyles();

    const handleComplete = (id: string) => {
        // TODO set Lastcomplete stats
        // Save to local storage
        let i = 0;
        const found = todayItems?.find((elem: TodayTask, iter: number) => {
            i = iter;
            return id == elem.id;
        });
        if (!!found) {
            const todayItem = { ...todayItems[i], isComplete: !todayItems[i].isComplete };
            let newData = todayItems.slice();
            newData.splice(i, 1, todayItem);
            setTodayItems(newData);
            TodayStorage.storeData(newData);
        }
    }

    const saveTask = (item: TodayTask, action?: 'save' | 'delete') => {
        let i = 0;
        const found = todayItems.find((elem: TodayTask, iter: number) => {
            i = iter;
            return item.id == elem.id;
        });
        let newData = todayItems;
        if (!!found) {
            if (action == 'delete') {
                newData.splice(i, 1);
            } else {
                newData.splice(i, 1, item)
            }
        } else {
            newData = [...todayItems, item];
        }
        setTodayItems(newData);
        TodayStorage.storeData(newData);
    }

    const renderData = todayItems.sort((a, b) => {
        if (a.startTime == b.startTime) {
            return a.endTime > b.endTime ? 1 : -1;
        }
        return a.startTime > b.endTime ? 1 : -1;
    });

    return (
        <MainLayout
            addAction={() => {
                setModalVisible(!modalVisible);
            }}
            title={moment().format('MMMM D')}
        >
            <FlatList
                data={renderData}
                style={styles.modalScrollview}
                renderItem={({ item }: { item: TodayTask }) =>
                    <SwipeItem >
                        <TodayItem
                            toggleComplete={() => handleComplete(item.id)}
                            {...item} />
                    </SwipeItem>}
                keyExtractor={(item: TodayTask) => item.id} />
            <TodayListModal
                modalVisible={modalVisible}
                toggleModalVisible={() => setModalVisible(!modalVisible)}
                addTask={saveTask}
            />
        </MainLayout >
    );
}



export default TodayScreen;