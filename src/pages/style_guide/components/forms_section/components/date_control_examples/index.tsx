import { useState } from "react";

import { Calendar } from "@/components/calendar";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/input_otp";
import { Label } from "@/components/label";
import { Progress } from "@/components/progress";
import { Slider } from "@/components/slider";

import { ComponentPreview } from "../../../component_preview";

export const DateControlExamples = () => {
  const [day, setDay] = useState<Date>();
  const [progress, setProgress] = useState([62]);

  return (
    <>
      <ComponentPreview
        title="Calendar"
        description="Ayuda a elegir una fecha viendo su relación con el mes. Útil cuando el contexto temporal importa tanto como el día."
      >
        <div className="flex justify-center overflow-x-auto">
          <Calendar
            mode="single"
            selected={day}
            onSelect={setDay}
            className="rounded-md border bg-background"
          />
        </div>
      </ComponentPreview>
      <ComponentPreview
        title="InputOTP"
        description="Divide un código corto en posiciones legibles y conserva una sola entrada. Facilita revisar y pegar códigos de verificación."
      >
        <div className="flex flex-col items-center gap-4">
          <Label htmlFor="guide-otp">Código de verificación</Label>
          <InputOTP
            id="guide-otp"
            maxLength={6}
            containerClassName="flex-wrap justify-center gap-2"
          >
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
      </ComponentPreview>
      <ComponentPreview
        title="Slider · Progress"
        description="Slider ajusta un valor dentro de un rango. Progress comunica cuánto se ha completado; aquí refleja el valor que elijas."
      >
        <div className="w-full max-w-sm space-y-5">
          <div className="flex items-center justify-between text-sm">
            <Label id="guide-level">Nivel de avance</Label>
            <output className="tabular-nums">{progress[0]} %</output>
          </div>
          <Slider
            value={progress}
            onValueChange={setProgress}
            max={100}
            step={1}
            aria-labelledby="guide-level"
          />
          <Progress
            value={progress[0]}
            aria-label="Avance del proyecto"
            className="h-2"
          />
        </div>
      </ComponentPreview>
    </>
  );
};
