import { useState } from "react";
import { FileTypeIcon } from "../../../../file_type_icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../select";
import type { ExplorerFilterOption } from "../../types";

export interface ExplorerFilterSelectProps {
  options: ExplorerFilterOption[];
  placeholder: string;
  allLabel: string;
  onChange: (value: string | undefined) => void;
  value?: string;
  allValue?: string;
}

export const ExplorerFilterSelect = (props: ExplorerFilterSelectProps) => {
  const {
    options,
    placeholder,
    allLabel,
    onChange,
    value,
    allValue = "todos",
  } = props;
  const [selection, setSelection] = useState(allValue);
  const controlled = Object.prototype.hasOwnProperty.call(props, "value");
  return (
    <Select
      value={controlled ? (value ?? allValue) : selection}
      onValueChange={(next) => {
        if (!controlled) setSelection(next);
        onChange(next === allValue ? undefined : next);
      }}
    >
      <SelectTrigger size="sm" className="w-full sm:w-[240px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="w-full sm:w-[240px]">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.mimeType ? (
              <FileTypeIcon mimeType={option.mimeType} />
            ) : (
              <option.icon className="size-4" />
            )}
            {option.label}
          </SelectItem>
        ))}
        <SelectItem value={allValue}>{allLabel}</SelectItem>
      </SelectContent>
    </Select>
  );
};
