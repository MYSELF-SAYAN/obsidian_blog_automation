"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVaultConfig } from "@/lib/hooks";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { config, updateConfig, loading, error } = useVaultConfig();
  const [vaultName, setVaultName] = useState("");
  const [vaultPath, setVaultPath] = useState("");
  const [dailyNotePath, setDailyNotePath] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (config) {
      setVaultName(config.vaultName || "");
      setVaultPath(config.vaultPath || "");
      setDailyNotePath(config.dailyNotePath || "");
    }
  }, [config]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateConfig({
        vaultName,
        vaultPath,
        dailyNotePath,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-2xl px-6 py-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">← Back to Dashboard</Button>
          </Link>
          <h1 className="text-4xl font-serif font-bold text-primary">Settings</h1>
          <p className="mt-2 text-text-muted">Configure your Obsidian vault</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-6 py-12">
        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-text-muted">Loading configuration...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error.message}</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Vault Configuration</CardTitle>
              <CardDescription>
                Update your Obsidian vault settings to control where notes are saved
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Vault Name */}
                <div className="space-y-2">
                  <Label htmlFor="vault-name" className="text-base font-medium">
                    Vault Name <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="vault-name"
                    type="text"
                    placeholder="My Vault"
                    value={vaultName}
                    onChange={(e) => setVaultName(e.target.value)}
                    disabled={isSaving}
                    className="text-base"
                  />
                  <p className="text-xs text-text-muted">
                    The name of your Obsidian vault
                  </p>
                </div>

                {/* Vault Path */}
                <div className="space-y-2">
                  <Label htmlFor="vault-path" className="text-base font-medium">
                    Vault Path <span className="text-text-muted">(optional)</span>
                  </Label>
                  <Input
                    id="vault-path"
                    type="text"
                    placeholder="/Users/username/Documents/My Vault"
                    value={vaultPath}
                    onChange={(e) => setVaultPath(e.target.value)}
                    disabled={isSaving}
                    className="text-base"
                  />
                  <p className="text-xs text-text-muted">
                    The file system path to your vault
                  </p>
                </div>

                {/* Daily Note Path */}
                <div className="space-y-2">
                  <Label htmlFor="daily-path" className="text-base font-medium">
                    Daily Note Path <span className="text-text-muted">(optional)</span>
                  </Label>
                  <Input
                    id="daily-path"
                    type="text"
                    placeholder="Daily/2024-01-15"
                    value={dailyNotePath}
                    onChange={(e) => setDailyNotePath(e.target.value)}
                    disabled={isSaving}
                    className="text-base"
                  />
                  <p className="text-xs text-text-muted">
                    Path where daily notes are stored
                  </p>
                </div>

                {/* Success Message */}
                {saved && (
                  <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                    <p className="text-sm text-green-600">✓ Settings saved successfully!</p>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    {isSaving ? "Saving..." : "Save Settings"}
                  </Button>
                  <Link href="/" className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
