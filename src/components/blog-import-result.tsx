"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface Props {
  title?: string | null;
  notePath?: string | null;
}

export default function BlogImportResult({ title, notePath }: Props) {
  if (!title && !notePath) return null;

  const handleCopy = async () => {
    if (notePath && navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(notePath);
      } catch {
        // fallback ignored
      }
    }
  };

  return (
    <Card className="mt-6 border-emerald-200 bg-emerald-50">
      <CardHeader>
        <CardTitle className="text-lg">Import Result</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm text-slate-700">Title</div>
          <div className="font-medium text-base">{title}</div>

          <div className="pt-4 text-sm text-slate-700">Saved Path</div>
          <div className="flex items-center gap-3">
            <div className="font-mono text-xs text-slate-600 truncate">{notePath}</div>
            {notePath && (
              <div className="ml-auto flex gap-2">
                <Button size="sm" variant="ghost" onClick={handleCopy}>
                  Copy Path
                </Button>
                <Link href={`/#`}>
                  <Button size="sm">Open</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
