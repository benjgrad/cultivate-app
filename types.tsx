/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import moment from "moment";

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type PerennialSaveFn = (item: Perennial, action: 'save' | 'delete') => void;

export type BottomTabParamList = {
  Annuals: undefined;
  Today: undefined;
  Perennials: undefined;
};

export interface Annual extends AnnualSubtask {
  startTime: moment.Moment,
  endTime: moment.Moment,
  subtasks: AnnualSubtask[]
}

export interface AnnualSubtask extends BaseTask {
  prepTime: number,
  subtasks: AnnualSubtask[]
}

export interface BaseTask {
  id: string;
  name: string;
}

export interface PerennialTaskStats extends TodayTask {
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
