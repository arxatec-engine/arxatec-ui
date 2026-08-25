import { useId } from "react";

import { ALL_VALUE } from "./constants";

import { Label } from "../label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";

interface Props {
  size?: "default" | "sm";
  label?: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder: string;
  options: { id: string; name: string }[];
  isLoading?: boolean;
  isError?: boolean;
  emptyLabel?: string;
  loadingLabel?: string;
  errorLabel?: string;
  allLabel?: string;
  showAllOption?: boolean;
  className?: string;
}

export const AsyncSelect = ({
  size = "default",
  label,
  value,
  onChange,
  placeholder,
  options,
  isLoading = false,
  isError = false,
  emptyLabel = "No results",
  loadingLabel = "Loading…",
  errorLabel = "Failed to load",
  allLabel = "All",
  showAllOption = true,
  className,
}: Props) => {
  const labelId = useId();
  const hasOptions = Array.isArray(options) && options.length > 0;

  return (
    <>
      {label && (
        <Label id={labelId} className="mb-2 block">
          {label}
        </Label>
      )}
      <Select
        value={value || ""}
        onValueChange={(next) =>
          onChange(next === ALL_VALUE ? undefined : next)
        }
      >
        <SelectTrigger
          size={size}
          className={className}
          aria-labelledby={label ? labelId : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {isError ? (
            <SelectItem value="error" disabled>
              {errorLabel}
            </SelectItem>
          ) : isLoading ? (
            <SelectItem value="loading" disabled>
              {loadingLabel}
            </SelectItem>
          ) : !hasOptions ? (
            <SelectItem value="empty" disabled>
              {emptyLabel}
            </SelectItem>
          ) : (
            <>
              {options.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
              {showAllOption && (
                <SelectItem value={ALL_VALUE}>{allLabel}</SelectItem>
              )}
            </>
          )}
        </SelectContent>
      </Select>
    </>
  );
};
