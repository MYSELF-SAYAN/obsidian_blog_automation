export interface VaultConfig {
  vaultName: string;
  vaultPath?: string;
  dailyNotePath?: string;
  backupPath?: string;
}

export interface Blog {
  id: string;
  url: string;
  title: string;
  notePath: string;
  status: "success" | "error" | "pending";
  createdAt: string;
  error?: string;
}

export interface Note {
  path: string;
  title: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
  wordCount?: number;
  characterCount?: number;
}

export interface NoteMetrics {
  wordCount: number;
  characterCount: number;
  outline: string[];
}

export interface VaultInfo {
  name: string;
  path: string;
  totalFiles: number;
}

export interface BacklinksInfo {
  incoming: string[];
  outgoing: string[];
}

export interface BlogImportRequest {
  url: string;
  vaultName?: string;
  folder?: string;
  linkTo?: string | string[];
}

export interface BlogImportResponse {
  success: boolean;
  notePath: string;
  title: string;
  error?: string;
}

export interface DailyNote {
  path: string;
  content: string;
  createdAt: string;
}

export interface ApiError {
  message: string;
  status: number;
}
