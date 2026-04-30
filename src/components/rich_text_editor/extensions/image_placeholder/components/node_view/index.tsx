import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { cn, isValidUrl } from "@/utilities";
import { type NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import {
  Image,
  Link,
  Upload,
  Loader2,
  X,
  HardDrive,
  PlusIcon,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import { useImageUpload } from "@/hooks";

export function NodeView(props: NodeViewProps) {
  const { editor, selected } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [url, setUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [urlError, setUrlError] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const {
    previewUrl,
    fileInputRef,
    handleFileChange,
    processFile,
    handleRemove,
    uploading,
    error,
  } = useImageUpload({
    uploadFn: async (file) => {
      const blobUrl = URL.createObjectURL(file);

      type ImageStorage = { image: { files: Map<string, File> } };
      const storage = editor?.storage as unknown as ImageStorage;

      if (storage?.image?.files) {
        storage.image.files.set(blobUrl, file);
      }
      return blobUrl;
    },
    onUpload: (imageUrl, file) => {
      editor
        .chain()
        .focus()
        .setImage({
          src: imageUrl,
          alt: altText || file.name,
        })
        .run();
      handleRemove();
      setIsExpanded(false);
    },
  });

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      void processFile(file);
    }
  };

  const handleInsertEmbed = (e: FormEvent) => {
    e.preventDefault();
    const valid = isValidUrl(url);
    if (!valid) {
      setUrlError(true);
      return;
    }
    if (url) {
      editor.chain().focus().setImage({ src: url, alt: altText }).run();
      setIsExpanded(false);
      setUrl("");
      setAltText("");
    }
  };

  return (
    <NodeViewWrapper className="w-full">
      <div className="relative">
        {!isExpanded ? (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className={cn(
              "group flex w-full cursor-pointer items-center gap-2 rounded-md border border-dashed border-border/20 bg-muted/20 px-2 py-2 text-left transition-colors",
              selected && "border-primary/60 bg-primary/5",
              isDragActive && "border-primary/60 bg-primary/5",
              error && "border-destructive/70 bg-destructive/5"
            )}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-foreground transition-colors">
              <Image className="size-4" aria-hidden />
            </span>
            <span className="min-w-0 flex-1 flex flex-col gap-1">
              <span className="block text-xs font-medium text-foreground">
                Añadir imagen
              </span>
              <span className="text-xs leading-1 text-muted-foreground">
                Clic o suelta aquí - SVG, PNG, JPG, GIF
              </span>
            </span>
          </button>
        ) : (
          <div className="rounded-md border border-border/60 bg-card/20 p-2">
            <div className="mb-1 flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-foreground">
                  Añadir imagen
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 shrink-0"
                onClick={() => setIsExpanded(false)}
                aria-label="Cerrar"
              >
                <X className="size-3.5" />
              </Button>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={(value: string) =>
                setActiveTab(value as "upload" | "url")
              }
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">
                  <HardDrive className="size-3.5" />
                  <span className="text-xs font-medium text-foreground">
                    Subir de dispositivo
                  </span>
                </TabsTrigger>
                <TabsTrigger value="url">
                  <Link className="size-3.5" />
                  <span className="text-xs font-medium text-foreground">
                    Enlace
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="mt-0">
                <div
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className={cn(
                    " rounded-md border border-dashed border-border/80 bg-background/40 px-3 py-4 text-center transition-colors",
                    isDragActive && "border-primary/60 bg-primary/5",
                    error && "border-destructive/60 bg-destructive/5"
                  )}
                >
                  {previewUrl ? (
                    <div className="space-y-1">
                      <img
                        src={previewUrl}
                        alt="Vista previa"
                        className="mx-auto max-h-36 w-auto max-w-full rounded-md border border-border object-contain"
                      />
                      <div className="space-y-2">
                        <Input
                          value={altText}
                          onChange={(e) => setAltText(e.target.value)}
                          placeholder="Texto alternativo (opcional)"
                          className="text-xs!"
                        />
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRemove}
                            disabled={uploading}
                          >
                            Eliminar
                          </Button>
                          <Button
                            size="sm"
                            disabled={uploading}
                            onClick={(e) => {
                              e.preventDefault();
                              if (fileInputRef.current?.files?.[0]) {
                                handleFileChange({
                                  target: fileInputRef.current,
                                } as unknown as React.ChangeEvent<HTMLInputElement>);
                              }
                            }}
                          >
                            {uploading && (
                              <Loader2 className="mr-2 size-3.5 animate-spin" />
                            )}
                            Subir
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex cursor-pointer flex-col items-center"
                      >
                        <Upload className="size-4 text-foreground" />
                        <div className="flex flex-col gap-1">
                          <p className="text-xs text-muted-foreground!">
                            Clic o suelta aquí
                            <br />
                            SVG, PNG, JPG, GIF
                          </p>
                        </div>
                      </label>
                    </>
                  )}
                  {error && (
                    <p className="mt-2 text-xs text-destructive">{error}</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="url" className="mt-0">
                <div className=" space-y-1">
                  <div className="space-y-1">
                    <Input
                      value={url}
                      onChange={(e) => {
                        setUrl(e.target.value);
                        if (urlError) setUrlError(false);
                      }}
                      size="sm"
                      className="text-xs!"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                    {urlError && (
                      <p className="text-xs text-destructive">
                        Introduce una URL válida
                      </p>
                    )}
                  </div>
                  <Input
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    className="text-xs!"
                    placeholder="Texto alternativo (opcional)"
                    size="sm"
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      size="sm"
                      onClick={handleInsertEmbed}
                      className="w-fit text-xs!"
                      disabled={!url}
                    >
                      <PlusIcon className="size-3.5" />
                      Añadir imagen
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
