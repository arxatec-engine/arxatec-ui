import { StatusMessage } from "@/components/status_message";
import { ImageOff } from "lucide-react";

export const ErrorState = () => {
  return (
    <StatusMessage
      title="Sucedio un error al cargar la imgen"
      description="Vuelve a intentarlo dentro de unos minutos si el error persiste, contacta con soporte"
      icon={ImageOff}
    />
  );
};
