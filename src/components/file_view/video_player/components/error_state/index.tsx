import { StatusMessage } from "@/components/status_message";
import { FileX } from "lucide-react";

export const ErrorState = () => {
  return (
    <div className="p-4 h-full w-full">
      <StatusMessage
        title="Sucedio un error inesperado"
        icon={FileX}
        description="Sucedio un error al cargar el video, vuelve a intentarlo dentro de un momento, si el error persiste, contacta con soporte."
        classNameCard="w-full h-full flex-col items-center justify-center"
        classNameIconCard="mx-auto"
        classNameDescription="text-center w-full max-w-sm"
        classNameTitle="text-center w-full"
      />
    </div>
  );
};
