import { useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/avatar";
import { AvatarInput } from "@/components/avatar_input";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerSearch,
} from "@/components/emoji_picker";
import { IconPicker, type IconName } from "@/components/icon_picker";

import { ComponentPreview } from "../../../component_preview";

export const ProfileExamples = () => {
  const [icon, setIcon] = useState<IconName>("sparkles");
  const [emoji, setEmoji] = useState("✨");

  return (
    <>
      <ComponentPreview
        title="Avatar"
        description="Identifica personas de un vistazo. Las iniciales mantienen una referencia útil cuando no hay fotografía."
      >
        <div className="flex items-center justify-center gap-4">
          <Avatar className="size-12 border">
            <AvatarFallback>MG</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">María García</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Equipo de diseño
            </p>
          </div>
        </div>
      </ComponentPreview>
      <ComponentPreview
        title="AvatarInput"
        description="Reúne selección, recorte y vista previa de la foto de perfil. La persona puede revisar el resultado antes de guardarlo."
      >
        <AvatarInput
          fullName="María García"
          label="Foto de perfil"
          labels={{
            optional: "(opcional)",
            add: "Añadir foto",
            change: "Cambiar foto",
            remove: "Quitar foto",
            previewAlt: "Vista previa del perfil",
          }}
          onAvatarChange={(file) =>
            toast.success(file ? "Foto actualizada" : "Foto eliminada")
          }
        />
      </ComponentPreview>
      <ComponentPreview
        title="IconPicker"
        description="Permite elegir un símbolo para proyectos o espacios. Una vista previa inmediata hace más fácil reconocer la elección."
      >
        <div className="flex items-center justify-center gap-4">
          <IconPicker
            value={icon}
            onValueChange={(value) => value && setIcon(value)}
          />
          <p className="text-sm text-muted-foreground">
            Dale identidad a tu proyecto
          </p>
        </div>
      </ComponentPreview>
      <ComponentPreview
        title="EmojiPicker"
        description="Añade una expresión visual familiar a nombres y mensajes. La búsqueda ayuda a encontrar una opción entre muchas."
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Tu selección: <span className="text-lg">{emoji}</span>
          </p>
          <EmojiPicker
            onEmojiSelect={({ emoji: nextEmoji }) => setEmoji(nextEmoji)}
            className="h-60 w-full rounded-lg border bg-background"
          >
            <EmojiPickerSearch
              placeholder="Buscar un emoji…"
              aria-label="Buscar un emoji"
            />
            <EmojiPickerContent />
          </EmojiPicker>
        </div>
      </ComponentPreview>
    </>
  );
};
