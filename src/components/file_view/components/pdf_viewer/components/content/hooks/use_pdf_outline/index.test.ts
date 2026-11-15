import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { DocumentOutlineItem } from "../../../../../document_outline";
import { usePdfOutline } from "./index";

describe("PDF outline", () => {
  it("keeps the bookmark hierarchy when building navigation entries", async () => {
    const viewport = document.createElement("div");
    const page = document.createElement("div");
    page.dataset.page = "1";
    viewport.append(page);
    const onOutline = vi.fn<(items: DocumentOutlineItem[]) => void>();
    const pdf = {
      getOutline: vi.fn().mockResolvedValue([
        {
          title: "Título",
          dest: [0, { name: "XYZ" }, 0, 800],
          items: [
            {
              title: "Subtítulo",
              dest: [0, { name: "XYZ" }, 0, 500],
              items: [],
            },
          ],
        },
      ]),
      getPage: vi.fn().mockResolvedValue({
        getViewport: () => ({
          height: 1000,
          convertToViewportPoint: (_x: number, y: number) => [0, 1000 - y],
        }),
      }),
    } as unknown as Parameters<ReturnType<typeof usePdfOutline>>[0];

    const { result } = renderHook(() => usePdfOutline({ current: viewport }, onOutline));
    result.current(pdf);
    await waitFor(() => expect(onOutline).toHaveBeenCalledOnce());
    expect(onOutline.mock.calls[0][0].map(({ title, level }) => ({ title, level }))).toEqual([
      { title: "Título", level: 0 },
      { title: "Subtítulo", level: 1 },
    ]);
  });
});
