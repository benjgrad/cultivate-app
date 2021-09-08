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
        name: "App development",
        subtasks: [
            {
                id: uuid.v4(),
                name: "Today Screen",
                milestones: [
                    {
                        id: uuid.v4(),
                        name: "Prioritize tasks",
                        isComplete: false,
                    },
                    {
                        id: uuid.v4(),
                        name: "Add task modal",
                        isComplete: false,
                    },
                    {
                        id: uuid.v4(),
                        name: "Schedule time modal",
                        isComplete: false,
                    },
                    {
                        id: uuid.v4(),
                        name: "Swipe threshold handler",
                        isComplete: false,
                    },
                ],
            },
            {
                id: uuid.v4(),
                name: "Perennials Screen",
                milestones: [
                    {
                        id: uuid.v4(),
                        name: "Prioritize perennials",
                        isComplete: false,
                    },
                    {
                        id: uuid.v4(),
                        name: "Milestones editor",
                        isComplete: false,
                    },
                    {
                        id: uuid.v4(),
                        name: "Delete item",
                        isComplete: false,
                    },
                    {
                        id: uuid.v4(),
                        name: "Hide completed tasks",
                        isComplete: false,
                    },
                    {
                        id: uuid.v4(),
                        name: "Category picker",
                        isComplete: false,
                    },
                    {
                        id: uuid.v4(),
                        name: "Category picker",
                        isComplete: false,
                    },
                ],
            },
            {
                id: uuid.v4(),
                name: "Annuals Screen",
                milestones: [
                    {
                        id: uuid.v4(),
                        name: "Read device calendar",
                        isComplete: false,
                    },
                    {
                        id: uuid.v4(),
                        name: "Display upcoming events",
                        isComplete: false,
                    },
                    {
                        id: uuid.v4(),
                        name: "Display subtasks",
                        isComplete: false,
                    },
                    {
                        id: uuid.v4(),
                        name: "Create time to complete editor",
                        isComplete: false,
                    },
                    {
                        id: uuid.v4(),
                        name: "Display subtasks in modal",
                        isComplete: false,
                    },
                    {
                        id: uuid.v4(),
                        name: "Create add subtask modal",
                        isComplete: false,
                    },
                    {
                        id: uuid.v4(),
                        name: "Create add event modal",
                        isComplete: false,
                    },
                ],
            },
        ]
    },
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
                        setParentModalVisible={() => { }}
                        addOrUpdatePerennial={addOrUpdatePerennial}
                        {...item} />}
                keyExtractor={(item: Perennial) => item.id} />
            <AddPerennialModal
                currentItem={({
                    id: uuid.v4(),
                    name: "",
                    milestones: [],
                    subtasks: [],
                } as Perennial)}
                modalVisible={modalVisible}
                addOrUpdatePerennial={addOrUpdatePerennial}
                setParentModalVisible={() => {
                    setModalVisible(false);
                }} />
        </MainLayout >
    );
}


