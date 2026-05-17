"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useDailyNote } from "@/lib/hooks";
import Link from "next/link";
import { useState } from "react";

export default function DailyNotePage() {
  const { dailyNote, loading, error, appendToDaily } = useDailyNote();
  const [appendText, setAppendText] = useState("");
  const [isAppending, setIsAppending] = useState(false);

  const handleAppend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appendText.trim()) return;

    try {
      setIsAppending(true);
      await appendToDaily(appendText);
      setAppendText("");
    } catch (err) {
      console.error("Failed to append to daily note:", err);
    } finally {
      setIsAppending(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">← Back to Dashboard</Button>
          </Link>
          <h1 className="text-4xl font-serif font-bold text-primary">Today's Note</h1>
          <p className="mt-2 text-text-muted">View and edit your daily note</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        {error && (
          <Card className="border-red-200 bg-red-50 mb-6">
            <CardContent className="pt-6">
              <p className="text-red-600">{error.message}</p>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-text-muted">Loading daily note...</p>
            </CardContent>
          </Card>
        ) : dailyNote ? (
          <div className="space-y-6">
            {/* Current Content */}
            <Card>
              <CardHeader>
                <CardTitle>Current Content</CardTitle>
                <CardDescription>
                  {new Date(dailyNote.createdAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-6 text-base text-text whitespace-pre-wrap font-mono text-sm max-h-96 overflow-y-auto">
                  {dailyNote.content || "(empty)"}
                </div>
              </CardContent>
            </Card>

            {/* Append Section */}
            <Card>
              <CardHeader>
                <CardTitle>Add to Note</CardTitle>
                <CardDescription>
                  Append text to your daily note
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAppend} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="append-text">New Content</Label>
                    <textarea
                      id="append-text"
                      placeholder="Type or paste content to add..."
                      value={appendText}
                      onChange={(e) => setAppendText(e.target.value)}
                      disabled={isAppending}
                      rows={4}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-base font-sans focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={isAppending || !appendText.trim()}
                    >
                      {isAppending ? "Adding..." : "Add to Note"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setAppendText("")}
                      disabled={isAppending}
                    >
                      Clear
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-text-muted">No daily note found for today</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
