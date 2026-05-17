"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "./api-client";
import { Blog, Note, VaultConfig, DailyNote, ApiError } from "./types";

export function useBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const notes = await apiClient.getNotes("", "", 10);
        const formattedBlogs = notes.map((note) => ({
          id: note.path,
          url: "",
          title: note.title,
          notePath: note.path,
          status: "success" as const,
          createdAt: note.createdAt || new Date().toISOString(),
        }));
        setBlogs(formattedBlogs);
        setError(null);
      } catch (err: any) {
        setError({
          message: err.message || "Failed to fetch blogs",
          status: err.status || 500,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const addBlog = useCallback(async (url: string, vaultName?: string, folder?: string, linkTo?: string | string[]) => {
    try {
      setLoading(true);
      const response = await apiClient.importBlog({ url, vaultName, folder, linkTo });
      if (response.success) {
        const newBlog: Blog = {
          id: response.notePath,
          url,
          title: response.title,
          notePath: response.notePath,
          status: "success",
          createdAt: new Date().toISOString(),
        };
        setBlogs((prev) => [newBlog, ...prev]);
        setError(null);
        return newBlog;
      } else {
        throw new Error(response.error || "Failed to import blog");
      }
    } catch (err: any) {
      const apiError: ApiError = {
        message: err.message || "Failed to add blog",
        status: err.status || 500,
      };
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, []);

  return { blogs, loading, error, addBlog };
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const fetchedNotes = await apiClient.getNotes();
        setNotes(fetchedNotes);
        setError(null);
      } catch (err: any) {
        setError({
          message: err.message || "Failed to fetch notes",
          status: err.status || 500,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const getNote = useCallback(
    async (path: string) => {
      try {
        return await apiClient.getNote(path);
      } catch (err: any) {
        setError({
          message: err.message || "Failed to fetch note",
          status: err.status || 500,
        });
        throw err;
      }
    },
    []
  );

  return { notes, loading, error, getNote };
}

const VAULT_STORAGE_KEY = "blog-automation-vault";

function loadVaultFromStorage(): { vaultName?: string; folder?: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(VAULT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveVaultToStorage(config: { vaultName?: string; folder?: string }) {
  if (typeof window === "undefined") return;
  localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(config));
}

export function useVaultConfig() {
  const [config, setConfig] = useState<VaultConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const stored = loadVaultFromStorage();
    if (stored) {
      setConfig({
        vaultName: stored.vaultName || "",
        vaultPath: stored.folder || "",
      });
      setLoading(false);
    } else {
      const fetchConfig = async () => {
        try {
          const vaultInfo = await apiClient.getVaultInfo();
          setConfig({
            vaultName: vaultInfo.name,
            vaultPath: vaultInfo.path,
          });
          setError(null);
        } catch (err: any) {
          setError({
            message: err.message || "Failed to fetch vault config",
            status: err.status || 500,
          });
        } finally {
          setLoading(false);
        }
      };
      fetchConfig();
    }
  }, []);

  const updateConfig = useCallback(async (newConfig: VaultConfig) => {
    const toSave = {
      vaultName: newConfig.vaultName,
      folder: newConfig.vaultPath,
    };
    saveVaultToStorage(toSave);
    setConfig(newConfig);
  }, []);

  return { config, loading, error, updateConfig };
}

export function useDailyNote() {
  const [dailyNote, setDailyNote] = useState<DailyNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchDailyNote = async () => {
      try {
        setLoading(true);
        const note = await apiClient.getDailyNote();
        setDailyNote(note);
        setError(null);
      } catch (err: any) {
        setError({
          message: err.message || "Failed to fetch daily note",
          status: err.status || 500,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDailyNote();
  }, []);

  const appendToDaily = useCallback(async (content: string) => {
    try {
      const updated = await apiClient.appendToDailyNote(content);
      setDailyNote(updated);
      setError(null);
      return updated;
    } catch (err: any) {
      const apiError: ApiError = {
        message: err.message || "Failed to append to daily note",
        status: err.status || 500,
      };
      setError(apiError);
      throw apiError;
    }
  }, []);

  return { dailyNote, loading, error, appendToDaily };
}
