import { FileCode } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Skeleton } from "@/components/skeleton";
import { StatusMessage } from "@/components/status_message";
import { getSourceLanguageFromFile } from "../../utilities/get_source_language_from_file";

export interface FileSourceViewerProps {
  content?: string | null;
  mimeType: string;
  fileName: string;
  isPending?: boolean;
  isError?: boolean;
}

export const FileSourceViewer: React.FC<FileSourceViewerProps> = ({
  content,
  mimeType,
  fileName,
  isPending = false,
  isError = false,
}) => {
  const language = getSourceLanguageFromFile(mimeType, fileName);

  if (isPending) {
    return (
      <div className="p-6 w-full h-full overflow-auto">
        <Skeleton className="w-full h-96 rounded-md" />
      </div>
    );
  }

  if (isError || content == null) {
    return (
      <div className="p-6 h-full">
        <StatusMessage
          title="No se pudo cargar el código"
          description="Comprueba que el archivo sea accesible. Si usas URLs externas (p. ej. S3), puede ser necesario un endpoint en el backend que devuelva el contenido como texto."
          icon={FileCode}
          classNameCard="w-full h-full flex-col items-center justify-center"
          classNameIconCard="mx-auto"
          classNameDescription="text-center w-full max-w-sm"
          classNameTitle="text-center w-full"
          color="white"
        />
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-[#282c34] rounded-md">
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        showLineNumbers
        wrapLongLines
        customStyle={{
          margin: 0,
          padding: "1rem",
          fontSize: "0.875rem",
          lineHeight: 1.6,
          minHeight: "100%",
        }}
        codeTagProps={{
          style: { fontFamily: "ui-monospace, monospace" },
        }}
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
};
