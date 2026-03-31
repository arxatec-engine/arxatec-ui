import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";

export function ShowcaseBlock({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card className="min-w-0 max-w-full overflow-hidden border-border/70 bg-card/75 backdrop-blur-sm">
      <CardHeader className="min-w-0 pb-4">
        <CardTitle className="font-serif text-3xl">{title}</CardTitle>
        {description ? (
          <p className="min-w-0 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </CardHeader>
      <CardContent className="min-w-0 overflow-x-hidden">{children}</CardContent>
    </Card>
  );
}
