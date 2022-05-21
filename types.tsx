/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { useLinkBuilder } from "@react-navigation/native";
import moment from "moment";
import uuid from "react-native-uuid";

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type PerennialSaveFn = (item: Perennial, action: 'save' | 'delete') => void;
export type AnnualSaveFn<T> = ((item: T, action: 'save' | 'delete') => void);

export type BottomTabParamList = {
  Annuals: undefined;
  Today: undefined;
  Perennials: undefined;
};

export const newAnnual = () => {
  return {
    id: uuid.v4(),
    name: "",
    subtasks: {},
    prepTime: 0,
    parent: ""
  } as Annual;
}

export interface AnnualEvent extends Annual {
  startTime: moment.Moment,
  endTime: moment.Moment,
}

export interface Annual extends BaseTask {
  parent: string,
  prepTime: number,
  subtasks: Dictionary<Annual>
}

export interface BaseTask {
  id: string;
  name: string;
}
export interface Dictionary<TValue> {
  [key: string]: TValue;
}

export interface TaskStats extends TodayTask {
  taskId: string;
  lastCompleted?: moment.Moment;
  numComplete: number;
}

export interface Milestone extends BaseTask {
  isComplete?: boolean;
}

export interface TodayTask extends BaseTask {
  isComplete: boolean;
  startTime?: moment.Moment;
  endTime?: moment.Moment;
}

export interface Perennial extends BaseTask {
  id: string;
  name: string;
  parent?: string;
  subtasks: Perennial[];
  frequency?: Frequency;
  milestones: Milestone[];
}

export interface Frequency {
  recurrences: number;
  interval: "day" | "week" | "month" | "year";
}

export type TabOneParamList = {
  TabOneScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};
