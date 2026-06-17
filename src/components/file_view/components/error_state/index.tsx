import { FileText } from "lucide-react";
import { StatusMessage } from "@/components/status_message";

export const FileViewErrorState = () => (
  <div className="p-6 h-full">
    <StatusMessage
      title="Sucedio un error inesperado"
      icon={FileText}
      description="Sucedio un error, vuelve a intentarlo dentro de un momento, si el error persiste, contacta con soporte."
      classNameCard="w-full h-full flex-col items-center justify-center"
      classNameIconCard="mx-auto"
      classNameDescription="text-center w-full max-w-sm"
      classNameTitle="text-center w-full"
    />
  </div>
);
