import { act, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AutosaveStatus } from "@/components/autosave_status";

vi.mock("@/components/button", () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: ReactNode;
    onClick?: () => void;
  }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

function renderStatus(
  props: Partial<React.ComponentProps<typeof AutosaveStatus>> = {},
) {
  return render(
    <AutosaveStatus
      status="idle"
      errorMessage={null}
      isRetryable={false}
      onRetry={vi.fn()}
      {...props}
    />,
  );
}

describe("AutosaveStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("should say nothing while idle so nothing is announced before the user touches anything", () => {
    renderStatus({ status: "idle" });

    expect(screen.getByRole("status")).toHaveTextContent("");
  });

  it("should announce politely through a live region", () => {
    renderStatus({ status: "saving" });

    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  });

  it("should show the saving copy", () => {
    renderStatus({ status: "saving" });

    expect(screen.getByRole("status")).toHaveTextContent("Guardando…");
  });

  it("should soften the saved copy after a few seconds", () => {
    vi.useFakeTimers();
    renderStatus({ status: "saved" });
    expect(screen.getByRole("status")).toHaveTextContent("Guardado");

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(screen.getByRole("status")).toHaveTextContent(
      "Guardado hace un momento",
    );
  });

  it("should show the offline copy", () => {
    renderStatus({ status: "offline" });

    expect(screen.getByRole("status")).toHaveTextContent(
      "Sin conexión · se guardará al reconectar",
    );
  });

  it("starts the saved message anew after a later save", () => {
    vi.useFakeTimers();
    const props = { errorMessage: null, isRetryable: false, onRetry: vi.fn() };
    const { rerender } = render(<AutosaveStatus {...props} status="saved" />);
    act(() => vi.advanceTimersByTime(4000));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Guardado hace un momento",
    );
    rerender(<AutosaveStatus {...props} status="saving" />);
    rerender(<AutosaveStatus {...props} status="saved" />);
    expect(screen.getByRole("status")).toHaveTextContent("Guardado");
    expect(screen.getByRole("status")).not.toHaveTextContent(
      "Guardado hace un momento",
    );
  });

  it("should show the server message on error", () => {
    renderStatus({ status: "error", errorMessage: "El servidor no responde" });

    expect(screen.getByRole("status")).toHaveTextContent(
      "El servidor no responde",
    );
  });

  it("should fall back to a generic message when the error carries no description", () => {
    renderStatus({ status: "error", errorMessage: "" });

    expect(screen.getByRole("status")).toHaveTextContent(
      "No se pudo guardar el cambio. Revisa tu conexión.",
    );
  });

  it("should offer a retry only when the error is retryable", () => {
    const onRetry = vi.fn();
    renderStatus({
      status: "error",
      errorMessage: "sin red",
      isRetryable: true,
      onRetry,
    });

    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("should not offer a retry for a validation error", () => {
    renderStatus({
      status: "error",
      errorMessage: "El DNI debe tener exactamente 8 caracteres",
    });

    expect(
      screen.queryByRole("button", { name: "Reintentar" }),
    ).not.toBeInTheDocument();
  });
});
