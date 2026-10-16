import { useLayoutEffect, useRef } from "react";

export interface UseFilePickerOptions {
  multiple?: boolean;
  accept?: string;
  onFilesSelected?: (files: File[]) => void;
}

export const useFilePicker = ({
  multiple = false,
  accept,
  onFilesSelected,
}: UseFilePickerOptions = {}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onFilesSelectedRef = useRef(onFilesSelected);

  useLayoutEffect(() => {
    onFilesSelectedRef.current = onFilesSelected;
  });

  const openFilePicker = () => {
    let input = inputRef.current;
    if (!input) {
      input = document.createElement("input");
      input.type = "file";
      inputRef.current = input;
    }

    input.multiple = multiple;
    input.accept = accept ?? "";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const filesArray = Array.from(target.files);
        onFilesSelectedRef.current?.(filesArray);
      }
      target.value = "";
    };

    input.click();
  };

  return {
    openFilePicker,
  };
};
