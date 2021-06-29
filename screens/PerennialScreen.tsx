import * as React from 'react';
import { FlatList, Pressable } from 'react-native';
import MainLayout from '../components/MainLayout';
import uuid from 'react-native-uuid';
import { Perennial } from '../types';
import { PerennialItem } from '../components/perennials/PerennialItems';
import AddPerennialModal from '../components/perennials/AddPerennialModal';



export const perennialData = [
    {
        id: uuid.v4(),
        name: "Fitness",
        subtasks: [
            {
                id: uuid.v4(),
                name: "Pullups",
                subtasks: [],
                milestones: [
                    {
                        id: uuid.v4(),
                        name: "5x3",
                        isComplete: true,
                    },
                    {
                        id: uuid.v4(),
                        name: "4x4",
                        isComplete: true,
                    },
                    {
                        id: uuid.v4(),
                        name: "6x3",
                        isComplete: false,
                    },
                ]
            },
            {
                id: uuid.v4(),
                name: "Dips",
                subtasks: [],
                milestones: [
                    {
                        id: uuid.v4(),
                        name: "8x3",
                        isComplete: false,
                    }
                ]
            },
            {
                id: uuid.v4(),
                name: "Leg Raises",
                subtasks: [],
                milestones: [
                    {
                        id: uuid.v4(),
                        name: "5x5",
                        isComplete: true,
                    },
                    {
                        id: uuid.v4(),
                        name: "8x3",
                        isComplete: false,
                    }
                ]
            },
        ]
    },

] as Perennial[];

export default function PerennialScreen() {
    const [modalVisible, setModalVisible] = React.useState(false);
    const addOrUpdatePerennial = (item: Perennial) => {
        let i = 0;
        const found = perennialData.find((elem: Perennial, iter: number) => {
            i = iter;
            return item.id == elem.id;
        });
        if (!!found) {
            perennialData[i] = item;
        }
        else {
            perennialData.push(item);
        }
        setModalVisible(false);
    }

    return (
        <MainLayout title={'Perennials'} addAction={() => {
            setModalVisible(!modalVisible);
        }} >
            <FlatList
                data={perennialData}
                renderItem={({ item }: { item: Perennial }) =>
                    <PerennialItem
                        setParentModalVisible={() => { setModalVisible(!modalVisible); }}
                        addOrUpdatePerennial={addOrUpdatePerennial}
                        {...item} />}
                keyExtractor={(item: Perennial) => item.id} />
            <AddPerennialModal
                modalVisible={modalVisible}
                addOrUpdatePerennial={addOrUpdatePerennial}
                setParentModalVisible={() => {
                    setModalVisible(false);
                }} />
        </MainLayout >
    );
}


