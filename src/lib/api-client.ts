import axios, { AxiosInstance } from "axios";
import {
  BlogImportRequest,
  BlogImportResponse,
  Note,
  VaultInfo,
  NoteMetrics,
  BacklinksInfo,
  DailyNote,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const VAULT_STORAGE_KEY = "blog-automation-vault";

function getStoredVault(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const stored = localStorage.getItem(VAULT_STORAGE_KEY);
    return stored ? JSON.parse(stored).vaultName : undefined;
  } catch {
    return undefined;
  }
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private getVaultParams() {
    const vaultName = getStoredVault();
    return vaultName ? { vault: vaultName } : {};
  }

  async health() {
    const response = await this.client.get("/health");
    return response.data;
  }

  // Blog endpoints
  async importBlog(data: BlogImportRequest): Promise<BlogImportResponse> {
    const vaultParams = this.getVaultParams();
    const response = await this.client.post("/blog", { ...data, ...vaultParams });
    return response.data;
  }

  // Notes endpoints
  async getNotes(
    query?: string,
    path?: string,
    limit?: number
  ): Promise<Note[]> {
    const response = await this.client.get("/notes", {
      params: { query, path, limit },
    });
    const notePaths: string[] = response.data?.notes || [];
    return notePaths.map((notePath) => ({
      path: notePath,
      title: notePath.split('/').pop()?.replace(/\.md$/i, '') || notePath,
      createdAt: undefined,
      updatedAt: undefined,
      wordCount: 0,
      characterCount: 0,
    }));
  }

  async searchNotePaths(
    query?: string,
    path?: string,
    limit?: number
  ): Promise<string[]> {
    const response = await this.client.get("/notes", {
      params: { query, path, limit },
    });
    return response.data?.notes || [];
  }

  async getNote(path: string): Promise<Note> {
    const response = await this.client.get(`/notes/${path}`);
    return response.data;
  }

  async createNote(path: string, content: string): Promise<Note> {
    const response = await this.client.post("/notes", { path, content });
    return response.data;
  }

  async updateNote(path: string, content: string): Promise<Note> {
    const response = await this.client.put(`/notes/${path}`, { content });
    return response.data;
  }

  async appendToNote(path: string, content: string): Promise<Note> {
    const response = await this.client.post(`/notes/${path}/append`, {
      content,
    });
    return response.data;
  }

  async getNoteMetrics(path: string): Promise<NoteMetrics> {
    const response = await this.client.get(`/notes/${path}/metrics`);
    return response.data;
  }

  async getNoteBacklinks(path: string): Promise<BacklinksInfo> {
    const response = await this.client.get(`/notes/${path}/backlinks`);
    return response.data;
  }

  async getNoteOutgoing(path: string): Promise<BacklinksInfo> {
    const response = await this.client.get(`/notes/${path}/outgoing`);
    return response.data;
  }

  async getNoteHistory(path: string): Promise<any[]> {
    const response = await this.client.get(`/notes/${path}/history`);
    return response.data;
  }

  // Vault endpoints
  async getVaultInfo(): Promise<VaultInfo> {
    const response = await this.client.get("/vault");
    return response.data;
  }

  async getDailyNote(): Promise<DailyNote> {
    const response = await this.client.get("/daily");
    return response.data;
  }

  async appendToDailyNote(content: string): Promise<DailyNote> {
    const response = await this.client.post("/daily", { content });
    return response.data;
  }
}

export const apiClient = new ApiClient();
