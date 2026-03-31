import {
  type NodeViewProps,
  NodeViewWrapper,
} from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Edit,
  ImageIcon,
  Loader2,
  Maximize,
  MoreVertical,
  Trash,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/dropdown_menu";
import { Input } from "@/components/input";
import { Separator } from "@/components/separator";
import { Button } from "@/components/button";
import { cn } from "@/utilities";
import { useImageUpload } from "@/hooks";

export function TiptapImage(props: NodeViewProps) {
  const { node, editor, selected, deleteNode, updateAttributes } = props;
  const imageRef = useRef<HTMLImageElement | null>(null);
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [resizing, setResizing] = useState(false);
  const [resizingPosition, setResizingPosition] = useState<"left" | "right">(
    "left"
  );
  const [resizeInitialWidth, setResizeInitialWidth] = useState(0);
  const [resizeInitialMouseX, setResizeInitialMouseX] = useState(0);
  const [editingCaption, setEditingCaption] = useState(false);
  const [caption, setCaption] = useState(node.attrs.caption || "");
  const [openedMore, setOpenedMore] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const captionInputRef = useRef<HTMLInputElement>(null);
  const [altText, setAltText] = useState(node.attrs.alt || "");

  const { fileInputRef, handleFileChange, handleRemove, uploading, error } =
    useImageUpload({
      uploadFn: async (file) => {
        const blobUrl = URL.createObjectURL(file);

        type ImageStorage = { image: { files: Map<string, File> } };
        const storage = editor?.storage as unknown as ImageStorage;

        if (storage?.image?.files) {
          storage.image.files.set(blobUrl, file);
        }
        return blobUrl;
      },
      onUpload: (url) => {
        updateAttributes({
          src: url,
          alt: altText || fileInputRef.current?.files?.[0]?.name,
        });
        handleRemove();
        setOpenedMore(false);
      },
    });

  function handleResizingPosition({
    e,
    position,
  }: {
    e: React.MouseEvent<HTMLDivElement, MouseEvent>;
    position: "left" | "right";
  }) {
    startResize(e);
    setResizingPosition(position);
  }

  function startResize(event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    setResizing(true);
    setResizeInitialMouseX(event.clientX);
    if (imageRef.current) {
      setResizeInitialWidth(imageRef.current.offsetWidth);
    }
  }

  function resize(event: MouseEvent) {
    if (!resizing) return;

    let dx = event.clientX - resizeInitialMouseX;
    if (resizingPosition === "left") {
      dx = resizeInitialMouseX - event.clientX;
    }

    const newWidth = Math.max(resizeInitialWidth + dx, 150);
    const parentWidth = nodeRef.current?.parentElement?.offsetWidth ?? 0;

    if (newWidth < parentWidth) {
      updateAttributes({
        width: newWidth,
      });
    }
  }

  function endResize() {
    setResizing(false);
    setResizeInitialMouseX(0);
    setResizeInitialWidth(0);
  }

  function handleTouchStart(
    event: React.TouchEvent,
    position: "left" | "right"
  ) {
    event.preventDefault();
    setResizing(true);
    setResizingPosition(position);
    setResizeInitialMouseX(event.touches[0]?.clientX ?? 0);
    if (imageRef.current) {
      setResizeInitialWidth(imageRef.current.offsetWidth);
    }
  }

  function handleTouchMove(event: TouchEvent) {
    if (!resizing) return;

    let dx =
      (event.touches[0]?.clientX ?? resizeInitialMouseX) - resizeInitialMouseX;
    if (resizingPosition === "left") {
      dx =
        resizeInitialMouseX -
        (event.touches[0]?.clientX ?? resizeInitialMouseX);
    }

    const newWidth = Math.max(resizeInitialWidth + dx, 150);
    const parentWidth = nodeRef.current?.parentElement?.offsetWidth ?? 0;

    if (newWidth < parentWidth) {
      updateAttributes({
        width: newWidth,
      });
    }
  }

  function handleTouchEnd() {
    setResizing(false);
    setResizeInitialMouseX(0);
    setResizeInitialWidth(0);
  }

  function handleCaptionChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newCaption = e.target.value;
    setCaption(newCaption);
  }

  function handleCaptionBlur() {
    updateAttributes({ caption });
    setEditingCaption(false);
  }

  function handleCaptionKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleCaptionBlur();
    }
  }

  const handleImageUrlSubmit = () => {
    if (imageUrl) {
      updateAttributes({
        src: imageUrl,
        alt: altText,
      });
      setImageUrl("");
      setAltText("");
      setOpenedMore(false);
    }
  };

  useEffect(() => {
    // Sincronizar estado local al cambiar el nodo TipTap (fuente externa respecto al input).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- patrón NodeView: attrs vs estado de edición
    setCaption(node.attrs.caption || "");
  }, [node.attrs.caption]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- patrón NodeView: attrs vs estado de edición
    setAltText(node.attrs.alt || "");
  }, [node.attrs.alt]);

  useEffect(() => {
    if (editingCaption && captionInputRef.current) {
      const focusOnInput = () => {
        if (captionInputRef.current) {
          captionInputRef.current.focus();
          captionInputRef.current.select();
        }
      };

      const timer1 = setTimeout(focusOnInput, 50);
      const timer2 = setTimeout(focusOnInput, 150);
      const timer3 = setTimeout(focusOnInput, 300);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [editingCaption]);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", endResize);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", endResize);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [resizing, resizeInitialMouseX, resizeInitialWidth]);

  return (
    <NodeViewWrapper
      ref={nodeRef}
      className={cn(
        "image-wrapper rounded-md border-2 border-transparent transition-all duration-200",
        selected ? "border-blue-300" : "",
        node.attrs.align === "left" && "align-left",
        node.attrs.align === "center" && "align-center",
        node.attrs.align === "right" && "align-right"
      )}
      style={{ width: node.attrs.width }}
    >
      <div
        className={cn(
          "group relative flex flex-col rounded-md",
          resizing && ""
        )}
      >
        <figure className="relative m-0">
          <img
            ref={imageRef}
            src={node.attrs.src}
            alt={node.attrs.alt}
            title={node.attrs.title}
            className="rounded-lg transition-shadow duration-200 hover:shadow-lg"
            onLoad={(e) => {
              const img = e.currentTarget;
              const aspectRatio = img.naturalWidth / img.naturalHeight;
              updateAttributes({ aspectRatio });
            }}
          />
          {editor?.isEditable && (
            <>
              <div
                className="absolute inset-y-0 z-20 flex w-6.25 cursor-col-resize items-center justify-start p-2"
                style={{ left: 0 }}
                onMouseDown={(event) => {
                  handleResizingPosition({ e: event, position: "left" });
                }}
                onTouchStart={(event) => handleTouchStart(event, "left")}
              >
                <div className="z-20 h-17.5 w-1 rounded-xl border bg-[rgba(0,0,0,0.65)] opacity-0 transition-all group-hover:opacity-100" />
              </div>
              <div
                className="absolute inset-y-0 z-20 flex w-6.25 cursor-col-resize items-center justify-end p-2"
                style={{ right: 0 }}
                onMouseDown={(event) => {
                  handleResizingPosition({ e: event, position: "right" });
                }}
                onTouchStart={(event) => handleTouchStart(event, "right")}
              >
                <div className="z-20 h-17.5 w-1 rounded-xl border bg-[rgba(0,0,0,0.65)] opacity-0 transition-all group-hover:opacity-100" />
              </div>
            </>
          )}
        </figure>

        {editingCaption ? (
          <Input
            ref={captionInputRef}
            value={caption}
            onChange={handleCaptionChange}
            onBlur={handleCaptionBlur}
            onKeyDown={handleCaptionKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="mt-2 text-center text-sm text-muted-foreground focus:ring-0"
            placeholder="Añadir texto alternativo..."
          />
        ) : (
          <div
            className="mt-2 cursor-text text-center text-sm text-muted-foreground"
            onClick={(e) => {
              if (editor?.isEditable) {
                e.stopPropagation();
                setEditingCaption(true);
              }
            }}
          >
            {caption || "Añadir texto alternativo..."}
          </div>
        )}

        {editor?.isEditable && (
          <div
            className={cn(
              "absolute right-4 top-4 flex items-center gap-1 rounded-md border bg-background/80 p-1 opacity-0 backdrop-blur transition-opacity",
              !resizing && "group-hover:opacity-100",
              openedMore && "opacity-100"
            )}
          >
            <Button
              size="icon"
              className={cn(
                "size-7",
                node.attrs.align === "left" && "bg-accent"
              )}
              variant="ghost"
              onClick={() => updateAttributes({ align: "left" })}
              title="Alinear a la izquierda"
            >
              <AlignLeft className="size-4" />
            </Button>
            <Button
              size="icon"
              className={cn(
                "size-7",
                node.attrs.align === "center" && "bg-accent"
              )}
              variant="ghost"
              onClick={() => updateAttributes({ align: "center" })}
              title="Centrar"
            >
              <AlignCenter className="size-4" />
            </Button>
            <Button
              size="icon"
              className={cn(
                "size-7",
                node.attrs.align === "right" && "bg-accent"
              )}
              variant="ghost"
              onClick={() => updateAttributes({ align: "right" })}
              title="Alinear a la derecha"
            >
              <AlignRight className="size-4" />
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <DropdownMenu open={openedMore} onOpenChange={setOpenedMore}>
              <DropdownMenuTrigger asChild>
                <Button size="icon" className="size-7" variant="ghost">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                alignOffset={-90}
                className="mt-1 text-sm"
                onCloseAutoFocus={(e) => {
                  // Always prevent default if we're intending to edit the caption
                  // to stop Radix from focusing the trigger button back
                  if (editingCaption) {
                    e.preventDefault();
                  }
                }}
              >
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpenedMore(false);
                    setEditingCaption(true);
                  }}
                >
                  <Edit className="mr-2 size-4" /> Editar texto
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <ImageIcon className="mr-2 size-4" /> Reemplazar Imagen
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="p-2 w-fit min-w-52">
                    <div className="space-y-4">
                      <div>
                        <p className="mb-2 text-xs font-medium">Subir Imagen</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="replace-image-upload"
                        />
                        <label
                          htmlFor="replace-image-upload"
                          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed p-4 hover:bg-accent"
                        >
                          {uploading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Subiendo...</span>
                            </>
                          ) : (
                            <>
                              <ImageIcon className="h-4 w-4" />
                              <span>Elegir Imagen</span>
                            </>
                          )}
                        </label>
                        {error && (
                          <p className="mt-2 text-xs text-destructive">
                            {error}
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="mb-2 text-xs font-medium">O usar URL</p>
                        <div className="space-y-2">
                          <Input
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="Introduce la URL de la imagen..."
                            className="text-xs"
                          />
                          <Button
                            onClick={handleImageUrlSubmit}
                            className="w-full"
                            disabled={!imageUrl}
                            size="sm"
                          >
                            Reemplazar con URL
                          </Button>
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-xs font-medium">Texto Alt</p>
                        <Input
                          value={altText}
                          onChange={(e) => setAltText(e.target.value)}
                          placeholder="Texto alternativo (opcional)"
                          className="text-xs"
                        />
                      </div>
                    </div>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem
                  onClick={() => {
                    const aspectRatio = node.attrs.aspectRatio;
                    if (aspectRatio) {
                      const parentWidth =
                        nodeRef.current?.parentElement?.offsetWidth ?? 0;
                      updateAttributes({
                        width: parentWidth,
                        height: parentWidth / aspectRatio,
                      });
                    }
                  }}
                >
                  <Maximize className="mr-2 size-4" /> Ancho Completo
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={deleteNode}
                >
                  <Trash className="mr-2 size-4" /> Eliminar Imagen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
