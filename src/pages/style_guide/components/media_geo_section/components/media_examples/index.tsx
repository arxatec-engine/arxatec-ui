import { Crop } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/button";
import { FileDropZone } from "@/components/file_dropzone";
import { Image } from "@/components/image";
import { ImageCropDialog } from "@/components/image_crop_dialog";

import { DEMO_IMAGE } from "../../../../constants";
import { ComponentPreview } from "../../../component_preview";

export const MediaExamples = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [cropOpen, setCropOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string>();

  useEffect(
    () => () => {
      if (croppedImage) URL.revokeObjectURL(croppedImage);
    },
    [croppedImage],
  );

  return (
    <>
      <ComponentPreview
        title="Image"
        description="Presenta una imagen con estados de carga y error. Un encuadre consistente evita que la composición cambie entre contenidos."
      >
        <Image
          src={DEMO_IMAGE}
          alt="Lago entre montañas reflejadas en el agua"
          className="aspect-video overflow-hidden rounded-md border"
        />
      </ComponentPreview>
      <ComponentPreview
        title="ImageCropDialog"
        description="Permite ajustar el encuadre antes de usar una imagen. El resultado se muestra aquí al confirmar el recorte."
      >
        <div className="flex flex-col items-center gap-5">
          <Image
            src={croppedImage ?? DEMO_IMAGE}
            alt="Vista previa del encuadre seleccionado"
            className="size-24 overflow-hidden rounded-md border"
          />
          <Button variant="outline" onClick={() => setCropOpen(true)}>
            <Crop aria-hidden="true" />
            Ajustar encuadre
          </Button>
          <ImageCropDialog
            isOpen={cropOpen}
            onClose={() => setCropOpen(false)}
            imageSrc={DEMO_IMAGE}
            onCropComplete={(file) => {
              setCroppedImage(URL.createObjectURL(file));
              toast.success("Encuadre actualizado");
            }}
          />
        </div>
      </ComponentPreview>
      <ComponentPreview
        title="FileDropZone"
        description="Ofrece arrastrar archivos o seleccionarlos desde el equipo. Comunica formatos y límites antes de que ocurra un error."
      >
        <div className="space-y-4">
          <FileDropZone
            files={files}
            onFilesChange={setFiles}
            acceptedTypes={["image/jpeg", "image/png", "application/pdf"]}
            maxFiles={3}
          />
          <p className="text-center text-sm text-muted-foreground">
            Hasta 3 archivos · JPG, PNG o PDF · 5 MB por archivo
          </p>
          <p className="text-center text-sm" aria-live="polite">
            {files.length
              ? files.map((file) => file.name).join(", ")
              : "Los archivos de esta demostración permanecen en tu navegador."}
          </p>
        </div>
      </ComponentPreview>
    </>
  );
};
