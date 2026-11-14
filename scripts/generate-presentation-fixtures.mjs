// Original synthetic fixtures, MIT like this repository. LibreOffice is used
// only to generate the committed legacy PPT and independent PDF references.
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";

const require = createRequire(import.meta.resolve("@web-ppt/core"));
const { zipSync, strToU8 } = require("fflate");
const output = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/components/file_view/components/pptx_preview_viewer/fixtures",
);
await fs.mkdir(output, { recursive: true });
const a = "http://schemas.openxmlformats.org/drawingml/2006/main";
const p = "http://schemas.openxmlformats.org/presentationml/2006/main";
const r = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
const xml = (body) =>
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>${body}`;
const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll('"', "&quot;");
const rels = (items) =>
  xml(
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${items.map(([id, type, target]) => `<Relationship Id="${id}" Type="${r}/${type}" Target="${target}"/>`).join("")}</Relationships>`,
  );
const xfrm = (x, y, w, h) =>
  `<a:xfrm><a:off x="${Math.round(x * 9525)}" y="${Math.round(y * 9525)}"/><a:ext cx="${Math.round(w * 9525)}" cy="${Math.round(h * 9525)}"/></a:xfrm>`;
let id = 1;
function shape(
  x,
  y,
  w,
  h,
  text,
  { color = "142D4E", fill, size = 24, bold = false, link } = {},
) {
  const current = ++id;
  return `<p:sp><p:nvSpPr><p:cNvPr id="${current}" name="${esc(text || "Forma")}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr>${xfrm(x, y, w, h)}<a:prstGeom prst="rect"><a:avLst/></a:prstGeom>${fill ? `<a:solidFill><a:srgbClr val="${fill}"/></a:solidFill>` : "<a:noFill/>"}<a:ln><a:noFill/></a:ln></p:spPr><p:txBody><a:bodyPr wrap="square" anchor="ctr" lIns="152400" rIns="152400" tIns="76200" bIns="76200"/><a:lstStyle/>${text
    .split("\n")
    .map(
      (line) =>
        `<a:p><a:pPr/><a:r><a:rPr lang="es-PE" sz="${size * 100}" b="${bold ? 1 : 0}"><a:solidFill><a:srgbClr val="${color}"/></a:solidFill><a:latin typeface="Arial"/>${link ? `<a:hlinkClick r:id="${link}" action="ppaction://hlinksldjump"/>` : ""}</a:rPr><a:t>${esc(line)}</a:t></a:r><a:endParaRPr lang="es-PE" sz="${size * 100}"/></a:p>`,
    )
    .join("")}</p:txBody></p:sp>`;
}
const groupStart =
  '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>';
const slide = (content, hidden = false) =>
  xml(
    `<p:sld xmlns:a="${a}" xmlns:r="${r}" xmlns:p="${p}"${hidden ? ' show="0"' : ""}><p:cSld><p:bg><p:bgPr><a:solidFill><a:srgbClr val="F5F7FA"/></a:solidFill><a:effectLst/></p:bgPr></p:bg><p:spTree>${groupStart}${content}</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>`,
  );
function table() {
  const rows = [
    ["Área", "Estado"],
    ["Documentos", "Listo"],
    ["Presentaciones", "En curso"],
    ["Hojas de cálculo", "Listo"],
  ];
  return `<p:graphicFrame><p:nvGraphicFramePr><p:cNvPr id="${++id}" name="Tabla de estados"/><p:cNvGraphicFramePr/><p:nvPr/></p:nvGraphicFramePr><p:xfrm><a:off x="609600" y="2190750"/><a:ext cx="5048250" cy="3333750"/></p:xfrm><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/table"><a:tbl><a:tblPr firstRow="1"/><a:tblGrid><a:gridCol w="3048000"/><a:gridCol w="2000250"/></a:tblGrid>${rows.map((row, i) => `<a:tr h="833437">${row.map((text) => `<a:tc><a:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="es-PE" sz="2000" b="${i === 0 ? 1 : 0}"><a:solidFill><a:srgbClr val="${i === 0 ? "FFFFFF" : "142D4E"}"/></a:solidFill><a:latin typeface="Arial"/></a:rPr><a:t>${esc(text)}</a:t></a:r></a:p></a:txBody><a:tcPr marL="152400" anchor="ctr"><a:solidFill><a:srgbClr val="${i === 0 ? "142D4E" : i % 2 ? "E7EDF5" : "FFFFFF"}"/></a:solidFill></a:tcPr></a:tc>`).join("")}</a:tr>`).join("")}</a:tbl></a:graphicData></a:graphic></p:graphicFrame>`;
}
const chart = xml(
  `<c:chartSpace xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:a="${a}"><c:lang val="es-PE"/><c:chart><c:autoTitleDeleted val="1"/><c:plotArea><c:layout/><c:barChart><c:barDir val="col"/><c:grouping val="clustered"/><c:ser><c:idx val="0"/><c:order val="0"/><c:tx><c:v>Avance</c:v></c:tx><c:spPr><a:solidFill><a:srgbClr val="3478C0"/></a:solidFill></c:spPr><c:cat><c:strLit><c:ptCount val="3"/>${["DOCX", "PPTX", "XLSX"].map((v, i) => `<c:pt idx="${i}"><c:v>${v}</c:v></c:pt>`).join("")}</c:strLit></c:cat><c:val><c:numLit><c:formatCode>0</c:formatCode><c:ptCount val="3"/>${[100, 85, 95].map((v, i) => `<c:pt idx="${i}"><c:v>${v}</c:v></c:pt>`).join("")}</c:numLit></c:val></c:ser><c:gapWidth val="150"/><c:axId val="1"/><c:axId val="2"/></c:barChart><c:catAx><c:axId val="1"/><c:scaling><c:orientation val="minMax"/></c:scaling><c:axPos val="b"/><c:crossAx val="2"/><c:tickLblPos val="nextTo"/></c:catAx><c:valAx><c:axId val="2"/><c:scaling><c:min val="0"/><c:max val="100"/><c:orientation val="minMax"/></c:scaling><c:axPos val="l"/><c:crossAx val="1"/><c:tickLblPos val="nextTo"/></c:valAx></c:plotArea><c:plotVisOnly val="1"/></c:chart></c:chartSpace>`,
);
const deck = {};
const put = (name, value) => {
  deck[name] = strToU8(value);
};
put(
  "[Content_Types].xml",
  xml(
    `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="svg" ContentType="image/svg+xml"/>${[["/ppt/presentation.xml", "presentationml.presentation.main"], ["/ppt/slideMasters/slideMaster1.xml", "presentationml.slideMaster"], ["/ppt/slideLayouts/slideLayout1.xml", "presentationml.slideLayout"], ...[1, 2, 3].map((i) => [`/ppt/slides/slide${i}.xml`, "presentationml.slide"]), ["/ppt/theme/theme1.xml", "theme"], ["/ppt/charts/chart1.xml", "drawingml.chart"]].map(([part, type]) => `<Override PartName="${part}" ContentType="application/vnd.openxmlformats-officedocument.${type}+xml"/>`).join("")}</Types>`,
  ),
);
put("_rels/.rels", rels([["rId1", "officeDocument", "ppt/presentation.xml"]]));
put(
  "ppt/presentation.xml",
  xml(
    `<p:presentation xmlns:a="${a}" xmlns:r="${r}" xmlns:p="${p}"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="master"/></p:sldMasterIdLst><p:sldIdLst>${[1, 2, 3].map((i) => `<p:sldId id="${255 + i}" r:id="slide${i}"/>`).join("")}</p:sldIdLst><p:sldSz cx="12192000" cy="6858000"/><p:notesSz cx="6858000" cy="9144000"/><p:defaultTextStyle/></p:presentation>`,
  ),
);
put(
  "ppt/_rels/presentation.xml.rels",
  rels([
    ["master", "slideMaster", "slideMasters/slideMaster1.xml"],
    ...[1, 2, 3].map((i) => [`slide${i}`, "slide", `slides/slide${i}.xml`]),
  ]),
);
put(
  "ppt/slideMasters/slideMaster1.xml",
  xml(
    `<p:sldMaster xmlns:a="${a}" xmlns:r="${r}" xmlns:p="${p}"><p:cSld><p:spTree>${groupStart}</p:spTree></p:cSld><p:clrMap accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" bg1="lt1" bg2="lt2" folHlink="folHlink" hlink="hlink" tx1="dk1" tx2="dk2"/><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="layout"/></p:sldLayoutIdLst><p:txStyles><p:titleStyle/><p:bodyStyle/><p:otherStyle/></p:txStyles></p:sldMaster>`,
  ),
);
put(
  "ppt/slideMasters/_rels/slideMaster1.xml.rels",
  rels([
    ["layout", "slideLayout", "../slideLayouts/slideLayout1.xml"],
    ["theme", "theme", "../theme/theme1.xml"],
  ]),
);
put(
  "ppt/slideLayouts/slideLayout1.xml",
  xml(
    `<p:sldLayout xmlns:a="${a}" xmlns:r="${r}" xmlns:p="${p}" type="blank"><p:cSld name="En blanco"><p:spTree>${groupStart}</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>`,
  ),
);
put(
  "ppt/slideLayouts/_rels/slideLayout1.xml.rels",
  rels([["master", "slideMaster", "../slideMasters/slideMaster1.xml"]]),
);
put(
  "ppt/theme/theme1.xml",
  xml(
    `<a:theme xmlns:a="${a}" name="Arxatec"><a:themeElements><a:clrScheme name="Arxatec">${Object.entries(
      {
        dk1: "142D4E",
        lt1: "FFFFFF",
        dk2: "213A57",
        lt2: "F5F7FA",
        accent1: "3478C0",
        accent2: "26A69A",
        accent3: "E7B44B",
        accent4: "7862AF",
        accent5: "D96E6E",
        accent6: "7A8FA6",
        hlink: "0563C1",
        folHlink: "954F72",
      },
    )
      .map(([key, value]) => `<a:${key}><a:srgbClr val="${value}"/></a:${key}>`)
      .join(
        "",
      )}</a:clrScheme><a:fontScheme name="Arial"><a:majorFont><a:latin typeface="Arial"/><a:ea typeface=""/><a:cs typeface=""/></a:majorFont><a:minorFont><a:latin typeface="Arial"/><a:ea typeface=""/><a:cs typeface=""/></a:minorFont></a:fontScheme><a:fmtScheme name="Arxatec"><a:fillStyleLst/><a:lnStyleLst/><a:effectStyleLst/><a:bgFillStyleLst/></a:fmtScheme></a:themeElements></a:theme>`,
  ),
);
put(
  "ppt/slides/slide1.xml",
  slide(
    shape(0, 0, 1280, 18, "", { fill: "3478C0" }) +
      shape(64, 80, 1152, 72, "ARXATEC · PRESENTACIONES", {
        size: 38,
        bold: true,
      }) +
      shape(64, 170, 1152, 96, "El diseño original, en nuestro visor", {
        size: 30,
      }) +
      shape(64, 320, 350, 170, "Texto seleccionable\nFuentes y posiciones", {
        fill: "E7EDF5",
      }) +
      shape(465, 320, 350, 170, "PPTX y PPT\nLectura en el navegador", {
        fill: "D8EFEB",
      }) +
      shape(866, 320, 350, 170, "Interfaz Arxatec\nZoom y miniaturas", {
        fill: "F6EBCF",
      }) +
      shape(64, 580, 600, 54, "Ver datos y diseño →", {
        size: 22,
        color: "3478C0",
        link: "next",
      }),
  ),
);
put(
  "ppt/slides/slide2.xml",
  slide(
    shape(64, 60, 1152, 80, "Datos y diseño", { size: 38, bold: true }) +
      table() +
      `<p:graphicFrame><p:nvGraphicFramePr><p:cNvPr id="${++id}" name="Gráfico de avance"/><p:cNvGraphicFramePr/><p:nvPr/></p:nvGraphicFramePr><p:xfrm><a:off x="6400800" y="2095500"/><a:ext cx="5181600" cy="3619500"/></p:xfrm><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart"><c:chart xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" r:id="chart"/></a:graphicData></a:graphic></p:graphicFrame>`,
  ),
);
put("ppt/charts/chart1.xml", chart);
put(
  "ppt/media/example.svg",
  '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320" viewBox="0 0 480 320"><rect width="480" height="320" fill="#142d4e"/><circle cx="240" cy="160" r="110" fill="#3478c0"/><path d="M175 215L240 90L305 215M201 170H279" fill="none" stroke="#fff" stroke-width="20"/></svg>',
);
put(
  "ppt/slides/slide3.xml",
  slide(
    shape(64, 60, 1152, 80, "Imágenes, grupos y enlaces", {
      size: 38,
      bold: true,
    }) +
      `<p:pic><p:nvPicPr><p:cNvPr id="${++id}" name="Imagen Arxatec"/><p:cNvPicPr/><p:nvPr/></p:nvPicPr><p:blipFill><a:blip r:embed="image"/><a:srcRect l="10000" r="10000"/><a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr>${xfrm(64, 230, 480, 320)}<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic>` +
      `<p:grpSp><p:nvGrpSpPr><p:cNvPr id="${++id}" name="Grupo"/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="6096000" y="2190750"/><a:ext cx="5334000" cy="3048000"/><a:chOff x="0" y="0"/><a:chExt cx="5334000" cy="3048000"/></a:xfrm></p:grpSpPr>${shape(0, 0, 560, 130, "Elementos agrupados", { fill: "D8EFEB", bold: true })}${shape(0, 160, 560, 130, "Volver al inicio →", { fill: "E7EDF5", link: "first" })}</p:grpSp>`,
    true,
  ),
);
put(
  "ppt/slides/_rels/slide1.xml.rels",
  rels([
    ["layout", "slideLayout", "../slideLayouts/slideLayout1.xml"],
    ["next", "slide", "slide2.xml"],
  ]),
);
put(
  "ppt/slides/_rels/slide2.xml.rels",
  rels([
    ["layout", "slideLayout", "../slideLayouts/slideLayout1.xml"],
    ["chart", "chart", "../charts/chart1.xml"],
  ]),
);
put(
  "ppt/slides/_rels/slide3.xml.rels",
  rels([
    ["layout", "slideLayout", "../slideLayouts/slideLayout1.xml"],
    ["image", "image", "../media/example.svg"],
    ["first", "slide", "slide1.xml"],
  ]),
);
const source = path.join(output, "presentation.pptx");
await fs.writeFile(source, zipSync(deck));
const profile = await fs.mkdtemp(
  path.join(tmpdir(), "arxatec-presentation-fixtures-"),
);
try {
  for (const format of [
    "ppt:MS PowerPoint 97",
    'pdf:impress_pdf_Export:{"ExportHiddenSlides":{"type":"boolean","value":"true"}}',
  ])
    execFileSync(
      "soffice",
      [
        `-env:UserInstallation=${pathToFileURL(profile).href}`,
        "--headless",
        "--convert-to",
        format,
        "--outdir",
        output,
        source,
      ],
      { stdio: "inherit" },
    );
  const fourByThree = {
    ...deck,
    "ppt/presentation.xml": strToU8(
      new TextDecoder()
        .decode(deck["ppt/presentation.xml"])
        .replace('cx="12192000"', 'cx="9144000"'),
    ),
  };
  const outerGroup = `<p:grpSp><p:nvGrpSpPr><p:cNvPr id="9999" name="Contenido 4:3"/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="857250"/><a:ext cx="9144000" cy="5143500"/><a:chOff x="0" y="0"/><a:chExt cx="12192000" cy="6858000"/></a:xfrm></p:grpSpPr>`;
  for (const index of [1, 2, 3]) {
    const key = `ppt/slides/slide${index}.xml`;
    fourByThree[key] = strToU8(
      new TextDecoder()
        .decode(deck[key])
        .replace(groupStart, groupStart + outerGroup)
        .replace("</p:spTree>", "</p:grpSp></p:spTree>"),
    );
  }
  await fs.writeFile(
    path.join(output, "presentation-4x3.pptx"),
    zipSync(fourByThree),
  );
} finally {
  await fs.rm(profile, { recursive: true, force: true });
}
