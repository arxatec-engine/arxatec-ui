import type { Meta, StoryObj } from "@storybook/react-vite";
import { Download, File, Folder, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { FileThumbnail } from "../file_thumbnail";
import { FileTypeIcon } from "../file_type_icon";
import { FolderIcon } from "../folder_icon";
import { TableCell } from "../table";
import {
  ExplorerBreadcrumb,
  ExplorerGridCard,
  ExplorerNameCell,
  ExplorerRow,
  ExplorerTable,
  EXPLORER_GRID_CLASS,
  type ExplorerAction,
} from "./index";

const meta = {
  title: "Files/FileExplorer",
  component: ExplorerGridCard,
  args: {
    id: "report",
    type: "file",
    name: "Report.pdf",
    icon: <FileTypeIcon mimeType="application/pdf" />,
    preview: <FileTypeIcon mimeType="application/pdf" className="size-14" />,
    selected: false,
    actions: [],
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof ExplorerGridCard>;
export default meta;
type Story = StoryObj<typeof meta>;

const FILES = [
  { mimeType: "application/pdf", fileName: "Report.pdf" },
  {
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    fileName: "Letter.docx",
  },
  {
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    fileName: "Budget.xlsx",
  },
  {
    mimeType:
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    fileName: "Slides.pptx",
  },
  { mimeType: "image/png", fileName: "Photo.png" },
  { mimeType: "video/mp4", fileName: "Video.mp4" },
  { mimeType: "audio/mpeg", fileName: "Audio.mp3" },
  { mimeType: "application/zip", fileName: "Archive.zip" },
  { mimeType: "text/javascript", fileName: "Script.js" },
  { mimeType: "application/json", fileName: "Data.json" },
  { mimeType: "application/xml", fileName: "Data.xml" },
  { mimeType: "font/woff2", fileName: "Font.woff2" },
  { mimeType: "application/sql", fileName: "Database.sql" },
  { mimeType: "application/octet-stream", fileName: "Binary.bin" },
  { mimeType: "application/x-unmapped", fileName: "Unknown" },
  {
    mimeType: "application/vnd.google-apps.document",
    fileName: "Google document",
  },
];

export const FileTypes: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6 p-4 sm:grid-cols-4 lg:grid-cols-8">
      {FILES.map((file) => (
        <div key={file.fileName} className="flex flex-col items-center gap-2">
          <FileTypeIcon {...file} className="size-14" />
          <span className="text-center text-sm">{file.fileName}</span>
          <div className="flex items-center gap-2">
            <FileTypeIcon {...file} />
            <FileTypeIcon {...file} className="size-6" />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Folders: Story = {
  render: () => (
    <div className="flex flex-wrap gap-8 p-4">
      {(["default", "shared", "drive"] as const).map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-2">
          <FolderIcon variant={variant} className="size-14" />
          <span>{variant}</span>
          <FolderIcon variant={variant} />
        </div>
      ))}
    </div>
  ),
};

function GridExample() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState("Select an item or open its actions.");
  const [path, setPath] = useState<string | null>("reports");
  const actions = (name: string): ExplorerAction[] => [
    {
      key: "download",
      label: "Download",
      icon: Download,
      onSelect: () => setStatus(`Download: ${name}`),
    },
    {
      key: "rename",
      label: "Rename",
      icon: Pencil,
      onSelect: () => setStatus(`Rename: ${name}`),
    },
    {
      key: "delete",
      label: "Delete",
      icon: Trash2,
      separatorBefore: true,
      onSelect: () => setStatus(`Delete: ${name}`),
    },
  ];

  return (
    <div className="space-y-4 p-4">
      <ExplorerBreadcrumb
        items={[
          { id: null, name: "Files" },
          ...(path ? [{ id: "reports", name: "Reports" }] : []),
        ]}
        onNavigate={(id) => setPath(id)}
      />
      <div className={EXPLORER_GRID_CLASS}>
        <ExplorerGridCard
          id="reports"
          type="folder"
          name="Reports"
          icon={<FolderIcon />}
          preview={<FolderIcon className="size-14" />}
          selected={selectedId === "reports"}
          actions={actions("Reports")}
          onClick={() => setSelectedId("reports")}
          onDoubleClick={() => setPath("reports")}
        />
        {FILES.slice(0, 6).map((file) => (
          <ExplorerGridCard
            key={file.fileName}
            id={file.fileName}
            type="file"
            name={file.fileName}
            path="Reports / October"
            icon={<FileTypeIcon {...file} />}
            preview={
              <FileThumbnail
                fallback={<FileTypeIcon {...file} className="size-14" />}
              />
            }
            meta="2.4 MB · Oct 12, 2026"
            selected={selectedId === file.fileName}
            actions={actions(file.fileName)}
            onClick={() => setSelectedId(file.fileName)}
            onDoubleClick={() => setStatus(`Open: ${file.fileName}`)}
          />
        ))}
      </div>
      <p aria-live="polite" className="text-sm">
        {status}
      </p>
    </div>
  );
}

export const Grid: Story = { render: () => <GridExample /> };

export const Table: Story = {
  render: () => (
    <ExplorerTable
      flow
      columns={[
        { key: "name", label: "Name", icon: Folder },
        { key: "size", label: "Size", icon: File },
        { key: "actions", icon: Pencil, center: true },
      ]}
    >
      {FILES.slice(0, 5).map((file, index) => (
        <ExplorerRow
          key={file.fileName}
          id={file.fileName}
          type="file"
          selected={index === 1}
          actions={[]}
        >
          <ExplorerNameCell
            name={file.fileName}
            icon={<FileTypeIcon {...file} />}
            selected={index === 1}
            path="Reports / October"
          />
          <TableCell>2.4 MB</TableCell>
        </ExplorerRow>
      ))}
    </ExplorerTable>
  ),
};

const PREVIEW_SOURCE = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200"><rect width="320" height="200" fill="#e0f2fe"/><rect x="70" y="24" width="180" height="170" rx="8" fill="white"/><path d="M96 54h126M96 78h100M96 102h126M96 126h80" stroke="#64748b" stroke-width="8"/></svg>')}`;

export const Thumbnails: Story = {
  render: () => (
    <div className="grid gap-4 p-4 sm:grid-cols-4">
      {[
        { label: "Preview", source: PREVIEW_SOURCE },
        { label: "Loading", isLoading: true },
        { label: "Unavailable", isError: true },
        { label: "Broken image", source: "data:image/png;base64,broken" },
      ].map(({ label, ...props }) => (
        <div key={label} className="overflow-hidden rounded-md border">
          <p className="border-b p-2 text-sm">{label}</p>
          <div className="h-28">
            <FileThumbnail
              {...props}
              fallback={
                <FileTypeIcon mimeType="application/pdf" className="size-14" />
              }
            />
          </div>
        </div>
      ))}
    </div>
  ),
};
