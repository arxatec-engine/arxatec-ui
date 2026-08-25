import type { ChangeEvent } from "react";
import { useRef, useState } from "react";

import type { AvatarFileError } from "../../utilities";
import { readFileAsDataUrl, validateAvatarFile } from "../../utilities";

interface Params {
  defaultAvatar?: string;
  onAvatarChange: (file: File | undefined) => void;
}

/**
 * Mientras el usuario no toque nada, la vista previa es la del avatar que llega
 * por props; en cuanto sube o borra una foto manda su elección, aunque
 * `defaultAvatar` cambie después. Guardarlo así evita el `useEffect` que
 * sincronizaba prop y estado —y que nunca limpiaba la vista previa—.
 */
type Preview = { source: "default" } | { source: "user"; url: string | null };

/**
 * Máquina de estados de la selección de avatar: validar el archivo elegido,
 * pasarlo por el recorte y quedarse con la vista previa del resultado. El
 * archivo solo sale hacia el consumidor una vez recortado.
 */
export const useAvatarInput = ({ defaultAvatar, onAvatarChange }: Params) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Preview>({ source: "default" });
  const [error, setError] = useState<AvatarFileError | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const previewUrl =
    preview.source === "default" ? defaultAvatar ?? null : preview.url;

  const selectFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    // El input se vacía siempre: si no, reelegir el mismo archivo no dispara `change`.
    event.target.value = "";

    if (!selected) {
      setError(null);
      return;
    }

    const validationError = validateAvatarFile(selected);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    // Si la lectura falla no hay nada que recortar: mismo desenlace que antes,
    // cuando `onload` simplemente no llegaba a ejecutarse.
    await readFileAsDataUrl(selected).then(setImageToCrop, () => {});
  };

  const applyCrop = async (croppedFile: File) => {
    setError(null);
    setFile(croppedFile);
    onAvatarChange(croppedFile);
    setImageToCrop(null);
    await readFileAsDataUrl(croppedFile).then(
      (url) => setPreview({ source: "user", url }),
      () => {}
    );
  };

  const cancelCrop = () => setImageToCrop(null);

  const openFilePicker = () => inputRef.current?.click();

  const remove = () => {
    setFile(null);
    setPreview({ source: "user", url: null });
    setError(null);
    setImageToCrop(null);
    onAvatarChange(undefined);
    if (inputRef.current) inputRef.current.value = "";
  };

  return {
    file,
    previewUrl,
    error,
    imageToCrop,
    inputRef,
    selectFile,
    applyCrop,
    cancelCrop,
    openFilePicker,
    remove,
  };
};
