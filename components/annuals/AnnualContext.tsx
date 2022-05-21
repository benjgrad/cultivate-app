import * as React from "react";
import { Annual, AnnualEvent, AnnualSaveFn } from "../../types";

type AnnualContextType = {
    currentItem: Annual | AnnualEvent,
    saveCurrentItem: AnnualSaveFn<Annual | AnnualEvent>;
    setCurrentItem: (item: Annual | AnnualEvent, saveCurrentItem: AnnualSaveFn<Annual> | AnnualSaveFn<AnnualEvent>, setParentAsCurrent: () => void) => void;
    setParentAsCurrent: () => void;
}

export const AnnualContext = React.createContext<AnnualContextType>({
    currentItem: {} as Annual | AnnualEvent,
    saveCurrentItem: (item: Annual | AnnualEvent, action: 'save' | 'delete') => { },
    setCurrentItem: (item: Annual | AnnualEvent, saveCurrentItem: AnnualSaveFn<Annual> | AnnualSaveFn<AnnualEvent>, setParentAsCurrent: () => void) => { },
    setParentAsCurrent: () => { }
});