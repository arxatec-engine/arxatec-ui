import { useState } from "react";

import { Badge } from "@/components/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";

import { TABLE_PROJECTS } from "../../constants";
import { ComponentPreview } from "../component_preview";
import { ShowcaseBlock } from "../showcase_block";

export const TablesPaginationSection = () => {
  const [page, setPage] = useState(1);

  return (
    <ShowcaseBlock
      id="tablas"
      title="Tablas y paginación"
      description="Comparar información con orden y recorrerla a un ritmo manejable."
    >
      <ComponentPreview
        title="Table"
        description="Alinea información comparable en columnas estables. Los encabezados y los estados ayudan a recorrer los registros con rapidez."
      >
        <div className="overflow-hidden rounded-md border bg-background">
          <Table>
            <caption className="sr-only">
              Proyectos de ejemplo, página {page} de 3
            </caption>
            <TableHeader>
              <TableRow>
                <TableHead>Proyecto</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead className="text-right">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TABLE_PROJECTS.slice((page - 1) * 3, page * 3).map(
                ({ name, owner, status, variant }, index) => (
                  <TableRow key={name}>
                    <TableCell className="font-medium">
                      {String((page - 1) * 3 + index + 1).padStart(2, "0")}{" "}
                      <span className="ml-3">{name}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {owner}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={variant}>{status}</Badge>
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </div>
      </ComponentPreview>
      <ComponentPreview
        title="Pagination"
        description="Divide una lista larga en páginas. La página activa y los controles anterior y siguiente mantienen visible la posición actual."
      >
        <div className="space-y-5">
          <Pagination aria-label="Páginas de los proyectos de ejemplo">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#tablas"
                  aria-label="Página anterior"
                  aria-disabled={page === 1}
                  onClick={(event) => {
                    event.preventDefault();
                    setPage(Math.max(1, page - 1));
                  }}
                  className={page === 1 ? "opacity-40" : undefined}
                />
              </PaginationItem>
              {[1, 2, 3].map((number) => (
                <PaginationItem key={number}>
                  <PaginationLink
                    href="#tablas"
                    isActive={page === number}
                    aria-label={"Página " + number}
                    onClick={(event) => {
                      event.preventDefault();
                      setPage(number);
                    }}
                  >
                    {number}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#tablas"
                  aria-label="Página siguiente"
                  aria-disabled={page === 3}
                  onClick={(event) => {
                    event.preventDefault();
                    setPage(Math.min(3, page + 1));
                  }}
                  className={page === 3 ? "opacity-40" : undefined}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <p
            className="text-center text-sm text-muted-foreground"
            aria-live="polite"
          >
            Página {page} de 3 · Registros {(page - 1) * 3 + 1}–{page * 3} de 9
          </p>
        </div>
      </ComponentPreview>
    </ShowcaseBlock>
  );
};
