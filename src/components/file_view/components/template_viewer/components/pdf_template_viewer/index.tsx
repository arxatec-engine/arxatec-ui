import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { PdfTemplateViewerContent } from "./components/pdf_template_viewer_content";
import type { Props } from "./types";


export const PdfTemplateViewer = (props: Props) => (
  <PdfTemplateViewerContent key={props.documentKey} {...props} />
);
