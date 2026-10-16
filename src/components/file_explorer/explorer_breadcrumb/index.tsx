import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../breadcrumb";
import { Fragment } from "react";
import { cn } from "../../../utilities/class";

export interface ExplorerBreadcrumbItem {
  name: string;
  id: string | null;
}

export interface ExplorerBreadcrumbProps {
  items: ExplorerBreadcrumbItem[];
  onNavigate: (id: string | null, index: number) => void;
  linkClassName?: string;
}

export const ExplorerBreadcrumb = ({
  items,
  onNavigate,
  linkClassName,
}: ExplorerBreadcrumbProps) => (
  <Breadcrumb>
    <BreadcrumbList>
      {items.map((item, idx) => (
        <Fragment key={item.id ?? "root"}>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className={cn("text-base", linkClassName)}>
              <button type="button" onClick={() => onNavigate(item.id, idx)}>
                {item.name}
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {idx < items.length - 1 && <BreadcrumbSeparator />}
        </Fragment>
      ))}
    </BreadcrumbList>
  </Breadcrumb>
);
