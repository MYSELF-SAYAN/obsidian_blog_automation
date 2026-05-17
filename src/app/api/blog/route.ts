import { NextRequest, NextResponse } from 'next/server';
import { scrapeBlog } from '@/lib/server/services/scraper';
import { convertToMarkdown } from '@/lib/server/services/ai';
import { createNote } from '@/lib/server/services/obsidian';
import { BlogRequest, BlogResponse } from '@/lib/server/types';
import logger from '@/lib/server/logger';

export async function POST(req: NextRequest): Promise<NextResponse<BlogResponse>> {
  const requestId = Date.now();

  logger.api(`[${requestId}] New blog import request received`);

  try {
    const body = await req.json() as BlogRequest;
    const { url, linkTo, path, folder, vault, vaultName } = body;
    const effectivePath = path || folder || '';
    const effectiveVault = vault || vaultName || '';

    if (!url) {
      logger.warn(`[${requestId}] Request missing URL`);
      return NextResponse.json(
        {
          success: false,
          error: 'URL is required'
        },
        { status: 400 }
      );
    }

    logger.api(`[${requestId}] URL: ${url} path: ${effectivePath} vault: ${effectiveVault}`);
    if (linkTo) logger.api(`[${requestId}] Linking to: ${linkTo}`);
    if (effectiveVault) logger.api(`[${requestId}] Vault: ${effectiveVault}`);
    if (effectivePath) logger.api(`[${requestId}] Folder: ${effectivePath}`);

    logger.info(`[${requestId}] Step 1/3: Scraping blog content...`);
    const scrapedContent = await scrapeBlog(url);
    logger.success(`[${requestId}] Scraping complete: "${scrapedContent.title}"`);

    logger.info(`[${requestId}] Step 2/3: Converting to markdown with AI...`);
    const markdown = await convertToMarkdown(scrapedContent);
    logger.success(`[${requestId}] Markdown generated (${markdown.length} chars)`);

    logger.info(`[${requestId}] Step 3/3: Creating note in Obsidian...`);
    const notePath = await createNote(scrapedContent.title, markdown, effectivePath, linkTo, effectiveVault);
    logger.success(`[${requestId}] Note created at: ${notePath}`);

    return NextResponse.json({
      success: true,
      notePath,
      title: scrapedContent.title
    });
  } catch (error) {
    console.error(error)
    logger.error(
      `[${requestId}] Blog import failed`,
      error instanceof Error ? error : { error }
    );
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
