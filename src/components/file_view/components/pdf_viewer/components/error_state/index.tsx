import { FileText } from "lucide-react";

import { FileViewErrorState } from "../../../error_state";

export const ErrorState = () => (
  <FileViewErrorState
    title="No se pudo abrir el PDF"
    description="Vuelve a intentarlo en unos momentos."
    icon={FileText}
  />
);
