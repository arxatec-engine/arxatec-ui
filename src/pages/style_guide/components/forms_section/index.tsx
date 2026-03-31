import { Bold, Plus } from "lucide-react";

import { AsyncSelect } from "@/components/async_select";
import { Button } from "@/components/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/button_group";
import { Checkbox } from "@/components/checkbox";
import { CustomHeader } from "@/components/custom_header";
import { DateRangePicker } from "@/components/date_range_picker";
import { InfoTooltip } from "@/components/info_tooltip";
import { Input } from "@/components/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/input_otp";
import { Kbd, KbdGroup } from "@/components/kbd";
import { Label } from "@/components/label";
import { Progress } from "@/components/progress";
import { RadioGroup, RadioGroupItem } from "@/components/radio_group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { Slider } from "@/components/slider";
import { Textarea } from "@/components/text_area";
import { Toggle } from "@/components/toggle";

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
      description="Controles de captura, seleccion y validacion visual."
    >
      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <div className="min-w-0 space-y-4 rounded-xl border p-4">
          <CustomHeader
            title="Formulario tecnico"
            description="Ejemplo de composicion con etiquetas, ayudas y acciones."
            button={{ label: "Nuevo", url: "#", icon: Plus }}
          />
          <div className="grid min-w-0 gap-3">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" placeholder="Escribe un nombre" />

            <Label htmlFor="bio">Descripcion</Label>
            <Textarea id="bio" rows={3} placeholder="Detalle de contexto..." />

            <DateRangePicker
              label="Periodo"
              optional
              startDate={startDate}
              dueDate={dueDate}
              onStartDateChange={onStartDateChange}
              onDueDateChange={onDueDateChange}
            />

            <AsyncSelect
              label="Proyecto"
              value={asyncValue}
              onChange={onAsyncValueChange}
              placeholder="Selecciona un proyecto"
              options={asyncOptions}
            />

            <div className="flex items-center gap-2">
              <Checkbox id="terms" defaultChecked />
              <Label htmlFor="terms">Aceptar terminos</Label>
            </div>

            <RadioGroup defaultValue="a">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="a" id="r-a" />
                <Label htmlFor="r-a">Prioridad alta</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="b" id="r-b" />
                <Label htmlFor="r-b">Prioridad baja</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="min-w-0 space-y-4 rounded-xl border p-4">
          <div className="grid min-w-0 gap-3">
            <Label>Entrada con componentes avanzados</Label>
            <ButtonGroup className="min-w-0 max-w-full flex-wrap">
              <ButtonGroupText>Accion</ButtonGroupText>
              <ButtonGroupSeparator />
              <Button variant="outline" size="sm">
                Guardar
              </Button>
              <Button variant="outline" size="sm">
                Publicar
              </Button>
            </ButtonGroup>

            <div className="w-full min-w-0 overflow-x-auto py-1">
              <InputOTP maxLength={6} containerClassName="w-fit min-w-min">
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

            <div className="space-y-2">
              <Label>Select nativo</Label>
              <Select defaultValue="mx">
                <SelectTrigger>
                  <SelectValue placeholder="Pais" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mx">Mexico</SelectItem>
                  <SelectItem value="co">Colombia</SelectItem>
                  <SelectItem value="es">Espana</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Slider y progreso</Label>
              <Slider defaultValue={[62]} />
              <Progress value={62} />
            </div>

            <div className="flex items-center gap-2">
              <Toggle aria-label="Negrita">
                <Bold className="size-4" />
              </Toggle>
              <InfoTooltip info="Este campo es visible solo para administradores." />
              <KbdGroup>
                <Kbd>cmd</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
            </div>
          </div>
        </div>
      </div>
    </ShowcaseBlock>
  );
}
