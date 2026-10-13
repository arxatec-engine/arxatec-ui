import { useContext } from "react";
import { EditableFieldsContext } from "../context";
export const useEditableFields = () => useContext(EditableFieldsContext);
