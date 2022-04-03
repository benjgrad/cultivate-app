import * as React from "react";
import { Perennial, PerennialSaveFn } from "../types";

type PerennialContextType = {
  currentItem: Perennial;
  saveCurrentItem: PerennialSaveFn;
  openModal: (isOpen: boolean) => void; //TODO remove bool param
  setCurrentItem: (item: Perennial, saveCurrentItem: PerennialSaveFn, setParentAsCurrent: () => void) => void;
  setParentAsCurrent: () => void;
};

export const PerennialContext = React.createContext<PerennialContextType>({
  currentItem: {} as Perennial,
  saveCurrentItem: (item: Perennial, action: 'save' | 'delete' = 'save') => { },
  openModal: (isOpen: boolean) => { },
  setCurrentItem: (item: Perennial, saveCurrentItem: PerennialSaveFn, setParentAsCurrent: () => void) => { },
  setParentAsCurrent: () => { }
});
