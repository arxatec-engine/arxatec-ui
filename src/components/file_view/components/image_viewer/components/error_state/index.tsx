import { ImageOff } from "lucide-react";

import { FileViewErrorState } from "../../../error_state";

export const ErrorState = () => (
  <FileViewErrorState
    title="No se pudo cargar la imagen"
    description="Vuelve a intentarlo en unos momentos."
    icon={ImageOff}
  />
);
