import * as React from 'react';
import MainLayout from '../components/MainLayout';

import { Dictionary, newTodayTask, TodayTask } from '../types'

import { Dimensions, FlatList, InteractionManager, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import moment from 'moment';
import uuid from 'react-native-uuid';
import * as TodayStorage from "../components/today/TodayStorage";
import SwipeItem from '../components/common/SwipeItem';
import { TodayItem } from '../components/today/TodayItem';
import { useStyles } from '../Styles';
import { TodayListModal } from '../components/today/TodayListModal';
import { TimePickerModal } from '../components/today/TimePickerModal';
import Animated from 'react-native-reanimated';
import { Text, View } from '../components/Themed';


const TodayScreen: React.FC = () => {
    const [modalVisible, setModalVisible] = React.useState<boolean>(false);
    const [timeModalVisible, setTimeModalVisible] = React.useState(false);
    const [todayItems, setTodayItems] = React.useState<TodayTask[]>([]);
    const [currenItem, setCurrentItem] = React.useState<TodayTask>(newTodayTask());
    const [currentDate, setCurrentDate] = React.useState<moment.Moment>(moment());
    const [dateList, setDateList] = React.useState<Dictionary<moment.Moment>>({});
    React.useEffect(() => { TodayStorage.getStoredData(currentDate, setTodayItems) }, [currentDate.toISOString()]);
    // let Ref = React.useRef<FlatList<moment.Moment>>(null);
    React.useEffect(() => {
        let dates = {} as Dictionary<moment.Moment>;
        for (let i = -2; i < 10; i++) {
            dates[moment().add(i, 'd').format('YYYY DD MMMM')] = moment().add(i, 'd');
        }
        setDateList(dates);
    }, []);

    const styles = useStyles();
    const { width: screenWidth } = Dimensions.get('window');

    const handleComplete = (id: string) => {
        let i = 0;
        const found = todayItems?.find((elem: TodayTask, iter: number) => {
            i = iter;
            return id == elem.id;
        });
        if (found) {
            const todayItem = { ...todayItems[i], isComplete: !todayItems[i].isComplete };
            let newData = todayItems.slice();
            newData.splice(i, 1, todayItem);
            setTodayItems(newData);
            TodayStorage.storeItem(todayItem);
            TodayStorage.storeData(currentDate, newData);
        }
    }

    const saveTask = (item: TodayTask, action?: 'save' | 'delete') => {
        let i = 0;
        const found = todayItems.find((elem: TodayTask, iter: number) => {
            i = iter;
            return item.id == elem.id;
        });
        let newData = Object.assign([], todayItems) as TodayTask[];
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
        TodayStorage.storeData(currentDate, newData);
    }

    todayItems.sort((a, b) => {
        return a.startTime.isAfter(b.startTime) ? 1 : -1;
    });
    const getItemLayout = (_: any, index: number) => {
        return { length: screenWidth - 110, offset: (screenWidth - 110) * index, index };
    }
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        setCurrentDate(moment().add(event.nativeEvent.contentOffset.x / (screenWidth - 110), 'd'));
    }


    return (
        <MainLayout
            addAction={() => {
                setModalVisible(!modalVisible);
            }}
            title=''
            titleComponent={
                <View style={styles.titleContainer}>
                    <FlatList
                        getItemLayout={getItemLayout}
                        initialScrollIndex={2}
                        onScroll={handleScroll}
                        horizontal
                        data={Object.values(dateList)}
                        showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={10}
                        pagingEnabled
                        renderItem={({ item }) => {
                            return <Text key={item.toISOString()} style={styles.todayTitle} >
                                {item.format('MMMM D')}
                            </Text>;
                        }}
                    />
                </View>
            }
        >
            <FlatList
                data={todayItems}
                style={styles.modalScrollview}
                renderItem={({ item }: { item: TodayTask }) =>
                    <TodayItem
                        {...item}
                        toggleComplete={() => handleComplete(item.id)}
                        onOpen={(item) => {
                            setCurrentItem(item);
                            setTimeModalVisible(true);
                        }} />}
                keyExtractor={(item: TodayTask) => item.id} />
            <TodayListModal
                currentDate={currentDate}
                modalVisible={modalVisible}
                toggleModalVisible={() => setModalVisible(!modalVisible)}
                addTask={saveTask}
            />
            <TimePickerModal
                {...currenItem}
                currentDate={currentDate}
                modalVisible={timeModalVisible}
                onClose={(item) => {
                    setTimeModalVisible(false);
                    saveTask(item);
                }}
                onDelete={(item) => {
                    setTimeModalVisible(false);
                    saveTask(item, 'delete');
                }} />
        </MainLayout >
    );
}


export default TodayScreen;