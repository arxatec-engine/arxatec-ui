import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ExcelJS from "exceljs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";

const output = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/components/file_view/components/xlsx_preview_viewer/fixtures",
);
await fs.mkdir(output, { recursive: true });
const workbook = new ExcelJS.Workbook();
const sheet = workbook.addWorksheet("Presupuesto");
sheet.columns = [
  { width: 30 },
  { width: 16 },
  { width: 18 },
  { width: 20 },
  { width: 18 },
];
sheet.mergeCells("A1:E2");
sheet.getCell("A1").value = "ARXATEC · PRESUPUESTO DE EJEMPLO";
sheet.getCell("A1").font = {
  name: "Arial",
  bold: true,
  size: 16,
  color: { argb: "FFFFFFFF" },
};
sheet.getCell("A1").fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF1E3A5F" },
};
sheet.getCell("A1").alignment = { vertical: "middle", horizontal: "center" };
sheet.getCell("A4").value = "Fecha";
sheet.getCell("B4").value = new Date("2026-11-12T00:00:00Z");
sheet.getCell("B4").numFmt = "dd/mm/yyyy";
sheet.getRow(6).values = [
  "Concepto",
  "Cantidad",
  "Precio",
  "Importe",
  "Avance",
];
for (const cell of sheet.getRow(6).model.cells) {
  const target = sheet.getCell(cell.address);
  target.font = { bold: true, color: { argb: "FF1E3A5F" } };
  target.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE5EDF5" },
  };
}
const items = [
  ["Asesoría", 3, 125, 0.5],
  ["Documentación", 2, 90, 0.75],
  ["Revisión", 1, 250, 1],
];
items.forEach(([name, quantity, price, progress], i) => {
  const row = 7 + i;
  sheet.getRow(row).values = [
    name,
    quantity,
    price,
    { formula: `B${row}*C${row}`, result: quantity * price },
    progress,
  ];
  sheet.getCell(`C${row}`).numFmt = '"S/ "#,##0.00';
  sheet.getCell(`D${row}`).numFmt = '"S/ "#,##0.00';
  sheet.getCell(`E${row}`).numFmt = "0%";
});
sheet.getCell("C11").value = "Total";
sheet.getCell("D11").value = { formula: "SUM(D7:D9)", result: 805 };
sheet.getCell("D11").numFmt = '"S/ "#,##0.00';
sheet.getCell("D11").font = { bold: true };
sheet.getCell("D11").border = {
  top: { style: "double", color: { argb: "FF1E3A5F" } },
};
sheet.mergeCells("A13:E14");
sheet.getCell("A13").value =
  "Datos sintéticos para comprobar la vista previa local y por URL. Esta nota usa texto con ajuste de línea.";
sheet.getCell("A13").alignment = { wrapText: true, vertical: "top" };
sheet.getRow(13).height = 30;
const second = workbook.addWorksheet("Condiciones");
second.getCell("A1").value = "Condiciones del servicio";
second.getCell("A1").font = { bold: true, size: 14 };
second.getColumn(1).width = 32;
second.getColumn(3).width = 42;
second.getCell("A3").value = "Plazo";
second.getCell("C3").value = "30 días";
workbook.addWorksheet("Oculta", { state: "hidden" }).getCell("A1").value =
  "No debe aparecer";
await workbook.xlsx.writeFile(path.join(output, "budget.xlsx"));
const conversion = await fs.mkdtemp(
  path.join(tmpdir(), "arxatec-excel-fixture-"),
);
try {
  execFileSync("soffice", [
    `-env:UserInstallation=${pathToFileURL(path.join(conversion, "profile")).href}`,
    "--headless",
    "--convert-to",
    "xls:MS Excel 97",
    "--outdir",
    conversion,
    path.join(output, "budget.xlsx"),
  ]);
  await fs.copyFile(
    path.join(conversion, "budget.xls"),
    path.join(output, "budget.xls"),
  );
} finally {
  await fs.rm(conversion, { recursive: true, force: true });
}
const large = new ExcelJS.Workbook();
const grid = large.addWorksheet("Datos extensos");
for (let row = 1; row <= 2000; row++) {
  grid.getRow(row).values = Array.from(
    { length: 30 },
    (_, column) => `${row}:${column + 1}`,
  );
}
grid.mergeCells("A1:P60");
grid.getCell("A1").value = "Combinada A1:P60";
grid.getCell("A1").fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFDBEAFE" },
};
await large.xlsx.writeFile(path.join(output, "large.xlsx"));
const empty = new ExcelJS.Workbook();
empty.addWorksheet("Hoja 1");
const hiddenAxes = empty.addWorksheet("Ejes ocultos");
for (let row = 1; row <= 100; row++) {
  hiddenAxes.getRow(row).height = 15;
  hiddenAxes.getRow(row).hidden = true;
}
for (let column = 1; column <= 26; column++)
  hiddenAxes.getColumn(column).hidden = true;
await empty.xlsx.writeFile(path.join(output, "empty.xlsx"));
