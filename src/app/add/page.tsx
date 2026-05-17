"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBlogs } from "@/lib/hooks";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";
import { useEffect, useState } from "react";
import BlogImportResult from "@/components/blog-import-result";
import Spinner from "@/components/ui/spinner";

export default function AddBlogPage() {
  const { addBlog } = useBlogs();
  const [url, setUrl] = useState("");
  const [vaultName, setVaultName] = useState("");
  const [folder, setFolder] = useState("");
  const [fileSearch, setFileSearch] = useState("");
  const [fileResults, setFileResults] = useState<string[]>([]);
  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [filesError, setFilesError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [result, setResult] = useState<{ title?: string; notePath?: string } | null>(null);

  const fetchFileResults = async (query = "") => {
    setFilesLoading(true);
    setFilesError(null);
    try {
      const results = await apiClient.searchNotePaths(query, undefined, 50);
      setFileResults(results);
    } catch (err: any) {
      setFilesError(err.message || "Unable to load vault files");
      setFileResults([]);
    } finally {
      setFilesLoading(false);
    }
  };

  useEffect(() => {
    fetchFileResults(fileSearch);
  }, [fileSearch]);

  const toggleLinkSelection = (notePath: string) => {
    setSelectedLinks((prev) =>
      prev.includes(notePath)
        ? prev.filter((path) => path !== notePath)
        : [...prev, notePath]
    );
  };

  const formatNoteLabel = (notePath: string) => notePath.split("/").pop()?.replace(/\.md$/i, "") || notePath;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!url.trim()) {
      setError("Please enter a blog URL");
      return;
    }

    if (!/^https?:\/\/.+/.test(url)) {
      setError("Please enter a valid URL starting with http:// or https://");
      return;
    }

    try {
      setIsSubmitting(true);
      const folderToUse = folder || "Imported/Blog";
      const blog = await addBlog(url, vaultName || undefined, folderToUse, selectedLinks.length ? selectedLinks : undefined);
      setResult({ title: blog.title, notePath: blog.notePath });
      setSuccess(`✓ Blog "${blog.title}" added successfully!`);
      setUrl("");
      setVaultName("");
      setFolder("");
      setSelectedLinks([]);
      // keep the user on the page so they can copy/open the note; redirect optional
      // setTimeout(() => router.push("/"), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to add blog. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white bg-claude-gradient">
        <div className="mx-auto max-w-2xl px-6 py-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">← Back to Dashboard</Button>
          </Link>
          <h1 className="text-4xl font-serif font-bold text-primary">Add Blog Link</h1>
          <p className="mt-2 text-text-muted">Convert any blog article to an Obsidian note</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-6 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Blog Link Details</CardTitle>
            <CardDescription>
              Paste the blog URL below and we'll convert it to a beautifully formatted Obsidian note
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Blog URL Input */}
              <div className="space-y-2">
                <Label htmlFor="url" className="text-base font-medium">
                  Blog URL <span className="text-primary">*</span>
                </Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/article-title"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isSubmitting}
                  className="text-base"
                />
                <p className="text-xs text-text-muted">
                  Enter the full URL of the blog post you want to save
                </p>
              </div>

              {/* Vault Name (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="vault" className="text-base font-medium">
                  Vault Name <span className="text-text-muted">(optional)</span>
                </Label>
                <Input
                  id="vault"
                  type="text"
                  placeholder="My Vault"
                  value={vaultName}
                  onChange={(e) => setVaultName(e.target.value)}
                  disabled={isSubmitting}
                  className="text-base"
                />
                <p className="text-xs text-text-muted">
                  Leave empty to use your default vault
                </p>
              </div>

              {/* Folder Path (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="folder" className="text-base font-medium">
                  Save to Folder <span className="text-text-muted">(optional)</span>
                </Label>
                <Input
                  id="folder"
                  type="text"
                  placeholder="Imported/Blog"
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                  disabled={isSubmitting}
                  className="text-base"
                />
                <p className="text-xs text-text-muted">
                  Folder path where the note will be saved in your vault
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                  <p className="text-sm text-green-600">{success}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !url.trim()}
                  className="flex-1 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" className="mr-3" />
                      Converting...
                    </>
                  ) : (
                    "Convert Blog"
                  )}
                </Button>
                <Link href="/" className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-8 border-primary/10 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Link To Existing Notes</CardTitle>
            <CardDescription>
              Search your vault and select notes to create backlinks automatically.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <Input
                  type="search"
                  placeholder="Search vault files..."
                  value={fileSearch}
                  onChange={(e) => setFileSearch(e.target.value)}
                  disabled={filesLoading || isSubmitting}
                  className="text-base"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFileSearch("");
                    setSelectedLinks([]);
                  }}
                  disabled={isSubmitting}
                >
                  Clear Selection
                </Button>
              </div>

              {filesError && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">
                  {filesError}
                </div>
              )}

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                {filesLoading ? (
                  <p className="text-sm text-text-muted">Loading vault files...</p>
                ) : fileResults.length === 0 ? (
                  <p className="text-sm text-text-muted">No matching files found.</p>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                    {fileResults.map((notePath) => (
                      <label
                        key={notePath}
                        className="group flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-primary/80 hover:bg-primary/5"
                      >
                        <input
                          type="checkbox"
                          checked={selectedLinks.includes(notePath)}
                          onChange={() => toggleLinkSelection(notePath)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-slate-900">{formatNoteLabel(notePath)}</div>
                          <div className="text-xs text-slate-500 font-mono truncate">{notePath}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {selectedLinks.length > 0 && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-slate-700">
                  <span className="font-medium text-primary">Selected links:</span> {selectedLinks.length} file(s) will be linked into this note.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Result Preview */}
        <BlogImportResult title={result?.title ?? null} notePath={result?.notePath ?? null} />

          {/* Info Section */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-4">
              <div className="flex-shrink-0 text-primary font-bold text-xl">1</div>
              <p className="text-sm">Paste the blog link above</p>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 text-primary font-bold text-xl">2</div>
              <p className="text-sm">We fetch and convert it to Markdown</p>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 text-primary font-bold text-xl">3</div>
              <p className="text-sm">The note is saved to your Obsidian vault</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
