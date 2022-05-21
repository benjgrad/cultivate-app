import * as React from 'react';
import MainLayout from '../components/MainLayout';

import { Dictionary, TodayTask } from '../types'

import { FlatList } from 'react-native';
import moment from 'moment';
import uuid from 'react-native-uuid';
import SwipeItem from '../components/common/SwipeItem';
import { TodayItem } from '../components/today/TodayItem';
import { useStyles } from '../Styles';
import { TodayListModal } from '../components/today/TodayListModal';


// const taskData = [
//     {
//         id: uuid.v4(),
//         name: 'Workout',
//         isComplete: false,
//         startTime: moment(),
//         endTime: moment()
//     },
//     {
//         id: uuid.v4(),
//         name: 'Make dinner',
//         isComplete: false,
//         startTime: moment(),
//         endTime: moment()
//     },
//     {
//         id: uuid.v4(),
//         name: 'Work on code for app',
//         isComplete: false,
//         startTime: moment(),
//         endTime: moment()
//     },
//     {
//         id: uuid.v4(),
//         name: 'Find waldo',
//         isComplete: false,
//         startTime: moment(),
//         endTime: moment()
//     },
//     {
//         id: uuid.v4(),
//         name: 'Call Mom',
//         isComplete: false,
//         startTime: moment(),
//         endTime: moment()
//     },
//     {
//         id: uuid.v4(),
//         name: 'Vacuum',
//         isComplete: false,
//         startTime: moment(),
//         endTime: moment()
//     },
//     {
//         id: uuid.v4(),
//         name: 'Book a vaccine',
//         isComplete: false,
//         startTime: moment(),
//         endTime: moment()
//     },
// ] as TodayTask[];

const TodayScreen: React.FC = () => {
    const [modalVisible, setModalVisible] = React.useState<boolean>(false);
    const [todayItems, setTodayItems] = React.useState<TodayTask[]>([]);
    React.useEffect(() => { }, []);

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
            let newItems = todayItems.slice();
            newItems.splice(i, 1, todayItem);
            setTodayItems(newItems);
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
                addTask={saveTask}
            />
        </MainLayout >
    );
}



export default TodayScreen;