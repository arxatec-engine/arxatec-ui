import { render, screen } from "@testing-library/react";
import { MailIcon } from "lucide-react";
import { describe, expect, it } from "vitest";
import { PropertyRow } from "@/components/property_row";

describe("PropertyRow", () => {
  it("should render its children as the value of the row", () => {
    render(
      <PropertyRow icon={MailIcon} label="Correo electrónico">
        <span>juan@gmail.com</span>
      </PropertyRow>,
    );

    expect(screen.getByText("juan@gmail.com")).toBeInTheDocument();
  });

  it("should name the property on the left, beside its icon", () => {
    render(
      <PropertyRow icon={MailIcon} label="Correo electrónico">
        <span>juan@gmail.com</span>
      </PropertyRow>,
    );

    expect(screen.getByText("Correo electrónico")).toBeInTheDocument();
  });

  it("should not use a real label element, because the value is not a form control", () => {
    const { container } = render(
      <PropertyRow icon={MailIcon} label="Correo electrónico">
        <span>juan@gmail.com</span>
      </PropertyRow>,
    );

    expect(container.querySelectorAll("label")).toHaveLength(0);
  });

  it("should render the status slot when it receives one", () => {
    render(
      <PropertyRow
        icon={MailIcon}
        label="Correo electrónico"
        status={<span data-testid="status">saving</span>}
      >
        <span>juan@gmail.com</span>
      </PropertyRow>,
    );

    expect(screen.getByTestId("status")).toBeInTheDocument();
  });

  it("should keep the status slot in place when there is no status, so the value never shifts", () => {
    const { container } = render(
      <PropertyRow icon={MailIcon} label="Correo electrónico">
        <span>juan@gmail.com</span>
      </PropertyRow>,
    );

    const slot = container.querySelector('span[aria-hidden="true"]');
    expect(slot).toBeInTheDocument();
    expect(slot).toBeEmptyDOMElement();
  });
});
