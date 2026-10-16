export interface UseFolderPickerOptions {
  onFolderSelected?: (files: File[]) => void;
}

interface HTMLInputElementWithDirectory extends HTMLInputElement {
  webkitdirectory: boolean;
  directory: boolean;
}

export const useFolderPicker = ({
  onFolderSelected,
}: UseFolderPickerOptions = {}) => {
  const openFolderPicker = (
    options?: { multiple?: boolean },
    callback?: (files: File[]) => void,
  ) => {
    const input = document.createElement(
      "input",
    ) as HTMLInputElementWithDirectory;

    input.type = "file";
    input.webkitdirectory = true;
    input.directory = true;

    if (options?.multiple) {
      input.multiple = true;
    }

    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const filesArray = Array.from(target.files);
        callback?.(filesArray);
        onFolderSelected?.(filesArray);
      }
    };

    input.click();
  };

  return {
    openFolderPicker,
  };
};
