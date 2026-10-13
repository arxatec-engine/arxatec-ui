import type { Meta, StoryObj } from "@storybook/react-vite";
import { enUS } from "date-fns/locale";
import { CalendarDays, FileText, Timer, User } from "lucide-react";
import { useState } from "react";
import { EditableFieldsProvider } from "./index";
import { PropertyRow } from "../property_row";
import { InlineEditableText } from "../inline_editable_text";
import { InlineOptionField } from "../inline_option_field";
import { InlineDateField } from "../inline_date_field";
import { InlineDurationField } from "../inline_duration_field";
import { InlineMarkdownField } from "../inline_markdown_field";
import { AutosaveStatus } from "../autosave_status";
import { HexColorPickerPopover } from "../hex_color_picker";
import { GoogleCalendarIsotype } from "../icons/components/google_calendar_isotype";
import { GoogleDriveIsotype } from "../icons/components/google_drive_isotype";
import { OneDriveIsotype } from "../icons/components/onedrive_isotype";
import { OutlookCalendarIsotype } from "../icons/components/outlook_calendar_isotype";
import { TableDateField } from "../table_date_field";
import { TableOptionField } from "../table_option_field";
import { SelectTableHeader } from "../select_table_header";
import { Table, TableBody, TableRow, TableCell } from "../table";

function Example({ language = "es" }: { language?: "es" | "en" }) {
  const english = language === "en";
  const copy = english
    ? {
        name: "Name",
        document: "Shared document",
        status: "Status",
        pending: "Pending",
        done: "Done",
        chooseStatus: "Choose status",
        clearStatus: "Clear status",
        date: "Date",
        addDate: "Add date",
        clearDate: "Clear date",
        duration: "Duration",
        addDuration: "Add duration",
        description: "Description",
        documentDescription: "Document description",
      }
    : {
        name: "Nombre",
        document: "Documento compartido",
        status: "Estado",
        pending: "Pendiente",
        done: "Terminado",
        chooseStatus: "Elegir estado",
        clearStatus: "Quitar estado",
        date: "Fecha",
        addDate: "Añadir fecha",
        clearDate: "Quitar fecha",
        duration: "Duración",
        addDuration: "Añadir duración",
        description: "Descripción",
        documentDescription: "Descripción del documento",
      };
  const [text, setText] = useState(copy.document);
  const [option, setOption] = useState<string | null>("pending");
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 9, 12));
  const [duration, setDuration] = useState(5400);
  const [markdown, setMarkdown] = useState(copy.documentDescription);
  const [color, setColor] = useState("#2563EB");
  return (
    <div className="mx-auto grid w-full max-w-lg gap-4 p-6">
      <PropertyRow icon={User} label={copy.name}>
        <InlineEditableText
          ariaLabel={copy.name}
          value={text}
          onCommit={setText}
        />
      </PropertyRow>
      <PropertyRow icon={FileText} label={copy.status}>
        <InlineOptionField
          ariaLabel={copy.status}
          value={option}
          options={[
            { value: "pending", label: copy.pending },
            { value: "done", label: copy.done },
          ]}
          emptyText={copy.chooseStatus}
          clearLabel={copy.clearStatus}
          onChange={setOption}
        />
      </PropertyRow>
      <PropertyRow icon={CalendarDays} label={copy.date}>
        <InlineDateField
          ariaLabel={copy.date}
          value={date}
          emptyText={copy.addDate}
          onChange={setDate}
          onClear={() => setDate(undefined)}
          clearLabel={copy.clearDate}
        />
      </PropertyRow>
      <PropertyRow icon={Timer} label={copy.duration}>
        <InlineDurationField
          ariaLabel={copy.duration}
          value={duration}
          emptyText={copy.addDuration}
          onChange={setDuration}
        />
      </PropertyRow>
      <PropertyRow icon={FileText} label={copy.description} stacked>
        <InlineMarkdownField
          collapsible
          value={markdown}
          onCommit={setMarkdown}
        />
      </PropertyRow>
      <HexColorPickerPopover value={color} onChange={setColor} />
      <AutosaveStatus
        status="saved"
        errorMessage={null}
        isRetryable={false}
        onRetry={() => {}}
      />
      <div className="flex gap-4">
        <GoogleCalendarIsotype className="size-8" />
        <GoogleDriveIsotype className="size-8" />
        <OneDriveIsotype className="size-8" />
        <OutlookCalendarIsotype className="size-8" />
      </div>
    </div>
  );
}

const meta = {
  title: "Patterns/EditableFields",
  component: EditableFieldsProvider,
  args: { children: <Example /> },
  parameters: { layout: "fullscreen" },
  render: () => <Example />,
} satisfies Meta<typeof EditableFieldsProvider>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Spanish: Story = {};
export const English: Story = {
  render: () => (
    <EditableFieldsProvider
      locale={enUS}
      dateFormat="MMMM d, yyyy"
      labels={{
        empty: "Add…",
        hint: "Enter to save · Esc to cancel",
        hours: "Hours",
        minutes: "Minutes",
        saving: "Saving…",
        saved: "Saved",
        savedAgo: "Saved a moment ago",
        offline: "Offline · changes will save when connected",
        genericError: "Could not save. Check your connection.",
        retry: "Retry",
        acceptColor: "Accept",
        clearColor: "Clear color",
        selectColor: "Select color",
        changeColor: "Change color",
        currentColor: "current",
      }}
    >
      <Example language="en" />
    </EditableFieldsProvider>
  ),
};

function TableExample() {
  const [status, setStatus] = useState<string | null>("pending");
  const [date, setDate] = useState<string | null>(
    new Date(2026, 0, 10).toISOString(),
  );
  const [rowClicks, setRowClicks] = useState(0);
  return (
    <EditableFieldsProvider locale={enUS}>
      <div className="mx-auto max-w-xl p-6">
        <Table>
          <SelectTableHeader
            columns={[
              { key: "status", label: "Status", icon: FileText },
              { key: "date", label: "Date", icon: CalendarDays },
            ]}
          />
          <TableBody>
            <TableRow onClick={() => setRowClicks((count) => count + 1)}>
              <TableCell />
              <TableCell>
                <TableOptionField
                  value={status}
                  options={[
                    { value: "pending", label: "Pending" },
                    { value: "paid", label: "Paid" },
                  ]}
                  onChange={setStatus}
                  ariaLabel="Status"
                  clearLabel="Clear status"
                  renderOption={(option) => option.label}
                >
                  {status === "paid" ? "Paid" : "Pending"}
                </TableOptionField>
              </TableCell>
              <TableCell>
                <TableDateField
                  value={date}
                  onChange={setDate}
                  ariaLabel="Date"
                  clearLabel="Clear date"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <p data-testid="row-open-count">Row opens: {rowClicks}</p>
      </div>
    </EditableFieldsProvider>
  );
}

export const TableCells: Story = { render: () => <TableExample /> };
