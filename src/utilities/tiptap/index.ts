import { type Editor } from "@tiptap/core";

export const NODE_HANDLES_SELECTED_STYLE_CLASSNAME =
  "node-handles-selected-style";

export function isValidUrl(url: string) {
  return /^https?:\/\/\S+$/.test(url);
}

export const duplicateContent = (editor: Editor) => {
  const { view } = editor;
  const { state } = view;
  const { selection } = state;

  editor
    .chain()
    .insertContentAt(
      selection.to,
      /* eslint-disable */
      // @ts-nocheck
      selection.content().content.firstChild?.toJSON(),
      {
        updateSelection: true,
      }
    )
    .focus(selection.to)
    .run();
};

export function getUrlFromString(str: string) {
  if (isValidUrl(str)) {
    return str;
  }
  try {
    if (str.includes(".") && !str.includes(" ")) {
      return new URL(`https://${str}`).toString();
    }
  } catch {
    return null;
  }
}

export function absoluteUrl(path: string) {
  // @ts-ignore
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

export const content = `
  <h1>Editor de documentos legales</h1>
  <p>Redacta tus documentos aquí y deja que la IA te ayude a generar, corregir o mejorar el contenido.</p>
  <p>Empieza a escribir y personaliza tus textos según tus necesidades. Recuerda revisar todo antes de usarlo oficialmente.</p>
`;
