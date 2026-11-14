import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { usePresentationControls } from ".";

function Harness({ presenting = true }: { presenting?: boolean }) {
  const controls = usePresentationControls(presenting);
  return (
    <div
      data-testid="viewer"
      tabIndex={0}
      onPointerMove={controls.reveal}
      onPointerDown={controls.reveal}
      onKeyDown={controls.reveal}
    >
      <output aria-label="Estado de controles">
        {controls.visible ? "visible" : "hidden"}
      </output>
      <div
        data-testid="toolbar"
        onPointerEnter={controls.onPointerEnter}
        onPointerLeave={controls.onPointerLeave}
        onFocusCapture={controls.onFocusCapture}
        onBlurCapture={controls.onBlurCapture}
      >
        <button>Siguiente</button>
        <button>Salir</button>
      </div>
    </div>
  );
}

function advance(milliseconds: number) {
  act(() => vi.advanceTimersByTime(milliseconds));
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("presentation controls inactivity", () => {
  it("hides while idle and restarts the delay for pointer, touch and keyboard activity", () => {
    render(<Harness />);
    const state = screen.getByLabelText("Estado de controles");
    const viewer = screen.getByTestId("viewer");
    expect(state).toHaveTextContent("visible");
    advance(3000);
    expect(state).toHaveTextContent("hidden");
    fireEvent.pointerMove(viewer);
    expect(state).toHaveTextContent("visible");
    advance(2000);
    expect(state).toHaveTextContent("visible");
    fireEvent.pointerDown(viewer, { pointerType: "touch" });
    advance(2000);
    expect(state).toHaveTextContent("visible");
    fireEvent.keyDown(viewer, { key: "ArrowRight" });
    advance(2000);
    expect(state).toHaveTextContent("visible");
    advance(1000);
    expect(state).toHaveTextContent("hidden");
  });

  it("keeps controls available while hovered or focused and resumes hiding after leaving", () => {
    render(<Harness />);
    const state = screen.getByLabelText("Estado de controles");
    const toolbar = screen.getByTestId("toolbar");
    fireEvent.pointerEnter(toolbar);
    advance(10000);
    expect(state).toHaveTextContent("visible");
    fireEvent.pointerLeave(toolbar);
    advance(3000);
    expect(state).toHaveTextContent("hidden");
    act(() => screen.getByRole("button", { name: "Siguiente" }).focus());
    advance(10000);
    expect(state).toHaveTextContent("visible");
    act(() => screen.getByRole("button", { name: "Salir" }).focus());
    advance(10000);
    expect(state).toHaveTextContent("visible");
    act(() => screen.getByTestId("viewer").focus());
    advance(3000);
    expect(state).toHaveTextContent("hidden");
  });

  it("stays visible outside presentation, resets on reentry and clears timers on unmount", () => {
    const { rerender, unmount } = render(<Harness presenting={false} />);
    const state = screen.getByLabelText("Estado de controles");
    advance(10000);
    expect(state).toHaveTextContent("visible");
    expect(vi.getTimerCount()).toBe(0);
    rerender(<Harness />);
    expect(state).toHaveTextContent("visible");
    advance(3000);
    expect(state).toHaveTextContent("hidden");
    rerender(<Harness presenting={false} />);
    expect(state).toHaveTextContent("visible");
    expect(vi.getTimerCount()).toBe(0);
    rerender(<Harness />);
    expect(state).toHaveTextContent("visible");
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
