export interface Config {
  openaiApiKey: string;
  obsidianVaultName: string;
}

export function loadConfig(): Config {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const obsidianVaultName = process.env.OBSIDIAN_VAULT_NAME || 'blog-vault';

  if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  return {
    openaiApiKey,
    obsidianVaultName,
  };
}

export const config = loadConfig();
