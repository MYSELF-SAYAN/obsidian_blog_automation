"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNotes } from "@/lib/hooks";
import Link from "next/link";
import { useState } from "react";

export default function ExplorerPage() {
  const { notes, loading, error } = useNotes();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">← Back to Dashboard</Button>
          </Link>
          <h1 className="text-4xl font-serif font-bold text-primary">Notes Explorer</h1>
          <p className="mt-2 text-text-muted">Browse and manage all your vault notes</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <Input
            type="search"
            placeholder="Search notes by title or path..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-base"
          />
        </div>

        {/* Content */}
        {error && (
          <Card className="border-red-200 bg-red-50 mb-6">
            <CardContent className="pt-6">
              <p className="text-red-600">{error.message}</p>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-text-muted">
                {notes.length === 0 ? "No notes yet" : "No notes match your search"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-text-muted mb-4">
              Showing {filteredNotes.length} of {notes.length} notes
            </p>
            {filteredNotes.map((note) => (
              <Card key={note.path} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-text">{note.title}</h3>
                        <p className="text-sm text-text-muted mt-1 font-mono">{note.path}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 text-xs text-text-muted">
                      <span>📝 {note.wordCount || 0} words</span>
                      <span>📊 {note.characterCount || 0} characters</span>
                      <span>✏️ {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
