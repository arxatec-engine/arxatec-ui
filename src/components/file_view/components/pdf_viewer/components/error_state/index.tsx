import { FileText } from "lucide-react";

import { Button } from "@/components/button";

import { FileViewErrorState } from "../../../error_state";

interface Props {
  onDownload?: () => void | Promise<void>;
}

export const ErrorState = ({ onDownload }: Props) => (
  <FileViewErrorState
    title="No se pudo abrir el PDF"
    description={
      onDownload
        ? "Vuelve a intentarlo o descarga el archivo original."
        : "Vuelve a intentarlo en unos momentos."
    }
    icon={FileText}
    actions={onDownload && (
      <Button variant="outline" onClick={() => void onDownload()}>
        Descargar original
      </Button>
    )}
  />
);
