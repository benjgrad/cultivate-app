import * as React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import uuid from "react-native-uuid";
import { Text, View } from "../Themed";
import { BaseTask, Frequency, MileStone, Perennial, PerennialSaveFn } from "../../types";
import { Ionicons } from "@expo/vector-icons";
import { MileStoneItem } from "./MilestoneProps";
import { PerennialContext } from "../PerennialContext";
import { removeItem, storeItem } from "../../screens/PerennnialStorage";

interface PerennialItemProps extends Perennial {
    propogateChange: PerennialSaveFn;
    setParentAsCurrent: () => void;
}

const itemHeight = 50;
const checkBoxHeight = 30;
export const PerennialItem: React.FC<PerennialItemProps> = (props) => {
    const perennialContext = React.useContext(PerennialContext);

    const thisItem = props as Perennial;

    const addSubtask = (item: Perennial) => {
        storeItem(item);
        let subtasks = thisItem.subtasks || [];
        subtasks.push(item);
        saveThisPerennial({ ...thisItem, subtasks }, 'save');
    }

    const toggleMilestoneComplete = (id: string) => {
        let i = 0;
        const found = thisItem.milestones?.find((elem: MileStone, iter: number) => {
            i = iter;
            return id == elem.id;
        });
        if (!!found && !!thisItem.milestones) {
            found.isComplete = !found.isComplete;
            thisItem.milestones[i] = found;
            saveThisPerennial(thisItem);
        }
    };

    const saveThisPerennial = (item: Perennial, action: 'save' | 'delete' = 'save') => {
        //Update the current perennial
        if (item.id == thisItem.id) {
            if (action == 'delete') {
                removeItem(item);
            }
            else {
                storeItem(item);
            }
            props.propogateChange(item, action);
        } else {
            //Add to subtasks if none are found
            if (!thisItem.subtasks) {
                thisItem.subtasks = [item];
            } else {
                let i = 0;
                const found = thisItem.subtasks?.find((elem: Perennial, iter: number) => {
                    i = iter;
                    return item.id == elem.id;
                });

                //Add to subtaks if none are found
                if (!found) {
                    thisItem.subtasks.push(item);
                }
                //Update subtask if found
                else {
                    if (action == 'delete') {
                        thisItem.subtasks.splice(i, 1)
                    }
                    else {
                        thisItem.subtasks[i] = item;
                    }
                }
            }
            //propogate changes to parent
            storeItem(thisItem);
            props.propogateChange(thisItem, 'save');
        }
    };

    const setThisToCurrent = () => {
        perennialContext.setCurrentItem(thisItem, saveThisPerennial, props.setParentAsCurrent);
    };
    return (
        <>
            <View style={styles.box}>
                <View style={styles.textContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            //Edit thisItem
                            perennialContext.setCurrentItem(thisItem, saveThisPerennial, props.setParentAsCurrent);
                        }}
                    >
                        <Text style={styles.name}>{props.name}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        const newItem: Perennial = {
                            id: uuid.v4().toString(),
                            parent: thisItem.id,
                            name: "",
                            milestones: [],
                            frequency: { recurrences: 1, interval: "week" } as Frequency,
                            subtasks: [],
                        };
                        perennialContext.setCurrentItem(newItem, addSubtask, setThisToCurrent);
                    }}
                >
                    <Ionicons style={styles.addSubtask} size={checkBoxHeight} name="add" />
                </TouchableOpacity>
            </View>
            <View style={styles.subtasks}>
                {props.subtasks &&
                    props.subtasks.map((subtask) => (
                        <PerennialItem
                            setParentAsCurrent={setThisToCurrent}
                            propogateChange={saveThisPerennial}
                            key={subtask.id}
                            {...{ ...subtask, parent: thisItem.id }}
                        />
                    ))}
                {props.milestones &&
                    props.milestones.map((item) => <MileStoneItem key={item.id} toggleComplete={toggleMilestoneComplete} {...item} />)}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    subtasks: {
        backgroundColor: "#ffff0000",
        marginLeft: 20,
    },
    textContainer: {
        backgroundColor: "#ffff0000",
        marginHorizontal: 24,
        justifyContent: "center",
        flex: 1,
    },
    box: {
        backgroundColor: "#acb5ac",
        height: itemHeight,
        margin: 5,
        alignSelf: "stretch",
        borderRadius: 15,
        flexDirection: "row",
    },
    name: {
        fontSize: 20,
    },
    time: {},
    addSubtask: {
        width: checkBoxHeight,
        height: checkBoxHeight,
        position: "absolute",
        right: 15,
        top: (itemHeight - checkBoxHeight) / 2,
    },
});
