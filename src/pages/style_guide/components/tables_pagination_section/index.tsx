import { Badge } from "@/components/badge";
import { Calendar } from "@/components/calendar";
import { InfoTooltip } from "@/components/info_tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/pagination";
import { PaginationController } from "@/components/pagination_controller";
import { Skeleton } from "@/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import type { Pagination as PaginationType } from "@/types";

import { ShowcaseBlock } from "../showcase_block";

interface Props {
  pagination: PaginationType;
  onSetPage: (page: number) => void;
}

export function TablesPaginationSection({ pagination, onSetPage }: Props) {
  return (
    <ShowcaseBlock
      title="Tablas y Paginacion"
      description="Componentes de lectura de datos y navegacion por volumen."
    >
      <div className="grid min-w-0 gap-6 xl:grid-cols-2">
        <div className="min-w-0 space-y-4 rounded-xl border p-4">
          <div className="w-full min-w-0 max-w-full overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>001</TableCell>
                  <TableCell>Arxatec Legal</TableCell>
                  <TableCell>
                    <Badge>Activo</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>002</TableCell>
                  <TableCell>North Partners</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Revision</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="flex w-full min-w-0 max-w-full justify-center overflow-x-auto">
            <Calendar mode="single" className="min-w-0 shrink-0" />
          </div>
        </div>

        <div className="min-w-0 space-y-4 rounded-xl border p-4">
          <div className="w-full min-w-0 overflow-x-auto">
            <Pagination>
              <PaginationContent className="flex-wrap justify-center gap-y-2">
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          <PaginationController pagination={pagination} setPage={onSetPage} />

          <div className="rounded-md border p-3 text-sm text-muted-foreground">
            Pagina {pagination.page} de {pagination.total_pages}
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <Badge>new</Badge>
            <Badge variant="secondary">stable</Badge>
            <Badge variant="outline">ui-kit</Badge>
            <InfoTooltip info="Esta seccion valida estados de paginado y lectura." />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        </div>
      </div>
    </ShowcaseBlock>
  );
}
