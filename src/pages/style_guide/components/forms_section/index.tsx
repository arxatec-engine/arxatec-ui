import { Bold } from "lucide-react";
import {
  AsyncSelect,
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  Checkbox,
  DateRangePicker,
  InfoTooltip,
  Input,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  Kbd,
  KbdGroup,
  Label,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
  Textarea,
  Toggle,
  Separator,
} from "@/exports";
import type { StyleGuideDemoItem } from "../types";
import { ShowcaseBlock } from "../showcase_block";

interface Props {
  startDate: Date | undefined;
  dueDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onDueDateChange: (date: Date | undefined) => void;
  asyncValue: string | undefined;
  onAsyncValueChange: (value: string | undefined) => void;
  asyncOptions: StyleGuideDemoItem[];
}

export function FormsSection({
  startDate,
  dueDate,
  onStartDateChange,
  onDueDateChange,
  asyncValue,
  onAsyncValueChange,
  asyncOptions,
}: Props) {
  return (
    <ShowcaseBlock
      title="Inputs y Formularios"
      description="Controles de captura, selección y validación visual."
    >
      <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-md border border-border/60 bg-card/20 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            Información Básica
          </p>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input id="name" placeholder="Ej. Juan Pérez" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Descripción Corta</Label>
              <Textarea
                id="bio"
                rows={2}
                placeholder="Detalles del perfil..."
              />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Checkbox id="terms" defaultChecked />
              <Label htmlFor="terms" className="cursor-pointer text-sm">
                Aceptar términos
              </Label>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-md border border-border/60 bg-card/20 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            Planificación y Asignación
          </p>
          <div className="space-y-4">
            <DateRangePicker
              label="Rango de Fechas"
              optional
              startDate={startDate}
              dueDate={dueDate}
              onStartDateChange={onStartDateChange}
              onDueDateChange={onDueDateChange}
            />
            <AsyncSelect
              label="Vincular Proyecto"
              value={asyncValue}
              onChange={onAsyncValueChange}
              placeholder="Buscar proyecto..."
              options={asyncOptions}
            />
            <div className="space-y-2 pt-1 border-t">
              <Label className="text-xs">Prioridad de Entrega</Label>
              <RadioGroup defaultValue="a" className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="a" id="r-a" />
                  <Label htmlFor="r-a" className="cursor-pointer">
                    Alta
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="b" id="r-b" />
                  <Label htmlFor="r-b" className="cursor-pointer">
                    Baja
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-md border border-border/60 bg-card/20 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            Acciones y Validación
          </p>
          <div className="space-y-5">
            <div className="space-y-3">
              <Label className="text-xs">Código de Seguridad</Label>
              <InputOTP maxLength={6} containerClassName="w-fit">
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div className="space-y-2 border-t pt-4">
              <Label className="text-xs">Acción de Grupo</Label>
              <ButtonGroup className="w-full">
                <ButtonGroupText>Opciones</ButtonGroupText>
                <ButtonGroupSeparator />
                <Button variant="outline" size="sm" className="flex-1">
                  Guardar
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Publicar
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-md border border-border/60 bg-card/20 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            Ajustes y Parámetros
          </p>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">País</Label>
                <Select defaultValue="mx">
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="País" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mx">México</SelectItem>
                    <SelectItem value="co">Colombia</SelectItem>
                    <SelectItem value="es">España</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 self-end pb-1 justify-center border rounded-md h-9 bg-background/50">
                <Toggle aria-label="Negrita" size="sm">
                  <Bold className="size-4" />
                </Toggle>
                <Separator orientation="vertical" className="h-4" />
                <InfoTooltip info="Configuración avanzada" />
                <Separator orientation="vertical" className="h-4" />
                <KbdGroup>
                  <Kbd className="text-[10px]">K</Kbd>
                </KbdGroup>
              </div>
            </div>
            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between items-center">
                <Label className="text-xs">Nivel de Proceso</Label>
                <span className="text-[10px] font-mono text-muted-foreground">
                  62%
                </span>
              </div>
              <Slider defaultValue={[62]} />
              <Progress value={62} className="h-1" />
            </div>
          </div>
        </div>
      </div>
    </ShowcaseBlock>
  );
}
