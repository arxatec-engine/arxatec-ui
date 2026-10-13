import { useMemo } from "react";
import {
  EditableFieldsContext,
  type EditableFieldsProviderProps,
} from "./context";
import { useEditableFields } from "./hooks";
export type { EditableFieldsProviderProps } from "./context";

export const EditableFieldsProvider = ({
  children,
  labels,
  locale,
  dateFormat,
  tableDateFormat,
  swatches,
}: EditableFieldsProviderProps) => {
  const parent = useEditableFields();
  const value = useMemo(
    () => ({
      labels: { ...parent.labels, ...labels },
      locale: locale ?? parent.locale,
      dateFormat: dateFormat ?? parent.dateFormat,
      tableDateFormat: tableDateFormat ?? parent.tableDateFormat,
      swatches: swatches ?? parent.swatches,
    }),
    [parent, labels, locale, dateFormat, tableDateFormat, swatches],
  );
  return (
    <EditableFieldsContext.Provider value={value}>
      {children}
    </EditableFieldsContext.Provider>
  );
};
