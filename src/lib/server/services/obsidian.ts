import { Obsidian } from 'obsidian-sdk';
import { config } from '../config';
import logger from '../logger';

const obsidian = new Obsidian({
  vault: config.obsidianVaultName,
});

function getObsidianClient(vaultName?: string): Obsidian {
  if (vaultName) {
    return new Obsidian({ vault: vaultName });
  }
  return obsidian;
}

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
}

export async function createNote(
  title: string,
  content: string,
  folder: string ,
  linkTo?: string | string[],
  vaultName?: string,
): Promise<string> {
  const effectiveFolder = folder && folder.trim() ? folder : '';
  const obsidian = getObsidianClient(vaultName);
  logger.obsidian(`Creating note: "${title}" in folder "${effectiveFolder}"${vaultName ? ` (vault: ${vaultName})` : ''}`);

  try {
    const filePath = `${effectiveFolder}/${sanitizeFileName(title)}.md`;

    await obsidian.notes.create({
      path: filePath,
      content: content
    });

    logger.obsidian(`Note created at: ${filePath}`);

    // Handle linking to existing notes
    if (linkTo) {
      const linkTargets = Array.isArray(linkTo) ? linkTo : [linkTo];

      for (const targetPath of linkTargets) {
        if (!targetPath) continue;

        try {
          logger.obsidian(`Creating link from "${filePath}" to "${targetPath}"`);
          await obsidian.linking.createLink({
            file: filePath,
            link: targetPath
          });
          logger.obsidian(`Link created successfully`);
        } catch (error) {
          logger.error(`Failed to create link from "${filePath}" to "${targetPath}"`, error instanceof Error ? error : { error });
        }
      }
    }

    return filePath;
  } catch (error) {
    logger.error(`Failed to create note: "${title}"`, error instanceof Error ? error : { error });
    throw error;
  }
}

export async function getNote(path: string): Promise<string | null> {
  logger.obsidian(`Reading note: ${path}`);

  try {
    const response = await obsidian.notes.read({ path });
    const content = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
    logger.obsidian(`Note read successfully, length: ${content.length}`);
    return content;
  } catch (error) {
    logger.error(`Failed to read note: ${path}`, error instanceof Error ? error : { error });
    return null;
  }
}

export async function updateNote(path: string, content: string): Promise<boolean> {
  logger.obsidian(`Updating note: ${path}`);

  try {
    await obsidian.notes.overwrite({ path, content });
    logger.obsidian(`Note updated successfully`);
    return true;
  } catch (error) {
    logger.error(`Failed to update note: ${path}`, error instanceof Error ? error : { error });
    return false;
  }
}

export async function appendToNote(path: string, content: string): Promise<boolean> {
  logger.obsidian(`Appending to note: ${path}`);

  try {
    const response = await obsidian.notes.read({ path });
    const existing = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
    const updated = existing + '\n' + content;
    await obsidian.notes.overwrite({ path, content: updated });
    logger.obsidian(`Content appended successfully`);
    return true;
  } catch (error) {
    logger.error(`Failed to append to note: ${path}`, error instanceof Error ? error : { error });
    return false;
  }
}

export async function getNoteMetrics(path: string): Promise<any> {
  logger.obsidian(`Getting metrics for note: ${path}`);

  try {
    const wordCount = await obsidian.metrics.wordCount(path);
    const outline = await obsidian.metrics.outline(path);
    logger.obsidian(`Metrics retrieved`);
    return { wordCount, outline };
  } catch (error) {
    logger.error(`Failed to get metrics for note: ${path}`, error instanceof Error ? error : { error });
    return null;
  }
}

export async function getNoteBacklinks(path: string): Promise<string[]> {
  logger.obsidian(`Getting backlinks for note: ${path}`);

  try {
    const response = await obsidian.linking.backlinks({ file: path });
    const backlinks = typeof response.data === 'string' ? [response.data] : Array.isArray(response.data) ? response.data : [];
    logger.obsidian(`Backlinks retrieved: ${backlinks.length} items`);
    return backlinks;
  } catch (error) {
    logger.error(`Failed to get backlinks for note: ${path}`, error instanceof Error ? error : { error });
    return [];
  }
}

export async function getNoteOutgoing(path: string): Promise<string[]> {
  logger.obsidian(`Getting outgoing links for note: ${path}`);

  try {
    const response = await obsidian.linking.outgoing({ file: path });
    const outgoing = typeof response.data === 'string' ? [response.data] : Array.isArray(response.data) ? response.data : [];
    logger.obsidian(`Outgoing links retrieved: ${outgoing.length} items`);
    return outgoing;
  } catch (error) {
    logger.error(`Failed to get outgoing links for note: ${path}`, error instanceof Error ? error : { error });
    return [];
  }
}

export async function listNotes(folder?: string, limit?: number): Promise<string[]> {
  logger.obsidian(`Listing notes${folder ? ` in folder: ${folder}` : ''}${limit ? `, limit: ${limit}` : ''}`);

  try {
    const response = await obsidian.files.list();
    const allNotes = typeof response.data === 'string' ? [response.data] : Array.isArray(response.data) ? response.data : [];
    const notes = folder ? allNotes.filter(n => n.includes(folder)).slice(0, limit) : allNotes.slice(0, limit);
    logger.obsidian(`Listed ${notes.length} notes`);
    return notes;
  } catch (error) {
    logger.error(`Failed to list notes`, error instanceof Error ? error : { error });
    return [];
  }
}

export async function getVaultInfo(): Promise<any> {
  logger.obsidian(`Getting vault info`);

  try {
    const vaults = await obsidian.vaults.listVaults();
    logger.obsidian(`Vault info retrieved`);
    return { vaults, currentVault: config.obsidianVaultName };
  } catch (error) {
    logger.error(`Failed to get vault info`, error instanceof Error ? error : { error });
    return null;
  }
}

export async function getDailyNote(): Promise<string | null> {
  logger.obsidian(`Getting daily note`);

  try {
    const response = await obsidian.daily.read();
    const content = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
    logger.obsidian(`Daily note retrieved`);
    return content;
  } catch (error) {
    logger.error(`Failed to get daily note`, error instanceof Error ? error : { error });
    return null;
  }
}

export async function appendToDailyNote(content: string): Promise<boolean> {
  logger.obsidian(`Appending to daily note`);

  try {
    await obsidian.daily.append({ content });
    logger.obsidian(`Appended to daily note`);
    return true;
  } catch (error) {
    logger.error(`Failed to append to daily note`, error instanceof Error ? error : { error });
    return false;
  }
}
