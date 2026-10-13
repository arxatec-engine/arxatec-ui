import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../breadcrumb";
import { Fragment } from "react";

export interface ExplorerBreadcrumbItem {
  name: string;
  id: string | null;
}

export interface ExplorerBreadcrumbProps {
  items: ExplorerBreadcrumbItem[];
  onNavigate: (id: string | null, index: number) => void;
}

export const ExplorerBreadcrumb = ({
  items,
  onNavigate,
}: ExplorerBreadcrumbProps) => (
  <Breadcrumb>
    <BreadcrumbList>
      {items.map((item, idx) => (
        <Fragment key={item.id ?? "root"}>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="text-base">
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
