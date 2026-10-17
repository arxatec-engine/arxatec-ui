import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FileOfficeViewer } from "./index";

const DOCUMENT_URL =
  "https://files.example.com/Informe final.docx?token=a+b&expires=123#page=2";

describe("FileOfficeViewer", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it.each(["doc", "docx", "xls", "xlsx", "ppt", "pptx", "odt"])(
    "keeps the Office Online embed for %s files and preserves signed URL parameters",
    (extension) => {
      render(
        <FileOfficeViewer url={DOCUMENT_URL} fileName={`Informe.${extension}`} />,
      );

      const iframe = screen.getByTitle(`Informe.${extension}`);
      const embed = new URL(iframe.getAttribute("src")!);
      expect(embed.origin + embed.pathname).toBe(
        "https://view.officeapps.live.com/op/embed.aspx",
      );
      expect(embed.searchParams.get("src")).toBe(DOCUMENT_URL);
    },
  );

  it("supports MIME-only callers with a default frame title", () => {
    render(
      <FileOfficeViewer
        url={DOCUMENT_URL}
        mimeType="application/vnd.ms-excel"
      />,
    );
    expect(screen.getByTitle("Documento Office")).toBeInTheDocument();
  });

  it("reports loading until Office has had two seconds to settle after load", () => {
    const onLoadingChange = vi.fn();
    render(
      <FileOfficeViewer url={DOCUMENT_URL} onLoadingChange={onLoadingChange} />,
    );
    expect(onLoadingChange).toHaveBeenLastCalledWith(true);

    fireEvent.load(screen.getByTitle("Documento Office"));
    act(() => vi.advanceTimersByTime(1999));
    expect(onLoadingChange).toHaveBeenLastCalledWith(true);
    act(() => vi.advanceTimersByTime(1));
    expect(onLoadingChange).toHaveBeenLastCalledWith(false);
  });

  it("ends loading after twelve seconds if the iframe never emits load", () => {
    const onLoadingChange = vi.fn();
    render(
      <FileOfficeViewer url={DOCUMENT_URL} onLoadingChange={onLoadingChange} />,
    );
    act(() => vi.advanceTimersByTime(11_999));
    expect(onLoadingChange).toHaveBeenLastCalledWith(true);
    act(() => vi.advanceTimersByTime(1));
    expect(onLoadingChange).toHaveBeenLastCalledWith(false);
  });

  it("starts a fresh loading cycle when the document URL changes", () => {
    const onLoadingChange = vi.fn();
    const { rerender } = render(
      <FileOfficeViewer url={DOCUMENT_URL} onLoadingChange={onLoadingChange} />,
    );
    const oldFrame = screen.getByTitle("Documento Office");
    fireEvent.load(oldFrame);
    act(() => vi.advanceTimersByTime(2000));
    expect(onLoadingChange).toHaveBeenLastCalledWith(false);

    const nextUrl = "https://files.example.com/presentation.pptx";
    rerender(
      <FileOfficeViewer url={nextUrl} onLoadingChange={onLoadingChange} />,
    );
    const nextFrame = screen.getByTitle("Documento Office");
    expect(nextFrame).not.toBe(oldFrame);
    expect(new URL(nextFrame.getAttribute("src")!).searchParams.get("src")).toBe(
      nextUrl,
    );
    expect(onLoadingChange).toHaveBeenLastCalledWith(true);
    fireEvent.load(nextFrame);
    act(() => vi.advanceTimersByTime(2000));
    expect(onLoadingChange).toHaveBeenLastCalledWith(false);
  });

  it("preserves pending and error states without mounting the embed", () => {
    const onLoadingChange = vi.fn();
    const { container, rerender } = render(
      <FileOfficeViewer
        url={DOCUMENT_URL}
        isPending
        onLoadingChange={onLoadingChange}
      />,
    );
    expect(container).toBeEmptyDOMElement();
    expect(onLoadingChange).toHaveBeenLastCalledWith(true);

    rerender(
      <FileOfficeViewer
        url={DOCUMENT_URL}
        isError
        onLoadingChange={onLoadingChange}
      />,
    );
    expect(container.querySelector("iframe")).toBeNull();
    expect(container).not.toBeEmptyDOMElement();
    expect(onLoadingChange).toHaveBeenLastCalledWith(false);

    rerender(<FileOfficeViewer url="" onLoadingChange={onLoadingChange} />);
    expect(container.querySelector("iframe")).toBeNull();
    expect(onLoadingChange).toHaveBeenLastCalledWith(false);
  });

  it("reports pending while the document URL is still being fetched", () => {
    const onLoadingChange = vi.fn();
    const { rerender } = render(
      <FileOfficeViewer url="" isPending onLoadingChange={onLoadingChange} />,
    );
    expect(onLoadingChange).toHaveBeenLastCalledWith(true);

    rerender(<FileOfficeViewer url="" onLoadingChange={onLoadingChange} />);
    expect(onLoadingChange).toHaveBeenLastCalledWith(false);
  });

  it("keeps the optional download action", () => {
    const onDownload = vi.fn();
    const { rerender } = render(<FileOfficeViewer url={DOCUMENT_URL} />);
    expect(screen.queryByRole("button")).toBeNull();

    rerender(<FileOfficeViewer url={DOCUMENT_URL} onDownload={onDownload} />);
    fireEvent.click(screen.getByRole("button", { name: "Descargar archivo" }));
    expect(onDownload).toHaveBeenCalledOnce();
  });

  it("clears loading and pending timers when unmounted", () => {
    const onLoadingChange = vi.fn();
    const { unmount } = render(
      <FileOfficeViewer url={DOCUMENT_URL} onLoadingChange={onLoadingChange} />,
    );
    fireEvent.load(screen.getByTitle("Documento Office"));
    unmount();
    expect(onLoadingChange).toHaveBeenLastCalledWith(false);
    expect(vi.getTimerCount()).toBe(0);
  });
});
