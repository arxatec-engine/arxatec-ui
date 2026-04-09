import {
  Badge,
  Calendar,
  InfoTooltip,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationController,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/exports";
import type { PaginationState } from "@/types";
import { ShowcaseBlock } from "../showcase_block";

interface Props {
  pagination: PaginationState;
  onSetPage: (page: number) => void;
}

export function TablesPaginationSection({ pagination, onSetPage }: Props) {
  return (
    <ShowcaseBlock
      title="Tablas y Paginación"
      description="Componentes de lectura de datos y navegación por volumen."
    >
      <div className="grid min-w-0 gap-5 xl:grid-cols-2">
        <div className="min-w-0 space-y-5 rounded-md border bg-card/20 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            Visualización de Datos
          </p>
          <div className="w-full min-w-0 max-w-full overflow-x-auto rounded-md border bg-background/50">
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

          <div className="flex w-full min-w-0 max-w-full justify-center overflow-x-auto p-4 rounded-md border border-dashed border-border/60 bg-background/30">
            <Calendar mode="single" className="min-w-0 shrink-0 scale-90" />
          </div>
        </div>

        <div className="min-w-0 space-y-5 rounded-md border bg-card/20 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            Navegación y Utilidades
          </p>
          <div className="w-full min-w-0 overflow-x-auto py-2">
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

          <div className="rounded-md border bg-background/40 p-3 text-xs text-muted-foreground">
            Pagina {pagination.page} de {pagination.total_pages}
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-2 pt-2">
            <Badge>new</Badge>
            <Badge variant="secondary">stable</Badge>
            <Badge variant="outline">ui-kit</Badge>
            <InfoTooltip info="Esta seccion valida estados de paginado y lectura." />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-16 rounded-md" />
            <Skeleton className="h-16 rounded-md" />
            <Skeleton className="h-16 rounded-md" />
          </div>
        </div>
      </div>
    </ShowcaseBlock>
  );
}
