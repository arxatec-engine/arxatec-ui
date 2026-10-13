import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FileTypeIcon } from "./index";
import { getFileTypeLabel } from "./file_kind";

const renderIcon = (props: {
  mimeType: string;
  className?: string;
  fileName?: string;
}) => {
  const { container } = render(<FileTypeIcon {...props} />);
  const svg = container.querySelector("svg");

  return {
    className: svg?.getAttribute("class") ?? "",
    label: svg?.getAttribute("data-file-label") ?? "",
    text: svg?.querySelector("text")?.textContent ?? "",
  };
};

describe("FileTypeIcon", () => {
  it("should label the icon with the extension inferred from the mime type", () => {
    expect(renderIcon({ mimeType: "application/pdf" }).label).toBe("PDF");
    expect(
      renderIcon({
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      }).label,
    ).toBe("DOCX");
    expect(
      renderIcon({
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }).label,
    ).toBe("XLSX");
  });

  it("should paint the label inside the svg so it is visible at larger sizes", () => {
    expect(renderIcon({ mimeType: "application/pdf" }).text).toBe("PDF");
  });

  it("should prefer the file name extension over the mime type", () => {
    const { label } = renderIcon({
      mimeType: "application/octet-stream",
      fileName: "Demanda_laboral_v3.docx",
    });

    expect(label).toBe("DOCX");
  });

  it("should fall back to the mime type when the file name has no usable extension", () => {
    expect(
      renderIcon({
        mimeType: "application/pdf",
        fileName: "acta_sin_extension",
      }).label,
    ).toBe("PDF");
    expect(
      renderIcon({ mimeType: "application/pdf", fileName: "acta." }).label,
    ).toBe("PDF");
  });

  it("should fall back to a family label when neither the name nor the mime is known", () => {
    expect(renderIcon({ mimeType: "application/x-sh" }).label).toBe("CODE");
    expect(renderIcon({ mimeType: "application/sql" }).label).toBe("DB");
    expect(renderIcon({ mimeType: "application/x-executable" }).label).toBe(
      "BIN",
    );
    expect(renderIcon({ mimeType: "application/unknown-mime" }).label).toBe(
      "FILE",
    );
  });

  it("should recognise the native Google Workspace formats, which carry no extension", () => {
    expect(
      renderIcon({ mimeType: "application/vnd.google-apps.document" }).label,
    ).toBe("DOC");
    expect(
      renderIcon({ mimeType: "application/vnd.google-apps.spreadsheet" }).label,
    ).toBe("XLS");
    expect(
      renderIcon({ mimeType: "application/vnd.google-apps.presentation" })
        .label,
    ).toBe("PPT");
  });

  it("should colour a Google Doc like any other document", () => {
    const docx = renderIcon({
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }).className;

    expect(
      renderIcon({ mimeType: "application/vnd.google-apps.document" })
        .className,
    ).toBe(docx);
  });

  it("should cap the label at four characters so it fits the band", () => {
    const { label } = renderIcon({
      mimeType: "application/octet-stream",
      fileName: "notas.markdown",
    });

    expect(label).toHaveLength(4);
    expect(label).toBe("MARK");
  });

  it("should give each family its own colour in both themes", () => {
    expect(renderIcon({ mimeType: "application/pdf" }).className).toContain(
      "text-red-600",
    );
    expect(renderIcon({ mimeType: "application/pdf" }).className).toContain(
      "dark:text-red-500",
    );
    expect(renderIcon({ mimeType: "text/csv" }).className).toContain(
      "text-emerald-700",
    );
    expect(renderIcon({ mimeType: "image/png" }).className).toContain(
      "text-violet-600",
    );
    expect(renderIcon({ mimeType: "video/mp4" }).className).toContain(
      "text-pink-600",
    );
  });

  it("should group related mime types under the same colour", () => {
    const docx = renderIcon({
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    }).className;

    expect(renderIcon({ mimeType: "text/plain" }).className).toBe(docx);
    expect(renderIcon({ mimeType: "application/rtf" }).className).toBe(docx);
  });

  it("should apply the default className when none is provided", () => {
    expect(renderIcon({ mimeType: "application/pdf" }).className).toContain(
      "size-4",
    );
  });

  it("should let a custom className win over the family colour", () => {
    const { className } = renderIcon({
      mimeType: "application/pdf",
      className: "size-10 text-slate-400",
    });

    expect(className).toContain("size-10");
    expect(className).toContain("text-slate-400");
    expect(className).not.toContain("text-red-600");
  });
});

describe("getFileTypeLabel", () => {
  it("should normalise the extension to uppercase", () => {
    expect(getFileTypeLabel("application/octet-stream", "ACTA.PdF")).toBe(
      "PDF",
    );
  });

  it("should ignore extensions that are not alphanumeric", () => {
    expect(getFileTypeLabel("application/pdf", "informe.v2 final")).toBe("PDF");
  });

  it("should resolve the primary extension when a mime has several", () => {
    expect(getFileTypeLabel("image/jpeg")).toBe("JPG");
  });
});
