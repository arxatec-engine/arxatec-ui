import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { enUS } from "date-fns/locale";
import { EditableFieldsProvider } from "./index";
import { InlineEditableText } from "../inline_editable_text";
import { InlineDateField } from "../inline_date_field";
import { AutosaveStatus } from "../autosave_status";

describe("EditableFieldsProvider", () => {
  it("allows the consumer to change language without application imports", () => {
    render(
      <EditableFieldsProvider labels={{ empty: "Add value", saved: "Saved" }}>
        <InlineEditableText value="" ariaLabel="Name" onCommit={vi.fn()} />
        <AutosaveStatus
          status="saved"
          errorMessage={null}
          isRetryable={false}
          onRetry={vi.fn()}
        />
      </EditableFieldsProvider>,
    );
    expect(screen.getByRole("button", { name: "Name" })).toHaveTextContent(
      "Add value",
    );
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
  });
  it("formats dates using the consumer's locale and pattern", () => {
    render(
      <EditableFieldsProvider locale={enUS} dateFormat="MMMM d, yyyy">
        <InlineDateField
          value={new Date(2026, 9, 12)}
          onChange={vi.fn()}
          ariaLabel="Date"
          emptyText="Add date"
        />
      </EditableFieldsProvider>,
    );
    expect(screen.getByRole("button", { name: "Date" })).toHaveTextContent(
      "October 12, 2026",
    );
  });
  it("inherits parent configuration while overriding a single label", () => {
    render(
      <EditableFieldsProvider
        labels={{ empty: "Parent value", hint: "Press Enter" }}
      >
        <EditableFieldsProvider labels={{ empty: "Child value" }}>
          <InlineEditableText value="" ariaLabel="Name" onCommit={vi.fn()} />
        </EditableFieldsProvider>
      </EditableFieldsProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Name" }));
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "placeholder",
      "Child value",
    );
    expect(screen.getByText("Press Enter")).toBeInTheDocument();
  });
});
