export interface ScrapedContent {
  title: string;
  content: string;
  url: string;
  publishedDate?: string;
  author?: string;
}

export interface BlogRequest {
  url: string;
  vaultName?: string;
  vault?: string;
  path?: string;
  folder?: string;
  linkTo?: string | string[];
}

export interface BlogResponse {
  success: boolean;
  notePath?: string;
  title?: string;
  error?: string;
}
