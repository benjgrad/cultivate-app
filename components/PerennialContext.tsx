import React from "react";
import { Perennial, PerennialVoidFn } from "../types";

type PerennialContextType = {
  currentItem: Perennial;
  savePerennial: PerennialVoidFn;
  deletePerennial: PerennialVoidFn;
  openParentModal: () => void;
  setCurrentItem: (
    newItem: Perennial,
    parentModalOpener: () => void,
    perennialSaver: PerennialVoidFn,
    perennialDeleter: PerennialVoidFn
  ) => void;
};

export const PerennialContext = React.createContext<PerennialContextType>({
  currentItem: {} as Perennial,
  savePerennial: (item: Perennial) => { },
  deletePerennial: (item: Perennial) => { },
  openParentModal: () => { },
  setCurrentItem: (
    newItem: Perennial,
    parentModalOpener: () => void,
    perennialSaver: PerennialVoidFn,
    perennialDeleter: PerennialVoidFn
  ) => { },
});
