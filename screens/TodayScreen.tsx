import * as React from 'react';
import { SafeAreaView, ViewPropsIOS } from 'react-native';
import MainLayout from '../components/MainLayout';

import { TodayTask } from '../types'

import { FlatList } from 'react-native-gesture-handler';
import moment from 'moment';
import uuid from 'react-native-uuid';
import SwipeItem from '../components/common/SwipeItem';
import { TodayItem } from '../components/today/TodayItem';


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
    return (
        <MainLayout title={moment().format('MMMM D')} >
            <FlatList
                data={taskData}
                renderItem={({ item }: { item: TodayTask }) =>
                    <SwipeItem >
                        <TodayItem
                            id={item.id}
                            name={item.name}
                            startTime={item.startTime}
                            endTime={item.endTime}
                            isComplete={item.isComplete} />
                    </SwipeItem>}
                keyExtractor={(item: TodayTask) => item.id} />
        </MainLayout >
    );
}



export default TodayScreen;