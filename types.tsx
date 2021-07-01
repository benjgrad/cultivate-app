/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import moment from "moment";

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  Annuals: undefined;
  Today: undefined;
  Perennials: undefined
};


export interface BaseTask {
  id: string;
  name: string;
}

export interface MileStone extends BaseTask {
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
  parent?: BaseTask;
  subtasks: Perennial[];
  frequency?: string; //TODO use value in array?
  milestones?: MileStone[];
}

export type TabOneParamList = {
  TabOneScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};
