import * as React from 'react';
import { SafeAreaView, ViewPropsIOS } from 'react-native';
import MainLayout from '../components/MainLayout';

import { TodayTask } from '../types'

import { FlatList } from 'react-native-gesture-handler';
import moment from 'moment';
import uuid from 'react-native-uuid';
import SwipeItem from '../components/common/SwipeItem';
import { TodayItem } from '../components/today/TodayItem';
import { useStyles } from '../Styles';
import { TodayListModal } from '../components/today/TodayListModal';


const taskData = [
    {
        id: uuid.v4(),
        name: 'Workout',
        isComplete: false,
        startTime: moment(),
        endTime: moment()
    },
    {
        id: uuid.v4(),
        name: 'Make dinner',
        isComplete: false,
        startTime: moment(),
        endTime: moment()
    },
    {
        id: uuid.v4(),
        name: 'Work on code for app',
        isComplete: false,
        startTime: moment(),
        endTime: moment()
    },
    {
        id: uuid.v4(),
        name: 'Find waldo',
        isComplete: false,
        startTime: moment(),
        endTime: moment()
    },
    {
        id: uuid.v4(),
        name: 'Call Mom',
        isComplete: false,
        startTime: moment(),
        endTime: moment()
    },
    {
        id: uuid.v4(),
        name: 'Vacuum',
        isComplete: false,
        startTime: moment(),
        endTime: moment()
    },
    {
        id: uuid.v4(),
        name: 'Book a vaccine',
        isComplete: false,
        startTime: moment(),
        endTime: moment()
    },
] as TodayTask[];

const TodayScreen: React.FC = () => {
    const [modalVisible, setModalVisible] = React.useState<boolean>(false);
    const [todayItems, setTodayItems] = React.useState<TodayTask[]>(taskData);

    const styles = useStyles();

    const handleComplete = (id: string) => {
        let i = 0;
        const found = todayItems?.find((elem: TodayTask, iter: number) => {
            i = iter;
            return id == elem.id;
        });
        if (!!found) {
            const todayItem = { ...todayItems[i], isComplete: !todayItems[i].isComplete };
            let newItems = todayItems.slice();
            newItems.splice(i, 1, todayItem);
            setTodayItems(newItems);
        }
    }

    return (
        <MainLayout
            addAction={() => {
                setModalVisible(!modalVisible);
            }}
            title={moment().format('MMMM D')}
        >
            <FlatList
                data={todayItems}
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
            />
        </MainLayout >
    );
}



export default TodayScreen;