"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBlogs } from "@/lib/hooks";
import Link from "next/link";
import { useState } from "react";

export default function Dashboard() {
  const { blogs, loading, error, addBlog } = useBlogs();
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    try {
      setIsSubmitting(true);
      await addBlog(url);
      setUrl("");
    } catch (err) {
      console.error("Failed to add blog:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <h1 className="text-4xl font-serif font-bold text-primary">Blog Automation</h1>
          <p className="mt-2 text-text-muted">Convert blog links to Obsidian notes</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Add Blog Section */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Add Blog Link</CardTitle>
                <CardDescription>Paste a blog URL to convert it to a note</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddBlog} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="url">Blog URL</Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://example.com/blog-post"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting || !url.trim()}>
                    {isSubmitting ? "Adding..." : "Add Blog"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="gap-4 flex flex-col">
                <Link href="/add">
                  <Button variant="outline" className="w-full justify-start">
                    + Add Blog
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="outline" className="w-full justify-start">
                    ⚙️ Settings
                  </Button>
                </Link>
                <Link href="/explorer">
                  <Button variant="outline" className="w-full justify-start">
                    📚 Explorer
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Blogs */}
        <div className="mt-12">
          <h2 className="text-2xl font-serif font-bold text-text mb-6">Recent Blogs</h2>

          {error && (
            <Card className="border-red-200 bg-red-50 mb-6">
              <CardContent className="pt-6">
                <p className="text-red-600">{error.message}</p>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="pt-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-text-muted">No blogs added yet. Start by adding a blog link above!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {blogs.map((blog) => (
                <Card key={blog.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-text">{blog.title}</h3>
                        <p className="text-sm text-text-muted mt-1">{blog.notePath}</p>
                        <p className="text-xs text-text-muted mt-2">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-4">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                          ✓ Added
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
